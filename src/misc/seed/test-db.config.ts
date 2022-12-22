import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

// This is supposed to be in-memory database for testing purposes.
export const initDbStoreForTests = async () => {
  try {
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
      type: 'sqlite',
      dbName: ':memory',
      multipleStatements: true,
    });

    return orm;
  } catch (err) {
    console.log(
      `Error Initializing In-process DB. Error Message: ${err.message}`,
    );
  }
};
