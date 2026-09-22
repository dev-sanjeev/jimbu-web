export type CategoryType = 'expense' | 'income';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

export interface CreateCategoryPayload {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  icon?: string;
  color?: string;
}
