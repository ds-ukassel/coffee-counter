export interface Coffee {
  _id: string;
  createdAt: string;
  userId: string;
}

export type CreateCoffeeDto = Omit<Coffee, '_id' | 'createdAt'>;
