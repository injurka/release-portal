import { Elysia, t } from 'elysia'
import {
  createRelease,
  getAllReleases,
  getDashboardStats,
  getDigestReport,
  getReleasesByTicket,
  getUniqueProjects,
} from '../services/releases.service'

export const releasesPlugin = new Elysia({ prefix: '/api/releases' })
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
      start_date: t.Optional(t.String({ format: 'date-time' })),
      end_date: t.Optional(t.String({ format: 'date-time' })),
      limit: t.Optional(t.Numeric()),
    }),
  })
  .get('/stats', async () => {
    return await getDashboardStats()
  })
  .get('/digest', async ({ query }) => {
    return await getDigestReport(query.period as 'today' | 'week' | 'two-weeks', query.environment)
  }, {
    query: t.Object({
      period: t.Union([t.Literal('today'), t.Literal('week'), t.Literal('two-weeks')]),
      environment: t.Optional(t.String()),
    }),
  })
  .get('/users/:username', async ({ params, query }) => {
    return await getAllReleases({
      trigger_user: params.username,
      limit: query.limit,
    })
  }, {
    params: t.Object({ username: t.String() }),
    query: t.Object({ limit: t.Optional(t.Numeric()) }),
  })
  .get('/tickets/:ticket', async ({ params }) => {
    return await getReleasesByTicket(params.ticket)
  }, {
    params: t.Object({ ticket: t.String() }),
  })
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
      type: t.Optional(t.String()),
      meta: t.Optional(t.Any()), // JSON payload
    }),
  })
  .get('/projects', async () => {
    return await getUniqueProjects()
  })
  .get('/projects/:project', async ({ params, query }) => {
    return await getAllReleases({
      project: params.project,
      limit: query.limit,
    })
  }, {
    params: t.Object({ project: t.String() }),
    query: t.Object({ limit: t.Optional(t.Numeric()) }),
  })
