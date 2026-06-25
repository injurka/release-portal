import { defineConfig } from 'drizzle-kit'
import { DB_PATH } from './src/config'

const dbPath = DB_PATH

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${dbPath}`,
  },
})
