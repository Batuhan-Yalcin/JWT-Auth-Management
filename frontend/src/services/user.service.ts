import api from './api';

export interface UserData {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface UpdateUserData {
  username?: string;
  email?: string;
}

export const getUser = async (id: number): Promise<UserData> => {
  const response = await api.get<UserData>(`/users/${id}`);
  return response.data;
};

export const updateUser = async (data: UpdateUserData): Promise<UserData> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const response = await api.put<UserData>(`/users/${user.id}`, data);
  return response.data;
};

export const getAllUsers = async (): Promise<UserData[]> => {
  const response = await api.get<UserData[]>('/users');
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
}; 