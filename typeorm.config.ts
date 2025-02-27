import { DataSource } from 'typeorm';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [isProduction ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProduction ? 'dist/db/migrations/*.js' : 'src/db/migrations/*.ts'],
  migrationsTableName: 'migrations', // Optional: Stores applied migrations in a table
  synchronize: false,
  logging: true,
  migrationsRun: true, // Ensures migrations are always applied in production
});
