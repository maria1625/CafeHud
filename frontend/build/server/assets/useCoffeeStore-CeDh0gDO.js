import { i as favoriteApi, r as cafeApi, t as useAuthStore } from "./useAuthStore-C1pxADfH.js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
//#region src/store/useCoffeeStore.js
var getCafeId = (cafe) => String(cafe?._id || cafe?.id);
var syncCartWithCafes = (cart, cafes) => {
	const cafeMap = new Map(cafes.map((cafe) => [getCafeId(cafe), cafe]));
	return cart.map((item) => {
		const updatedCafe = cafeMap.get(getCafeId(item));
		if (!updatedCafe) return item;
		const stock = Number(updatedCafe.stock);
		if (Number.isFinite(stock)) {
			if (stock <= 0) return null;
			const clampedQuantity = Math.min(Number(item.quantity || 0), stock);
			if (clampedQuantity <= 0) return null;
			return {
				...item,
				...updatedCafe,
				id: getCafeId(updatedCafe),
				quantity: clampedQuantity
			};
		}
		return {
			...item,
			...updatedCafe,
			id: getCafeId(updatedCafe),
			quantity: item.quantity
		};
	}).filter(Boolean);
};
var useCoffeeStore = create(persist((set, get) => ({
	cafes: [],
	cart: [],
	favorites: [],
	loading: false,
	error: null,
	fetchCafes: async () => {
		set({
			loading: true,
			error: null
		});
		try {
			const fetchedCafes = await cafeApi.getCafes();
			const cafes = Array.isArray(fetchedCafes) ? fetchedCafes : [];
			set((state) => ({
				cafes,
				cart: syncCartWithCafes(state.cart, cafes),
				loading: false
			}));
		} catch {
			set({
				error: "Error al cargar el catalogo",
				loading: false
			});
		}
	},
	fetchFavorites: async () => {
		try {
			const favorites = await favoriteApi.getFavorites();
			set({ favorites: Array.isArray(favorites) ? favorites.map(String) : [] });
		} catch (error) {
			set({ favorites: [] });
			console.error("Error al cargar favoritos", error);
		}
	},
	toggleFavorite: async (id) => {
		try {
			const updatedFavorites = await favoriteApi.toggle(id);
			set({ favorites: Array.isArray(updatedFavorites) ? updatedFavorites.map(String) : [] });
		} catch (error) {
			console.error("Error al actualizar favorito", error);
			throw error;
		}
	},
	voteCoffee: async (id) => {
		try {
			const updatedCafe = await cafeApi.vote(id);
			set((state) => ({ cafes: state.cafes.map((cafe) => getCafeId(cafe) === String(id) ? updatedCafe : cafe) }));
		} catch (error) {
			console.error("Error al votar", error);
			throw error;
		}
	},
	addReview: async (id, reviewData) => {
		try {
			const response = await cafeApi.addReview(id, reviewData);
			const updatedCafe = response?.cafe ?? response;
			const updatedUser = response?.user;
			if (updatedUser) useAuthStore.getState().setUser(updatedUser);
			set((state) => ({ cafes: state.cafes.map((cafe) => getCafeId(cafe) === String(id) ? updatedCafe : cafe) }));
			return response;
		} catch (error) {
			console.error("Error al anadir reseña", error);
			throw error;
		}
	},
	addToCart: (cafe) => set((state) => {
		const cafeId = getCafeId(cafe);
		const currentCafe = get().cafes.find((item) => getCafeId(item) === cafeId) ?? cafe;
		if (!currentCafe?.available) return state;
		const exists = state.cart.find((item) => getCafeId(item) === cafeId);
		const stock = Number(currentCafe?.stock);
		if (Number.isFinite(stock) && stock <= 0) return state;
		if (exists) {
			if (Number.isFinite(stock) && exists.quantity >= stock) return state;
			return { cart: state.cart.map((item) => getCafeId(item) === cafeId ? {
				...item,
				...currentCafe,
				id: cafeId,
				quantity: item.quantity + 1
			} : item) };
		}
		return { cart: [...state.cart, {
			...currentCafe,
			id: cafeId,
			quantity: 1
		}] };
	}),
	removeFromCart: (id) => set((state) => {
		const itemId = String(id);
		const existingItem = state.cart.find((item) => getCafeId(item) === itemId);
		if (existingItem && existingItem.quantity > 1) return { cart: state.cart.map((item) => getCafeId(item) === itemId ? {
			...item,
			quantity: item.quantity - 1
		} : item) };
		return { cart: state.cart.filter((item) => getCafeId(item) !== itemId) };
	}),
	clearItemFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => getCafeId(item) !== String(id)) })),
	clearCart: () => set({ cart: [] })
}), {
	name: "cafehub-cart-storage",
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({ cart: state.cart })
}));
//#endregion
export { useCoffeeStore as t };
