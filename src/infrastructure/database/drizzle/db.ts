import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Prevent multiple connections in dev
const globalForDb = globalThis as unknown as { conn: Pool | undefined };

const conn = globalForDb.conn ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

console.log('DB Conn initialized. URL exists:', !!process.env.DATABASE_URL);

if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
