export interface Coffee {
  _id: string;
  createdAt: string;
  userId: string;
  price: number;
}

export type CreateCoffeeDto = Omit<Coffee, '_id' | 'createdAt'>;
