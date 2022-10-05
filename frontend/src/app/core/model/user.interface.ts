export interface User {
  _id: string;
  name: string;
  avatar?: string;
  archived?: boolean;
  coffees: number;
  balance: string;
  achievements: number;
}

export type CreateUserDto = Omit<User, '_id'>;
export type UpdateUserDto = Partial<Pick<User, 'name' | 'avatar' | 'archived'>>;
