import type { Config } from 'drizzle-kit';

export default {
  schema: './server/db/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'orquestrador',
    password: 'orquestrador123',
    database: 'orquestraia',
  },
} satisfies Config;
