import {Purchase} from './purchase.interface';

export interface Shortcut extends Pick<Purchase, 'description' | 'total'> {
  icon: string;
}

export interface User {
  _id: string;
  name: string;
  avatar?: string;
  archived?: boolean;
  coffees: number;
  balance: string;
  achievements: number;
  shortcuts?: Shortcut[];
}

export type CreateUserDto = Omit<User, '_id'>;
export type UpdateUserDto = Partial<Pick<User, 'name' | 'avatar' | 'archived' | 'shortcuts'>>;
