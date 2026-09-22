import apiClient from '@/apiClient';
export const accountService = {
    getAll: () => apiClient.get('/accounts/my').then((r) => r.data),
    create: (payload) => apiClient.post('/accounts/create', payload).then((r) => r.data),
    update: (id, payload) => apiClient.patch(`/accounts/${id}`, payload).then((r) => r.data),
    remove: (id) => apiClient.delete(`/accounts/${id}`).then((r) => r.data),
};
