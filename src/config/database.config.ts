import { registerAs } from '@nestjs/config';

export default registerAs('database', () =>
  process.env.NODE_ENV === 'local'
    ? {
        HOST: 'localhost',
        PORT: 5433,
        NAME: 'dslocal',
        USERNAME: 'dev',
        PASSWORD: 'discorder',
      }
    : {
        HOST: process.env.DB_HOST,
        PORT: process.env.DB_PORT,
        NAME: process.env.DB_NAME,
        USERNAME: process.env.DB_USERNAME,
        PASSWORD: process.env.DB_PASSWORD,
      },
);
