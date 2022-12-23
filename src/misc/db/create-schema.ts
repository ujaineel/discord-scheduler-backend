import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

(async () => {
  const orm = await MikroORM.init({
    entities: [
      './dist/**/entities/*.entity.ts',
      './dist/**/entities/*.entities.ts',
    ],
    entitiesTs: [
      './src/**/entities/*.entity.ts',
      './src/**/entities/*.entities.ts',
    ],
    discovery: {
      warnWhenNoEntities: false,
      alwaysAnalyseProperties: true,
    },
    metadataProvider: TsMorphMetadataProvider,
    type: 'postgresql',
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    migrations: {
      disableForeignKeys: false,
    },
  });
  const connection = orm.em.getDriver().getConnection();

  const generator = orm.getSchemaGenerator();
  const log = await generator.createSchema({
    wrap: true,
  });
  console.log(log);

  await orm.close(true);
})();
