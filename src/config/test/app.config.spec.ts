import AppConfig from '../app.config';

describe('App Config', () => {
  describe('local environment app config', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'local';
    });

    afterEach(() => {
      delete process.env.NODE_ENV;
    });

    it('should show correct localhost db details when NODE_ENV is local', () => {
      const appConfigValues = AppConfig();

      expect(appConfigValues).toEqual({
        PORT: 3535,
      });
    });
  });

  describe('dest environment db configs', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'dest';
      process.env.APP_PORT = '35353';
    });

    afterEach(() => {
      delete process.env.NODE_ENV;
      delete process.env.APP_PORT;
    });

    it('should show correct localhost db details when NODE_ENV is local', () => {
      const appConfigValues = AppConfig();

      expect(appConfigValues).toEqual({
        PORT: 35353,
      });
    });
  });
});
