import {
  Entity,
  Property,
  PrimaryKey,
  Enum,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';

enum CreationSource {
  LOCAL = 'local',
  DISCORD = 'discord',
}

enum UserStatus {
  DISABLED = 'disabled',
  ACTIVE = 'active',
  DELETED = 'deleted',
}

@Entity()
export class User {
  @PrimaryKey({ unique: true })
  id: string = v4();

  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ name: 'hash' })
  password!: string;

  @Enum(() => CreationSource)
  registerSource: CreationSource;

  @Enum(() => UserStatus)
  status: UserStatus;

  // TODO: Change this to tasks collection.
  @Property({ nullable: true })
  tasks?: unknown[];

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  constructor(
    username: string,
    password: string,
    email: string,
    registerSource?: CreationSource,
    status?: UserStatus,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.registerSource = registerSource || CreationSource.LOCAL;
    this.status = status || UserStatus.ACTIVE;
    this.tasks = [];
  }

  @BeforeCreate()
  async convertPasswordHash() {
    let hash: string;
    try {
      const salt = await bcrypt.genSalt(11);
      hash = await bcrypt.hash(this.password, salt);
    } catch (err) {
      throw err;
    }

    this.password = hash;
  }
}
