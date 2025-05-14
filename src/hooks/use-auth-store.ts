import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (firebaseUser: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (firebaseUser) => {
    if (firebaseUser) {
      set({ user: {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      }, isLoading: false });
    } else {
      set({ user: null, isLoading: false });
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));
