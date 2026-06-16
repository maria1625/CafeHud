import { create } from "zustand";
import axios from "axios";
//#region src/api/api.js
var API_URL = "http://localhost:4000";
var isHandlingUnauthorized = false;
var api = axios.create({
	baseURL: `${API_URL}/api/v1`,
	withCredentials: true
});
api.interceptors.response.use((response) => response, async (error) => {
	const isAuthEndpoint = (error.config?.url || "").includes("/auth/");
	if (error.response?.status === 401 && !isAuthEndpoint) {
		if (isHandlingUnauthorized) return Promise.reject(error);
		isHandlingUnauthorized = true;
		let shouldRedirect = false;
		try {
			await api.post("/auth/logout");
		} catch (logoutError) {
			console.error("Error en logout silencioso:", logoutError);
		} finally {
			localStorage.clear();
			sessionStorage.clear();
			const { useAuthStore } = await import("./useAuthStore-MOS9mxN2.js");
			useAuthStore.getState().setUser(null);
			shouldRedirect = typeof window !== "undefined" && !["/login", "/register"].includes(window.location.pathname);
			isHandlingUnauthorized = false;
		}
		if (shouldRedirect) window.location.replace("/login");
	}
	return Promise.reject(error);
});
var unwrap = (response) => response.data?.data ?? response.data;
var authApi = {
	login: async (credentials) => unwrap(await api.post("/auth/login", credentials)),
	register: async (userData) => unwrap(await api.post("/auth/register", userData)),
	me: async () => unwrap(await api.get("/auth/me")),
	logout: async () => unwrap(await api.post("/auth/logout"))
};
var cafeApi = {
	getCafes: async () => unwrap(await api.get("/cafes")),
	getCafe: async (id) => unwrap(await api.get(`/cafes/${id}`)),
	vote: async (id) => unwrap(await api.post(`/cafes/${id}/vote`)),
	addReview: async (id, reviewData) => unwrap(await api.post(`/cafes/${id}/reviews`, reviewData))
};
var favoriteApi = {
	getFavorites: async () => unwrap(await api.get("/favorites")),
	toggle: async (cafeId) => unwrap(await api.post(`/favorites/${cafeId}/toggle`))
};
var reviewApi = {
	getMine: async () => unwrap(await api.get("/reviews/mine")),
	update: async (reviewId, reviewData) => unwrap(await api.put(`/reviews/${reviewId}`, reviewData)),
	delete: async (reviewId) => unwrap(await api.delete(`/reviews/${reviewId}`))
};
var adminApi = {
	getUsers: async () => unwrap(await api.get("/admin/users")),
	updateUserRole: async (userId, role) => unwrap(await api.put(`/admin/users/${userId}/role`, { role })),
	deleteUser: async (userId) => unwrap(await api.delete(`/admin/users/${userId}`)),
	getCafes: async () => unwrap(await api.get("/admin/cafes")),
	createCafe: async (cafeData) => unwrap(await api.post("/admin/cafes", cafeData)),
	updateCafe: async (cafeId, cafeData) => unwrap(await api.put(`/admin/cafes/${cafeId}`, cafeData)),
	deleteCafe: async (cafeId) => unwrap(await api.delete(`/admin/cafes/${cafeId}`)),
	getReviews: async () => unwrap(await api.get("/admin/reviews")),
	deleteReview: async (reviewId) => unwrap(await api.delete(`/admin/reviews/${reviewId}`))
};
//#endregion
//#region src/store/useAuthStore.js
var canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined";
var getStoredUser = () => {
	if (!canUseStorage()) return null;
	try {
		const stored = localStorage.getItem("cafe_user");
		return stored ? JSON.parse(stored) : null;
	} catch (e) {
		console.error("Error al leer cafe_user:", e);
		return null;
	}
};
var persistUser = (user) => {
	if (!canUseStorage()) return;
	if (user) localStorage.setItem("cafe_user", JSON.stringify(user));
	else localStorage.removeItem("cafe_user");
};
var extractUser = (response) => response?.user ?? response;
var initialUser = getStoredUser();
var useAuthStore = create((set, get) => ({
	user: initialUser,
	isAuthenticated: !!initialUser,
	initializing: true,
	loading: false,
	error: null,
	setUser: (user) => {
		persistUser(user);
		set({
			user,
			isAuthenticated: !!user
		});
	},
	initialize: async () => {
		set({
			initializing: true,
			error: null
		});
		try {
			const user = extractUser(await authApi.me());
			persistUser(user);
			set({
				user,
				isAuthenticated: true,
				initializing: false,
				loading: false
			});
		} catch {
			persistUser(null);
			set({
				user: null,
				isAuthenticated: false,
				initializing: false,
				loading: false
			});
		}
	},
	refreshMe: async () => {
		const user = extractUser(await authApi.me());
		persistUser(user);
		set({
			user,
			isAuthenticated: true
		});
		return user;
	},
	login: async (credentials) => {
		set({
			loading: true,
			error: null
		});
		try {
			const user = extractUser(await authApi.login(credentials));
			persistUser(user);
			set({
				user,
				isAuthenticated: true,
				loading: false,
				error: null
			});
			return user;
		} catch (error) {
			const message = error.response?.data?.message || "Credenciales invalidas";
			set({
				error: message,
				loading: false
			});
			throw new Error(message);
		}
	},
	register: async (userData) => {
		set({
			loading: true,
			error: null
		});
		try {
			const user = extractUser(await authApi.register(userData));
			persistUser(user);
			set({
				user,
				isAuthenticated: true,
				loading: false,
				error: null
			});
			return user;
		} catch (error) {
			const message = error.response?.data?.message || "Error al registrarse";
			set({
				error: message,
				loading: false
			});
			throw new Error(message);
		}
	},
	logout: async () => {
		set({
			loading: true,
			error: null
		});
		try {
			await authApi.logout();
		} catch (error) {
			console.warn("Error cerrando sesion:", error);
		}
		persistUser(null);
		set({
			user: null,
			isAuthenticated: false,
			loading: false,
			error: null
		});
	},
	isAdmin: () => get().user?.role === "admin",
	isClient: () => ["client", "user"].includes(get().user?.role)
}));
//#endregion
export { reviewApi as a, favoriteApi as i, adminApi as n, cafeApi as r, useAuthStore as t };
