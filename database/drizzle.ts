import { drizzle } from 'drizzle-orm/neon-http'
import config from '@/lib/config'
import { neon } from '@neondatabase/serverless'

const sql = neon(config.env.databaseUrl as string)

export const db = drizzle({ client: sql })
