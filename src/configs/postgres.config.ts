export const postgresConfig = {
  HOST: process.env.POSTGRES_HOST,
  PORT: Number(process.env.POSTGRES_PORT) || 5432,
  DATABASE: process.env.POSTGRES_DATABASE,
  USERNAME: process.env.POSTGRES_USERNAME,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  SYNCHRONIZE: process.env.POSTGRES_SYNCHRONIZE === 'true',
  SSL: process.env.POSTGRES_SSL === 'true',
  SSL_REJECT_UNAUTHORIZED:
    process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED === 'true',
} as const;
