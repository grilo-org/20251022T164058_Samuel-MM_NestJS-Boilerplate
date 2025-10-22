import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import AppDataSource from '@/shared/infrastructure/database/data-source';
import { runSeeders } from 'typeorm-extension';
import CreateAdminSeeder from './001-create-admin.seeder';

dotenvConfig();

async function main(): Promise<void> {
  const ds = await AppDataSource.initialize();
  try {
    await runSeeders(ds, { seeds: [CreateAdminSeeder] });
  } finally {
    if (ds.isInitialized) await ds.destroy();
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
