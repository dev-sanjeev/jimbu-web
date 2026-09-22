import apiClient from '@/apiClient';
export const categoryService = {
    getAll: () => apiClient.get('/categories/my').then((r) => r.data),
    create: (payload) => apiClient.post('/categories/create', payload).then((r) => r.data),
    update: (id, payload) => apiClient.patch(`/categories/${id}`, payload).then((r) => r.data),
    remove: (id) => apiClient.delete(`/categories/${id}`).then((r) => r.data),
};
