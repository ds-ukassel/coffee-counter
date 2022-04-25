export interface Coffee {
  createdAt: string;
  userId: string;
}

export type CreateCoffeeDto = Omit<Coffee, 'createdAt'>;
