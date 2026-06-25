import { relations, sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const releases = sqliteTable('releases', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  project: text('project').notNull(),
  tag: text('tag').notNull(),
  prev_tag: text('prev_tag'),
  branch: text('branch'),
  environment: text('environment').notNull(),
  trigger_user: text('trigger_user').notNull(),
  type: text('type').default('unknown'), 
  meta: text('meta', { mode: 'json' }), 
  created_at: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const tickets = sqliteTable('tickets', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  release_id: integer('release_id')
    .references(() => releases.id, { onDelete: 'cascade' })
    .notNull(),
  ticket_key: text('ticket_key').notNull(),
})

export const releasesRelations = relations(releases, ({ many }) => ({
  tickets: many(tickets),
}))

export const ticketsRelations = relations(tickets, ({ one }) => ({
  release: one(releases, {
    fields: [tickets.release_id],
    references: [releases.id],
  }),
}))
