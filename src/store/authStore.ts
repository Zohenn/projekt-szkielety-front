import create from "zustand";
import axios from 'axios';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cartStore';

export interface User{
  name: string;
  email: string;
  admin: boolean;
}

interface AuthState{
  user: User | null;
  token: string | null;
  isSignedIn: () => boolean;
  isAdmin: () => boolean;
  checkAuthState: () => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => void;
  cleanup: () => void;
}

interface LoginResponse{
  user: User;
  token: string;
}

export const useAuthStore = create<AuthState>(persist((set, get) => ({
  user: null,
  token: null,

  isSignedIn: () => get().user !== null,
  isAdmin: () => get().isSignedIn() && get().user!.admin,

  checkAuthState: async() => {
    const { token } = get();
    if(token){
      try{
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get<User>('/api/auth/user');
        set({ user: response.data });
      }catch{
        get().cleanup();
      }
    }
  },

  signIn: async(email: string, password: string) => {
    const response = await axios.post<LoginResponse>('/api/auth/login', { email, password });
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    set({ user: response.data.user, token: response.data.token });
  },

  signOut: () => {
    axios.post('/api/auth/logout');
    get().cleanup();
  },

  cleanup: () => {
    delete axios.defaults.headers.common['Authorization'];
    useCartStore.getState().clear();
    set({ user: null, token: null })
  }
}), { name: 'auth', partialize: (state) => ({ token: state.token }) }))
