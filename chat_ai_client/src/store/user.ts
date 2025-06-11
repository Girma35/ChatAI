// stores/user.ts
import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

interface UserState {
  userId: string | null;
  name: string | null;
  email: string | null;  // Added email to state
}

interface AuthData {
  name: string;
  email: string;
}

interface ApiErrorResponse {
  error?: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: null,
    name: null,
    email: null,  // Initialize email
  }),
  
  getters: {
    user: (state) => ({
      name: state.name || 'Guest',
      email: state.email || '',
      avatar: null  // Added to match header expectations
    }),
    isAuthenticated: (state) => !!state.userId,
    userInitials: (state) => {
      if (!state.name) return '?';
      return state.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
  },
  
  actions: {
    setUser(data: { userId: string; name: string; email: string }) {
      this.userId = data.userId;
      this.name = data.name;
      this.email = data.email;  // Store email
    },
    
    clearUser() {
      this.userId = null;
      this.name = null;
      this.email = null;
    },
    
    async authUser(userData: AuthData) {
      try {
        const userId = userData.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const response = await apiClient.post('/register-user', {
          name: userData.name,
          email: userData.email,
        });
        this.setUser({ 
          userId, 
          name: userData.name,
          email: userData.email  // Include email
        });
        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        throw new Error(axiosError.response?.data?.error || 'Authentication failed');
      }
    },
    
    async login(userData: AuthData) {
      try {
        const userId = userData.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const response = await apiClient.post('/check-user', { 
          email: userData.email 
        });
        
        if (!response.data.exists) {
          throw new Error('User not found. Please sign up.');
        }
        
        this.setUser({ 
          userId, 
          name: userData.name,
          email: userData.email  // Include email
        });
        
        return { 
          userId, 
          name: userData.name,
          email: userData.email
        };
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        throw new Error(axiosError.response?.data?.error || 'Login failed');
      }
    },
    
    logout() {
      this.clearUser();
    },
  },
  
  persist: true,
});