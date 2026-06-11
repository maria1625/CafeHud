import { create } from 'zustand';
import { authApi } from '../api/api';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('cafe_user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error('Error al leer cafe_user:', e);
    return null;
  }
};

const persistUser = (user) => {
  if (user) {
    localStorage.setItem('cafe_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('cafe_user');
  }
};

const extractUser = (response) => response?.user ?? response;

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  initializing: true,
  loading: false,
  error: null,

  setUser: (user) => {
    persistUser(user);
    set({ user, isAuthenticated: !!user });
  },

  initialize: async () => {
    set({ initializing: true, error: null });
    try {
      const response = await authApi.me();
      const user = extractUser(response);
      persistUser(user);
      set({ user, isAuthenticated: true, initializing: false, loading: false });
    } catch (err) {
      persistUser(null);
      set({ user: null, isAuthenticated: false, initializing: false, loading: false });
    }
  },

  refreshMe: async () => {
    const response = await authApi.me();
    const user = extractUser(response);
    persistUser(user);
    set({ user, isAuthenticated: true });
    return user;
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const user = extractUser(response);
      persistUser(user);
      set({ user, isAuthenticated: true, loading: false, error: null });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Credenciales invalidas';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(userData);
      const user = extractUser(response);
      persistUser(user);
      set({ user, isAuthenticated: true, loading: false, error: null });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Error cerrando sesion:', err);
    }
    persistUser(null);
    set({ user: null, isAuthenticated: false, loading: false, error: null });
  },

  isAdmin: () => get().user?.role === 'admin',
  isClient: () => ['user', 'admin'].includes(get().user?.role)
}));
