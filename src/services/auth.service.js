import apiClient from '@/apiClient';
export const registerUser = async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
};
export const loginUser = async (payload) => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
};
export const verifyAccount = async (payload) => {
    const { data } = await apiClient.post('/auth/verify', payload);
    return data;
};
export const resendVerificationToken = async (username) => {
    const { data } = await apiClient.post('/auth/resend-verification-token', {
        username,
        tokenType: 'email_verification',
    });
    return data;
};
export const forgotPassword = async (username) => {
    const { data } = await apiClient.post('/auth/forgot-password', { username });
    return data;
};
export const resendResetCode = async (username) => {
    const { data } = await apiClient.post('/auth/resend-reset-code', { username });
    return data;
};
export const resetPassword = async (payload) => {
    const { data } = await apiClient.post('/auth/reset-password', payload);
    return data;
};
