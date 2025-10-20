import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { postgresConfig } from '../configs/postgres.config';
import { serverConfig } from '../configs/server.config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: postgresConfig.HOST,
  port: postgresConfig.PORT,
  database: postgresConfig.DATABASE,
  username: postgresConfig.USERNAME,
  password: postgresConfig.PASSWORD,
  ssl: postgresConfig.SSL
    ? {
        rejectUnauthorized: postgresConfig.SSL_REJECT_UNAUTHORIZED,
      }
    : false,
  entities: ['src/modules/**/*.entity{.ts,.js}', 'src/common/**/*.entity{.ts,.js}'],
  synchronize: postgresConfig.SYNCHRONIZE,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['src/database/migrations/*{.ts,.js}'],
  extra: {
    options: `-c timezone=${serverConfig.TIMEZONE}`,
  },
};

// Export for TypeORM CLI
export default new DataSource(typeOrmConfig);
