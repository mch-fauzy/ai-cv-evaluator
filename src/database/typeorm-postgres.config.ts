import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { postgresConfig } from '../config';

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
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: postgresConfig.SYNCHRONIZE,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  extra: {
    options: `-c timezone=${postgresConfig.TIMEZONE}`,
  },
};

// Export for TypeORM CLI
export default new DataSource(typeOrmConfig);
