import apiClient from '@/apiClient';
export const userService = {
    updateMe: (payload) => apiClient.patch('/users/me', payload).then((r) => r.data),
};
