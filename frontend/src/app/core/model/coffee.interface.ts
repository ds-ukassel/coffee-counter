export interface Coffee {
  _id: string;
  createdAt: string;
  userId: string;
  price: number;
}

export type CreateCoffeeDto = Omit<Coffee, '_id' | 'createdAt' | 'price'>;
export type FilterCoffeeDto = Partial<Coffee>;

export interface CoffeeDiagramData {
  hours: Record<number, number>;
  days: Record<number, number>;
}
