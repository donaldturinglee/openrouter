import {defineConfig} from 'drizzle-kit';

// Drizzle Kit reads this file's default export. It generates SQL migrations
// from the user service's tables into that service's migrations directory,
// and applies them to the PostgreSQL database at DATABASE_URL, which it also
// loads from .env.
export default defineConfig({
  dialect: 'postgresql',
  schema: './services/user_service/domain/*.ts',
  out: './services/user_service/migrations',
  dbCredentials: {
    // Drizzle Kit reports a missing URL itself when a command needs the
    // database, so generating migrations works without one.
    url: process.env.DATABASE_URL!,
  },
});
