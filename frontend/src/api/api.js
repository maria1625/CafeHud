import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
let isHandlingUnauthorized = false;

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/auth/");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (isHandlingUnauthorized) {
        return Promise.reject(error);
      }

      isHandlingUnauthorized = true;

      let shouldRedirect = false;

      try {
        await api.post("/auth/logout");
      } catch (logoutError) {
        console.error("Error en logout silencioso:", logoutError);
      } finally {
        localStorage.clear();
        sessionStorage.clear();

        const { useAuthStore } = await import("../store/useAuthStore");
        useAuthStore.getState().setUser(null);

        shouldRedirect = typeof window !== "undefined" && !["/login", "/register"].includes(window.location.pathname);

        isHandlingUnauthorized = false;
      }

      if (shouldRedirect) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

const unwrap = (response) => response.data?.data ?? response.data;

export const authApi = {
  login: async (credentials) => unwrap(await api.post("/auth/login", credentials)),
  register: async (userData) => unwrap(await api.post("/auth/register", userData)),
  me: async () => unwrap(await api.get("/auth/me")),
  logout: async () => unwrap(await api.post("/auth/logout")),
};

export const cafeApi = {
  getCafes: async () => unwrap(await api.get("/cafes")),
  getCafe: async (id) => unwrap(await api.get(`/cafes/${id}`)),
  vote: async (id) => unwrap(await api.post(`/cafes/${id}/vote`)),
  addReview: async (id, reviewData) => unwrap(await api.post(`/cafes/${id}/reviews`, reviewData)),
};

export const favoriteApi = {
  getFavorites: async () => unwrap(await api.get("/favorites")),
  toggle: async (cafeId) => unwrap(await api.post(`/favorites/${cafeId}/toggle`)),
};

export const reviewApi = {
  getMine: async () => unwrap(await api.get("/reviews/mine")),
  update: async (reviewId, reviewData) => unwrap(await api.put(`/reviews/${reviewId}`, reviewData)),
  delete: async (reviewId) => unwrap(await api.delete(`/reviews/${reviewId}`)),
};

export const adminApi = {
  getUsers: async () => unwrap(await api.get("/admin/users")),
  updateUserRole: async (userId, role) => unwrap(await api.put(`/admin/users/${userId}/role`, { role })),
  deleteUser: async (userId) => unwrap(await api.delete(`/admin/users/${userId}`)),
  getCafes: async () => unwrap(await api.get("/admin/cafes")),
  createCafe: async (cafeData) => unwrap(await api.post("/admin/cafes", cafeData)),
  updateCafe: async (cafeId, cafeData) => unwrap(await api.put(`/admin/cafes/${cafeId}`, cafeData)),
  getInventory: async () => unwrap(await api.get("/admin/inventory")),
  getLowStock: async () => unwrap(await api.get("/admin/inventory/low-stock")),
  updateCafeInventory: async (cafeId, inventoryData) => unwrap(await api.patch(`/admin/cafes/${cafeId}/inventory`, inventoryData)),
  deleteCafe: async (cafeId) => unwrap(await api.delete(`/admin/cafes/${cafeId}`)),
  getReviews: async () => unwrap(await api.get("/admin/reviews")),
  deleteReview: async (reviewId) => unwrap(await api.delete(`/admin/reviews/${reviewId}`)),
};

export default api;
