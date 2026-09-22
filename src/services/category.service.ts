import apiClient from '@/apiClient';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/interfaces/Category';

export const categoryService = {
  getAll: (): Promise<Category[]> => apiClient.get('/categories/my').then((r) => r.data),

  create: (payload: CreateCategoryPayload): Promise<Category> =>
    apiClient.post('/categories/create', payload).then((r) => r.data),

  update: (id: number, payload: UpdateCategoryPayload): Promise<Category> =>
    apiClient.patch(`/categories/${id}`, payload).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    apiClient.delete(`/categories/${id}`).then((r) => r.data),
};
