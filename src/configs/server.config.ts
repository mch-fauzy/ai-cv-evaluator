export const serverConfig = {
  PORT: process.env.SERVER_PORT || 3000,
  TIMEZONE: process.env.POSTGRES_TIMEZONE || 'UTC',
} as const;
