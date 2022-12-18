import DatabaseConfig from '../db/database.config';

describe('Database Config', () => {
  describe('local environment db configs', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'local';
    });

    afterEach(() => {
      delete process.env.NODE_ENV;
    });

    it('should show correct localhost db details when NODE_ENV is local', () => {
      const dbConfigValues = DatabaseConfig();

      expect(dbConfigValues).toEqual({
        HOST: 'localhost',
        PORT: 5433,
        NAME: 'dslocal',
        USERNAME: 'dev',
        PASSWORD: 'discorder',
      });
    });
  });

  describe('dest environment db configs', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'dest';
      process.env.DB_HOST = 'dest_host';
      process.env.DB_PORT = '3535';
      process.env.DB_NAME = 'dest_db_name';
      process.env.DB_USERNAME = 'dest_username';
      process.env.DB_PASSWORD = 'dest_password';
    });

    afterEach(() => {
      delete process.env.NODE_ENV;
      delete process.env.DB_HOST;
      delete process.env.DB_PORT;
      delete process.env.DB_NAME;
      delete process.env.DB_USERNAME;
      delete process.env.DB_PASSWORD;
    });

    it('should show correct localhost db details when NODE_ENV is local', () => {
      const dbConfigValues = DatabaseConfig();

      expect(dbConfigValues).toEqual({
        HOST: 'dest_host',
        PORT: 3535,
        NAME: 'dest_db_name',
        USERNAME: 'dest_username',
        PASSWORD: 'dest_password',
      });
    });
  });
});
