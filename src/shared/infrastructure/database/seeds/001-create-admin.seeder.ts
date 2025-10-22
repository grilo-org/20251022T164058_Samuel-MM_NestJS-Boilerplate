import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import { UserTypeormEntity } from '@/users/infrastructure/persistence/user.typeorm.entity';
import { CryptoHashProvider } from '@/shared/infrastructure/providers/crypto-hash.provider';

export default class CreateAdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const users = dataSource.getRepository(UserTypeormEntity);

    const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
    const name = process.env.SEED_ADMIN_NAME ?? 'Admin';
    const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

    const exists = await users.findOne({ where: { email } });
    if (exists) return;

    const hasher = new CryptoHashProvider();
    const passwordHash = await hasher.hash(password);

    await users.insert({ name, email, passwordHash });
  }
}
