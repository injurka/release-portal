import { db } from '../db'
import { releases, tickets } from '../db/schema'

const PROJECTS = [
  { name: 'frontend-portal', type: 'frontend', major: 1, minor: 2, patch: 0 },
  { name: 'backend-api', type: 'backend', major: 2, minor: 0, patch: 14 },
  { name: 'auth-service', type: 'backend', major: 1, minor: 1, patch: 5 },
  { name: 'mobile-app', type: 'frontend', major: 3, minor: 4, patch: 2 },
]

const ENVIRONMENTS = ['dev', 'test']
const USERS = ['gitlab-ci', 'argo-cd', 'alice.dev', 'bob.ops']
const BRANCH_PREFIXES = ['feat', 'fix', 'tech']

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
function randomDate(daysAgo: number): string {
  const now = Date.now()
  const past = now - daysAgo * 24 * 60 * 60 * 1000
  return new Date(past + Math.random() * (now - past)).toISOString().replace('T', ' ').slice(0, 19)
}
function generateTicketKey(): string {
  return `PSB-${Math.floor(Math.random() * 9000) + 1000}`
}

async function seed() {
  console.log('🌱 Начинаем генерацию моковых данных...')
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

    let branchName = 'master'
    const ticketsCount = Math.floor(Math.random() * 3) + 1
    const generatedKeys = Array.from({ length: ticketsCount }, () => generateTicketKey())

    if (env === 'dev')
      branchName = `${randomItem(BRANCH_PREFIXES)}/${generatedKeys[0]}`

    const [insertedRelease] = await db.insert(releases).values({
      project: project.name,
      tag: newTag,
      prev_tag: prevTag,
      branch: branchName,
      environment: env,
      trigger_user: randomItem(USERS),
      created_at: randomDate(14),
      type: project.type,
      meta: {
        description: `Release ${newTag} for ${project.name}`,
        repository_url: `https://gitlab.prosebya.ru/org/${project.name}`,
        pipeline_url: `https://gitlab.prosebya.ru/org/${project.name}/pipelines/${Math.floor(Math.random() * 100000)}`,
      },
    }).returning({ id: releases.id })

    releasesCount++
    for (const key of generatedKeys) {
      mockTickets.push({ release_id: insertedRelease.id, ticket_key: key })
    }
  }

  if (mockTickets.length > 0)
    await db.insert(tickets).values(mockTickets)
  console.log(`✅ Сгенерировано: ${releasesCount} релизов и ${mockTickets.length} тикетов.`)
}

seed().catch(console.error).finally(() => process.exit(0))
