export interface User {
  _id: string;
  name: string;
  avatar: string;
  coffees: number;
  balance: number;
}

export type CreateUserDto = Pick<User, 'name' | 'avatar'>
