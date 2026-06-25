import { db } from '../db'
import { releases, tickets } from '../db/schema'

// Список проектов
const PROJECTS = [
  { name: 'frontend-portal', major: 1, minor: 2, patch: 0 },
  { name: 'backend-api', major: 2, minor: 0, patch: 14 },
  { name: 'auth-service', major: 1, minor: 1, patch: 5 },
  { name: 'mobile-app', major: 3, minor: 4, patch: 2 },
]

// Стенды и пользователи
const ENVIRONMENTS = ['dev', 'test', 'prod']
const USERS = ['gitlab-ci', 'argo-cd', 'alice.dev', 'bob.ops']
const BRANCH_PREFIXES = ['feat', 'fix', 'tech']

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

function randomDate(daysAgo: number): string {
  const now = Date.now()
  const past = now - daysAgo * 24 * 60 * 60 * 1000
  const randomMs = past + Math.random() * (now - past)
  return new Date(randomMs).toISOString().replace('T', ' ').slice(0, 19)
}

function generateTicketKey(): string {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000
  return `PSB-${randomNumber}`
}

async function seed() {
  console.log('🌱 Начинаем генерацию моковых данных...')

  console.log('🗑️  Очистка старых данных...')
  await db.delete(tickets)
  await db.delete(releases)

  const mockTickets: { release_id: number, ticket_key: string }[] = []
  let releasesCount = 0

  for (let i = 0; i < 60; i++) {
    const project = randomItem(PROJECTS)
    const prevTag = `v${project.major}.${project.minor}.${project.patch}`

    const bump = Math.random()
    if (bump > 0.8)
      project.major++
    else if (bump > 0.4)
      project.minor++
    else project.patch++

    const newTag = `v${project.major}.${project.minor}.${project.patch}`
    const env = randomItem(ENVIRONMENTS)
    const trigger_user = randomItem(USERS)
    const created_at = randomDate(14) // Генерируем за последние 14 дней, чтобы был виден weekly отчет

    // Формируем логичное название ветки в зависимости от окружения
    let branchName = env // Для prod/test это обычно master или test
    const ticketsCount = Math.floor(Math.random() * 3) + 1 // 1-3 тикета
    const generatedKeys = Array.from({ length: ticketsCount }, () => generateTicketKey())

    if (env === 'dev') {
      // На dev часто едут фиче-ветки
      branchName = `${randomItem(BRANCH_PREFIXES)}/${generatedKeys[0]}`
    }
    else if (env === 'prod') {
      branchName = 'master'
    }

    const [insertedRelease] = await db.insert(releases).values({
      project: project.name,
      tag: newTag,
      prev_tag: prevTag,
      branch: branchName,
      environment: env,
      trigger_user,
      created_at,
    }).returning({ id: releases.id })

    releasesCount++

    for (const key of generatedKeys) {
      mockTickets.push({
        release_id: insertedRelease.id,
        ticket_key: key,
      })
    }
  }

  if (mockTickets.length > 0) {
    await db.insert(tickets).values(mockTickets)
  }

  console.log(`✅ Сгенерировано: ${releasesCount} релизов и ${mockTickets.length} тикетов.`)
}

seed()
  .catch((error) => {
    console.error('❌ Ошибка при генерации данных:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
