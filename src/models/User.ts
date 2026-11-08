import { generateId } from '../utils/idGenerator';
import { IUser, IUserData } from './interfaces/IUser';

export class User implements IUser {
  constructor(
    private readonly name: string,
    private readonly email: string,
    private readonly id: string = generateId(),
  ) {}

  static fromJSON(data: IUserData): User {
    return new User(data.name, data.email, data.id);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  toJSON(): IUserData {
    return { id: this.id, name: this.name, email: this.email };
  }
}
