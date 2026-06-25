import path from 'node:path'

export const PORT = Number.parseInt(process.env.PORT || '4446')

// --- Authentication ---
export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-local-key'

// --- Paths ---
export const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), '../db', 'releases.sqlite')
