import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from '../../users/entities/users.entity';
import { createRandomUser } from './user-entity.dump';

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
    dbName: 'dslocal',
    host: 'localhost',
    port: 5433,
    user: 'dev',
    password: 'discorder',
    migrations: {
      disableForeignKeys: false,
    },
    allowGlobalContext: true,
  });

  try {
    const em = orm.em as EntityManager;
    const userRepository = em.getRepository(User);

    const users = [];

    for (let i = 0; i < 100; i++) {
      const fakeUser = createRandomUser();
      console.log('User: \n');
      console.log(fakeUser);
      console.log('\n');
      users.push(fakeUser);
    }

    users.forEach(async (user) => {
      console.log('Saving user to db \n');
      console.log(user);
      const newUser = await userRepository.create(user);
      await userRepository.persistAndFlush(newUser);
    });

    console.log('done');
  } catch (err) {
    console.log(err);
  }
})();
