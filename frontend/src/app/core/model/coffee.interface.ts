export interface Coffee {
  _id: string;
  createdAt: string;
  userId: string;
  price: number;
  photo?: string;
}

export type CreateCoffeeDto = Omit<Coffee, '_id' | 'createdAt' | 'price'>;
export type FilterCoffeeDto = Partial<Coffee>;

export interface CoffeeDiagramData {
  hour: number;
  total: number;
}
