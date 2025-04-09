import api from './api';

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signin', {
    username,
    password,
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  return await api.post('/auth/signup', {
    username,
    email,
    password,
    roles: ['user']
  });
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): AuthResponse | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  console.log('User roles:', user.roles); // Rolleri kontrol etmek için
  return user.roles.includes('ROLE_ADMIN');
}; 