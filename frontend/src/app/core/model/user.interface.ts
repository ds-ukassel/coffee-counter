export interface User {
  _id: string;
  name: string;
  avatar?: string;
  coffees: number;
  balance: string;
  achievements: number;
}

export type CreateUserDto = Omit<User, '_id'>;
