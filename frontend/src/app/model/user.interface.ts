export interface User {
  _id: string;
  name: string;
  avatar?: string;
  coffees: number;
  balance: string;
}

export type CreateUserDto = Omit<User, '_id'>;
