import { Elysia, t } from 'elysia'
import {
  createRelease,
  getAllReleases,
  getDashboardStats,
  getReleasesByTicket,
  getUniqueProjects,
  getWeeklyReport,
} from '../services/releases.service'

export const releasesPlugin = new Elysia({ prefix: '/api/releases' })

  // 1. Получение всех релизов (с глубокой фильтрацией)
  .get('/', async ({ query }) => {
    return await getAllReleases({
      environment: query.environment,
      project: query.project,
      trigger_user: query.trigger_user,
      branch: query.branch,
      start_date: query.start_date,
      end_date: query.end_date,
      limit: query.limit,
    })
  }, {
    query: t.Object({
      environment: t.Optional(t.String()),
      project: t.Optional(t.String()),
      trigger_user: t.Optional(t.String()),
      branch: t.Optional(t.String()),
      start_date: t.Optional(t.String({ format: 'date-time' })), // Ожидаем YYYY-MM-DD или ISO
      end_date: t.Optional(t.String({ format: 'date-time' })),
      limit: t.Optional(t.Numeric()),
    }),
  })

  // 2. Статистика для дашборда (диаграммы, графики)
  .get('/stats', async () => {
    return await getDashboardStats()
  })

  // 3. Еженедельный дайджест (сгруппировано по проектам)
  .get('/weekly', async ({ query }) => {
    return await getWeeklyReport(query.environment)
  }, {
    query: t.Object({
      environment: t.Optional(t.String()),
    }),
  })

  // 4. Получить все релизы конкретного пользователя (автора)
  .get('/users/:username', async ({ params, query }) => {
    return await getAllReleases({
      trigger_user: params.username,
      limit: query.limit,
    })
  }, {
    params: t.Object({
      username: t.String(),
    }),
    query: t.Object({
      limit: t.Optional(t.Numeric()),
    }),
  })

  // 5. Получить все релизы конкретного проекта/микросервиса
  .get('/projects/:project', async ({ params, query }) => {
    return await getAllReleases({
      project: params.project,
      limit: query.limit,
    })
  }, {
    params: t.Object({
      project: t.String(),
    }),
    query: t.Object({
      limit: t.Optional(t.Numeric()),
    }),
  })

  // 6. Найти релизы по номеру Jira задачи (например: /api/releases/tickets/PSB-1234)
  .get('/tickets/:ticket', async ({ params }) => {
    return await getReleasesByTicket(params.ticket)
  }, {
    params: t.Object({
      ticket: t.String(),
    }),
  })

  // 7. Создание записи о релизе (вебхук из GitLab CI)
  .post('/', async ({ body, set }) => {
    try {
      await createRelease(body)

      set.status = 201
      return { success: true, message: 'Release logged successfully' }
    }
    catch (error) {
      console.error('Ошибка создания релиза:', error)
      set.status = 500
      return { success: false, error: 'Database error' }
    }
  }, {
    body: t.Object({
      project: t.String(),
      tag: t.String(),
      prev_tag: t.Optional(t.Nullable(t.String())),
      branch: t.Optional(t.Nullable(t.String())),
      environment: t.String(),
      trigger_user: t.String(),
      jira_tickets: t.Optional(t.Array(t.String())),
    }),
  })

  .get('/projects', async () => {
    return await getUniqueProjects()
  })

  // 5. Получить все релизы конкретного проекта/микросервиса
  .get('/projects/:project', async ({ params, query }) => {
    return await getAllReleases({
      project: params.project,
      limit: query.limit,
    })
  }, {
    params: t.Object({ project: t.String() }),
    query: t.Object({ limit: t.Optional(t.Numeric()) }),
  })
