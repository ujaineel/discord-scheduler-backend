import { registerAs } from '@nestjs/config';

export default registerAs('app', () =>
  process.env.NODE_ENV === 'local'
    ? {
        PORT: 3535,
      }
    : {
        PORT: process.env.APP_PORT,
      },
);
