export interface Purchase {
  _id: string;
  createdAt: string;
  userId: string;

  description?: string;
  total: number;
}

export type CreatePurchaseDto = Omit<Purchase, '_id' | 'createdAt'>;
export type FindAllPurchaseDto = Omit<Purchase, '_id'>;
