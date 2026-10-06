import { TransactionType } from '@/interfaces/Transaction';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  icon?: string;
  color?: string;
}
