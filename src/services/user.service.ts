import apiClient from '@/apiClient';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface UpdatedProfile {
  firstName: string;
  lastName: string;
  username: string;
}

export const userService = {
  updateMe: (payload: UpdateProfilePayload): Promise<UpdatedProfile> =>
    apiClient.patch('/users/me', payload).then((r) => r.data),
};
