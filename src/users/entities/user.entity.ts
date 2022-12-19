import {
  Entity,
  Property,
  PrimaryKey,
  // Enum,
  Unique,
  BeforeCreate,
  AfterCreate,
  OnInit,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';

/* enum CreationSource {
  Local = 'local',
  Discord = 'discord',
}

export const enum UserStatus {
  DISABLED,
  ACTIVE,
} */

@Entity()
export class User {
  @PrimaryKey({ unique: true })
  id: string = v4();

  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  hashedPassword!: string;

  /*   @Enum({ default: CreationSource.Local })
  source?: CreationSource;

  @Enum({ default: UserStatus.ACTIVE })
  status?: UserStatus; */

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
    this.hashedPassword = password;
  }

  async convertPasswordHash(password: string): Promise<string> {
    let hash: string;
    try {
      const salt = await bcrypt.genSalt(11);
      hash = await bcrypt.hash(password, salt);
    } catch (err) {
      throw err;
    }

    return hash;
  }
}
