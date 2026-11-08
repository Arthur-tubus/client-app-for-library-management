export interface IUserData {
  id: string;
  name: string;
  email: string;
}

export interface IUser {
  getId(): string;
  getName(): string;
  getEmail(): string;
  toJSON(): IUserData;
}
