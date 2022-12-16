import {
  Entity,
  Property,
  PrimaryKey,
  Enum,
  Unique,
  BeforeCreate,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

enum CreationSource {
  Local = 'local',
  Discord = 'discord',
}

export const enum UserStatus {
  DISABLED,
  ACTIVE,
}

@Entity()
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ unique: true })
  @Unique()
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  hashedPassword!: string;

  @Enum({ default: CreationSource.Local })
  source?: CreationSource;

  @Enum({ default: UserStatus.ACTIVE })
  status?: UserStatus;

  // TODO: Change this to tasks collection.
  @Property({ nullable: true })
  tasks?: string[];

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }

  @BeforeCreate()
  async convertPasswordHash() {
    try {
      bcrypt.genSalt((err, salt) => {
        if (err) {
          throw err;
        }
        bcrypt.hash(this.hashedPassword, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          this.hashedPassword = hash;
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
