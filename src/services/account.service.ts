import apiClient from '@/apiClient';
import type { Account, CreateAccountPayload } from '@/interfaces/Account';

export const accountService = {
  getAll: (): Promise<Account[]> => apiClient.get('/accounts/my').then((r) => r.data),

  create: (payload: CreateAccountPayload): Promise<Account> =>
    apiClient.post('/accounts/create', payload).then((r) => r.data),

  update: (id: string, payload: Partial<CreateAccountPayload>): Promise<Account> =>
    apiClient.patch(`/accounts/${id}`, payload).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/accounts/${id}`).then((r) => r.data),
};
