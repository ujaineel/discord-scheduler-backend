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
  registerSource?: CreationSource = CreationSource.LOCAL;

  @Enum(() => UserStatus)
  status?: UserStatus = UserStatus.ACTIVE;

  // TODO: Change this to tasks collection.
  @Property({ nullable: true })
  tasks?: unknown[];

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  createdAt: Date = new Date();

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.tasks = [];
  }

  @BeforeCreate()
  async convertPasswordHash() {
    let hash: string;
    try {
      const salt = await bcrypt.genSalt(11);
      console.log(salt);
      hash = await bcrypt.hash(this.password, salt);
      console.log(hash);
    } catch (err) {
      throw err;
    }

    this.password = hash;
  }
}
