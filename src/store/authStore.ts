import create from "zustand";
import axios from 'axios';
import { persist } from 'zustand/middleware';

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
        const response = await axios.get<User>('/api/user');
        set({ user: response.data });
      }catch{
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null, token: null })
      }
    }
  },
  signIn: async(email: string, password: string) => {
    const response = await axios.post<LoginResponse>('/api/login', { email, password });
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    set({ user: response.data.user, token: response.data.token });
  },
  signOut: () => {
    axios.post('/api/logout');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null })
  }
}), { name: 'auth', partialize: (state) => ({ token: state.token }) }))
