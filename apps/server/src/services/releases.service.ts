import { and, count, desc, eq, gte, like, lte } from 'drizzle-orm'
import { db } from '../db'
import { releases, tickets } from '../db/schema'

// 1. Получение релизов с мощной фильтрацией
export async function getAllReleases(filters?: {
  environment?: string
  project?: string
  trigger_user?: string
  branch?: string
  start_date?: string
  end_date?: string
  limit?: number
}) {
  const conditions = []

  if (filters?.environment)
    conditions.push(eq(releases.environment, filters.environment))
  if (filters?.project)
    conditions.push(eq(releases.project, filters.project))
  if (filters?.trigger_user)
    conditions.push(eq(releases.trigger_user, filters.trigger_user))
  if (filters?.branch)
    conditions.push(eq(releases.branch, filters.branch))
  if (filters?.start_date)
    conditions.push(gte(releases.created_at, filters.start_date))
  if (filters?.end_date)
    conditions.push(lte(releases.created_at, filters.end_date))

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const results = await db.query.releases.findMany({
    where: whereClause,
    with: { tickets: true },
    orderBy: [desc(releases.created_at)],
    limit: filters?.limit || 100,
  })

  return results.map(release => ({
    ...release,
    jira_tickets: release.tickets.map(t => t.ticket_key),
  }))
}

// 2. Еженедельный дайджест (Текущая и прошлая неделя)
export async function getWeeklyReport(env?: string) {
  const now = new Date()

  // Получаем день недели (0 - воскресенье, 1 - понедельник и т.д.)
  const day = now.getDay()
  // Если сегодня воскресенье (0), отнимаем 6 дней. Иначе отнимаем (day - 1)
  const diffToMonday = day === 0 ? -6 : 1 - day

  // Понедельник текущей недели (00:00:00)
  const currentMonday = new Date(now)
  currentMonday.setDate(now.getDate() + diffToMonday)
  currentMonday.setHours(0, 0, 0, 0)

  // Воскресенье текущей недели (23:59:59)
  const currentSunday = new Date(currentMonday)
  currentSunday.setDate(currentMonday.getDate() + 7)
  currentSunday.setMilliseconds(-1)

  // Понедельник прошлой недели
  const previousMonday = new Date(currentMonday)
  previousMonday.setDate(currentMonday.getDate() - 7)

  // Воскресенье прошлой недели
  const previousSunday = new Date(currentMonday)
  previousSunday.setMilliseconds(-1)

  // Утилиты форматирования
  const toSqliteDate = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19)
  const toStr = (d: Date) => d.toLocaleDateString('ru-RU') // Даст формат DD.MM.YYYY

  const prevMondaySql = toSqliteDate(previousMonday)
  const currMondaySql = toSqliteDate(currentMonday)

  // Запрашиваем все релизы, начиная с понедельника ПРОШЛОЙ недели
  const conditions = [gte(releases.created_at, prevMondaySql)]
  if (env)
    conditions.push(eq(releases.environment, env))

  const results = await db.query.releases.findMany({
    where: and(...conditions),
    with: { tickets: true },
    orderBy: [desc(releases.created_at)],
  })

  const currentWeekData: Record<string, any[]> = {}
  const previousWeekData: Record<string, any[]> = {}

  // Распределяем данные по двум корзинам (неделям)
  results.forEach((curr) => {
    const item = { ...curr, jira_tickets: curr.tickets.map(t => t.ticket_key) }

    // Если дата релиза больше или равна текущему понедельнику
    if (curr.created_at >= currMondaySql) {
      if (!currentWeekData[curr.project])
        currentWeekData[curr.project] = []
      currentWeekData[curr.project].push(item)
    }
    else {
      if (!previousWeekData[curr.project])
        previousWeekData[curr.project] = []
      previousWeekData[curr.project].push(item)
    }
  })

  return {
    currentWeek: {
      dateRange: `${toStr(currentMonday)} — ${toStr(currentSunday)}`,
      data: currentWeekData,
    },
    previousWeek: {
      dateRange: `${toStr(previousMonday)} — ${toStr(previousSunday)}`,
      data: previousWeekData,
    },
  }
}

// 3. Поиск всех релизов, в которые попала конкретная задача из Jira
export async function getReleasesByTicket(ticketKey: string) {
  const foundTickets = await db.query.tickets.findMany({
    where: like(tickets.ticket_key, `%${ticketKey.toUpperCase()}%`),
    with: {
      release: {
        with: {
          tickets: true,
        },
      },
    },
    orderBy: [desc(tickets.id)],
  })

  const uniqueReleases = new Map()

  for (const t of foundTickets) {
    if (!uniqueReleases.has(t.release.id)) {
      uniqueReleases.set(t.release.id, {
        ...t.release,
        jira_tickets: t.release.tickets.map(ticket => ticket.ticket_key),
      })
    }
  }

  return Array.from(uniqueReleases.values())
}

// 4. Получение дашборд-статистики (для виджетов на Vue)
export async function getDashboardStats() {
  const [totalReleases] = await db.select({ value: count() }).from(releases)

  const releasesByEnv = await db.select({
    environment: releases.environment,
    count: count(),
  }).from(releases).groupBy(releases.environment)

  const topProjects = await db.select({
    project: releases.project,
    count: count(),
  }).from(releases).groupBy(releases.project).orderBy(desc(count())).limit(5)

  const topUsers = await db.select({
    user: releases.trigger_user,
    count: count(),
  }).from(releases).groupBy(releases.trigger_user).orderBy(desc(count())).limit(5)

  return {
    total: totalReleases.value,
    by_environment: releasesByEnv,
    top_projects: topProjects,
    top_users: topUsers,
  }
}

// 5. Создание релиза
export async function createRelease(payload: {
  project: string
  tag: string
  prev_tag?: string | null
  branch?: string | null
  environment: string
  trigger_user: string
  jira_tickets?: string[]
}) {
  const allTickets = new Set<string>(payload.jira_tickets || [])
  if (payload.branch) {
    const regex = /[A-Z]+-\d+/g
    const matches = payload.branch.match(regex)
    if (matches) {
      matches.forEach(m => allTickets.add(m))
    }
  }

  return await db.transaction(async (tx) => {
    const [newRelease] = await tx.insert(releases).values({
      project: payload.project,
      tag: payload.tag,
      prev_tag: payload.prev_tag,
      branch: payload.branch,
      environment: payload.environment,
      trigger_user: payload.trigger_user,
    }).returning({ id: releases.id })

    if (allTickets.size > 0) {
      const ticketsToInsert = Array.from(allTickets).map(ticket => ({
        release_id: newRelease.id,
        ticket_key: ticket.toUpperCase(),
      }))
      await tx.insert(tickets).values(ticketsToInsert)
    }

    return newRelease
  })
}

export async function getUniqueProjects() {
  const results = await db
    .select({ project: releases.project })
    .from(releases)
    .groupBy(releases.project)

  return results.map(r => r.project)
}
