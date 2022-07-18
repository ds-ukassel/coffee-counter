export interface Coffee {
  _id: string;
  createdAt: string;
  userId: string;
  price: number;
}

export type CreateCoffeeDto = Omit<Coffee, '_id' | 'createdAt'>;


export type CoffeeDiagramData = {
  _id : number,
  total: number
}
