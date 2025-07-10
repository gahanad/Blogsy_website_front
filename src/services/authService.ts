
// frontend_next/src/services/authService.ts
import apiClient from '@/utils/axiosConfig';



interface UserData {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  // ... other user fields you expect
}

interface AuthResponse {
  token: string;
  user: UserData;
  message?: string;
}

const getToken = () : string | null =>{
  if(typeof window !== 'undefined'){
    return localStorage.getItem('token');
  }else{
    return null;
  }
}

// Register user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const register = async (userData: any): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', userData);
  if (response.data.token) {
    // In Next.js, localStorage is only available on the client-side
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  }
  return response.data;
};

// Login user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const login = async (userData: any): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', userData);
  if (response.data.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  }
  return response.data;
};

// Forgot Password
const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/auth/forgotpassword', { email });
  return response.data;
};

// Reset Password
// Reset password using token
const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiClient.put(`/auth/resetpassword/${token}`, { password: newPassword });
  return response.data;
};


// Logout user
const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Get current logged in user from localStorage
const getCurrentUser = (): AuthResponse | null => {
  if (typeof window === 'undefined') {
    return null; // Not on client-side
  }
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const authService = {
  getToken,
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};

export default authService;