import apiClient from '@/apiClient';
const normalizeTransaction = (t) => ({
    ...t,
    amount: typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount,
    type: String(t.type).toLowerCase(),
});
const normalize = (raw) => ({
    ...raw,
    data: raw.data.map(normalizeTransaction),
});
const buildParams = (cursor, filters) => {
    const params = {};
    if (cursor)
        params.cursor = cursor;
    if (filters?.type)
        params.type = filters.type;
    if (filters?.categoryId !== undefined)
        params.categoryId = filters.categoryId;
    if (filters?.startDate)
        params.startDate = filters.startDate;
    if (filters?.endDate)
        params.endDate = filters.endDate;
    if (filters?.minAmount !== undefined)
        params.minAmount = filters.minAmount;
    if (filters?.maxAmount !== undefined)
        params.maxAmount = filters.maxAmount;
    return params;
};
export const transactionService = {
    create: (payload) => apiClient.post('/transactions', payload).then((r) => r.data),
    getMine: (cursor, filters) => apiClient
        .get('/transactions/my', { params: buildParams(cursor, filters) })
        .then((r) => normalize(r.data)),
    getByAccount: (accountId, cursor, filters) => apiClient
        .get(`/transactions/account/${accountId}`, { params: buildParams(cursor, filters) })
        .then((r) => normalize(r.data)),
    getTimeframe: (start, end) => apiClient
        .get('/transactions/timeframe', { params: { start, end } })
        .then((r) => ({ data: r.data.data.map(normalizeTransaction) })),
    update: (id, payload) => apiClient.patch(`/transactions/${id}`, payload).then((r) => r.data),
    remove: (id) => apiClient.delete(`/transactions/${id}`).then((r) => r.data),
};
