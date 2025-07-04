
// frontend_next/src/services/authService.ts
import axios from 'axios';

// IMPORTANT: Replace with your backend API base URL
const API_URL = 'http://localhost:5000/api/auth/'; // Adjust if your auth routes are different

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
const register = async (userData: any): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(API_URL + 'register', userData);
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
const login = async (userData: any): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(API_URL + 'login', userData);
  if (response.data.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  }
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
};

export default authService;