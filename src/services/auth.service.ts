import apiClient from '@/apiClient';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
};

export interface VerifyPayload {
  username: string;
  token: string;
}

export interface VerifyResponse {
  message: string;
  status: 'success';
}

export const verifyAccount = async (payload: VerifyPayload): Promise<VerifyResponse> => {
  const { data } = await apiClient.post<VerifyResponse>('/auth/verify', payload);
  return data;
};

export const resendVerificationToken = async (username: string): Promise<string> => {
  const { data } = await apiClient.post<string>('/auth/resend-verification-token', {
    username,
    tokenType: 'email_verification',
  });
  return data;
};

export const forgotPassword = async (username: string): Promise<string> => {
  const { data } = await apiClient.post<string>('/auth/forgot-password', { username });
  return data;
};

export const resendResetCode = async (username: string): Promise<string> => {
  const { data } = await apiClient.post<string>('/auth/resend-reset-code', { username });
  return data;
};

export interface ResetPasswordPayload {
  username: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const { data } = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', payload);
  return data;
};
