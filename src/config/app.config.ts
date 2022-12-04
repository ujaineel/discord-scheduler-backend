import { registerAs } from '@nestjs/config';

export default registerAs('app', () =>
  // If local environment, run app on Port 3535.
  process.env.NODE_ENV === 'local'
    ? {
        PORT: 3535,
      }
    : {
        PORT: parseInt(process.env.APP_PORT, 10),
      },
);
