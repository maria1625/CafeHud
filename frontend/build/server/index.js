import { a as reviewApi, i as favoriteApi, n as adminApi, r as cafeApi, t as useAuthStore } from "./assets/useAuthStore-D21mWGkQ.js";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Navigate, Outlet, Route, Routes, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Children, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Check, Coffee, Minus, Moon, Plus, ShoppingBag, Sun, Trash2, X, ZoomIn } from "lucide-react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.jsx
var root_exports = /* @__PURE__ */ __exportAll({
	Layout: () => Layout,
	default: () => root_default
});
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("title", { children: "CafeHub Premium" }),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			}),
			/* @__PURE__ */ jsx("link", {
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
				rel: "stylesheet"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
//#endregion
//#region src/store/useThemeStore.js
var canUseDOM = () => typeof window !== "undefined" && typeof document !== "undefined" && typeof localStorage !== "undefined";
var getPreferredTheme = () => {
	if (!canUseDOM()) return false;
	return localStorage.getItem("theme") === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches;
};
var applyThemeClass = (isDark) => {
	if (!canUseDOM()) return;
	if (isDark) document.documentElement.classList.add("dark");
	else document.documentElement.classList.remove("dark");
};
var useThemeStore = create((set) => ({
	isDark: false,
	toggleTheme: () => set((state) => {
		const newIsDark = !state.isDark;
		if (canUseDOM()) localStorage.setItem("theme", newIsDark ? "dark" : "light");
		applyThemeClass(newIsDark);
		return { isDark: newIsDark };
	}),
	initTheme: () => {
		const isDark = getPreferredTheme();
		applyThemeClass(isDark);
		set({ isDark });
	}
}));
//#endregion
//#region src/store/useCoffeeStore.js
var getCafeId$1 = (cafe) => String(cafe?._id || cafe?.id);
var syncCartWithCafes = (cart, cafes) => {
	const cafeMap = new Map(cafes.map((cafe) => [getCafeId$1(cafe), cafe]));
	return cart.map((item) => {
		const updatedCafe = cafeMap.get(getCafeId$1(item));
		if (!updatedCafe) return item;
		return {
			...item,
			...updatedCafe,
			id: getCafeId$1(updatedCafe),
			quantity: item.quantity
		};
	});
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
			set((state) => ({ cafes: state.cafes.map((cafe) => getCafeId$1(cafe) === String(id) ? updatedCafe : cafe) }));
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
			set((state) => ({ cafes: state.cafes.map((cafe) => getCafeId$1(cafe) === String(id) ? updatedCafe : cafe) }));
			return response;
		} catch (error) {
			console.error("Error al anadir resena", error);
			throw error;
		}
	},
	addToCart: (cafe) => set((state) => {
		const cafeId = getCafeId$1(cafe);
		const currentCafe = get().cafes.find((item) => getCafeId$1(item) === cafeId) ?? cafe;
		if (!currentCafe?.available) return state;
		if (state.cart.find((item) => getCafeId$1(item) === cafeId)) return { cart: state.cart.map((item) => getCafeId$1(item) === cafeId ? {
			...item,
			...currentCafe,
			id: cafeId,
			quantity: item.quantity + 1
		} : item) };
		return { cart: [...state.cart, {
			...currentCafe,
			id: cafeId,
			quantity: 1
		}] };
	}),
	removeFromCart: (id) => set((state) => {
		const itemId = String(id);
		const existingItem = state.cart.find((item) => getCafeId$1(item) === itemId);
		if (existingItem && existingItem.quantity > 1) return { cart: state.cart.map((item) => getCafeId$1(item) === itemId ? {
			...item,
			quantity: item.quantity - 1
		} : item) };
		return { cart: state.cart.filter((item) => getCafeId$1(item) !== itemId) };
	}),
	clearItemFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => getCafeId$1(item) !== String(id)) })),
	clearCart: () => set({ cart: [] })
}), {
	name: "cafehub-cart-storage",
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({ cart: state.cart })
}));
//#endregion
//#region src/utils/formatters.js
var formatCOP = (value) => {
	if (value == null || Number.isNaN(Number(value))) return "COP 0";
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(Number(value));
};
//#endregion
//#region src/components/layout/CartSidebar.jsx
var CartSidebar = ({ isOpen, onClose }) => {
	const { cart, removeFromCart, addToCart, clearItemFromCart } = useCoffeeStore();
	const [previewImage, setPreviewImage] = useState(null);
	const navigate = useNavigate();
	const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
	const handleCheckout = () => {
		onClose();
		navigate("/cobrar");
	};
	return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(motion.div, {
		className: "fixed inset-0 z-50 overflow-hidden",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .2 },
		children: [
			/* @__PURE__ */ jsx(motion.div, {
				className: "absolute inset-0 bg-black/80 backdrop-blur-md",
				onClick: onClose,
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .2 }
			}),
			/* @__PURE__ */ jsxs(motion.div, {
				className: "absolute right-0 top-0 bottom-0 w-full max-w-md bg-brand-beige shadow-2xl flex flex-col border-l border-brand-light/20",
				initial: { x: "100%" },
				animate: { x: 0 },
				exit: { x: "100%" },
				transition: {
					type: "tween",
					duration: .25
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 border-b border-brand-light/10 flex justify-between items-center bg-brand-bg dark:bg-brand-dark/20",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tighter",
							children: "Tu carrito"
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mt-1",
							children: [cart.length, " artículos seleccionados"]
						})] }), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "p-3 hover:bg-brand-light/10 rounded-full transition-colors dark:text-white",
							"aria-label": "Cerrar carrito",
							children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex-1 overflow-y-auto p-8 space-y-8",
						children: cart.length === 0 ? /* @__PURE__ */ jsxs("div", {
							className: "h-full flex flex-col items-center justify-center text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-20 h-20 bg-brand-light/10 rounded-full flex items-center justify-center mb-6",
									children: /* @__PURE__ */ jsx(ShoppingBag, {
										className: "w-10 h-10 text-brand-medium opacity-40",
										strokeWidth: 2.5
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-brand-medium font-bold uppercase tracking-widest text-xs",
									children: "Tu carrito está vacío"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: onClose,
									className: "mt-6 text-brand-medium dark:text-white underline font-black text-[10px] uppercase tracking-widest",
									children: "Explorar catálogo"
								})
							]
						}) : cart.map((item) => /* @__PURE__ */ jsxs("div", {
							className: "flex gap-6 group",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								className: "relative w-28 h-28 rounded-3xl overflow-hidden bg-brand-light/10 flex-shrink-0 border-2 border-brand-light/20 group-hover:border-brand-medium transition-all duration-500 cursor-pointer shadow-lg",
								onClick: () => setPreviewImage(item.imageUrl),
								title: "Ampliar imagen",
								children: [/* @__PURE__ */ jsx("img", {
									src: item.imageUrl,
									alt: item.name,
									className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center",
									children: /* @__PURE__ */ jsx(ZoomIn, { className: "w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" })
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 py-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-start",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "font-black text-brand-dark dark:text-white text-base uppercase leading-tight tracking-tight",
											children: item.name
										}), /* @__PURE__ */ jsx("span", {
											className: "font-black text-brand-dark dark:text-white text-base tracking-tighter",
											children: formatCOP(item.price * item.quantity)
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[10px] text-brand-medium dark:text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 mb-4",
										children: item.brand
									}),
									!item.available && /* @__PURE__ */ jsx("p", {
										className: "mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-500",
										children: "No disponible"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center bg-brand-light/10 dark:bg-white/10 rounded-xl border border-brand-light/20 p-1.5",
											children: [
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => removeFromCart(item.id),
													className: "w-9 h-9 flex items-center justify-center hover:bg-brand-medium/20 rounded-lg text-brand-dark dark:text-white transition-colors font-black",
													"aria-label": "Quitar una unidad",
													children: /* @__PURE__ */ jsx(Minus, {
														className: "w-5 h-5",
														strokeWidth: 3
													})
												}),
												/* @__PURE__ */ jsx("span", {
													className: "px-4 text-sm font-black text-brand-dark dark:text-white",
													children: item.quantity
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => addToCart(item),
													disabled: !item.available,
													className: "w-9 h-9 flex items-center justify-center hover:bg-brand-medium/20 rounded-lg text-brand-dark dark:text-white transition-colors font-black disabled:cursor-not-allowed disabled:opacity-50",
													"aria-label": "Agregar una unidad",
													children: /* @__PURE__ */ jsx(Plus, {
														className: "w-5 h-5",
														strokeWidth: 3
													})
												})
											]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => clearItemFromCart(item.id),
											className: "p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all",
											title: "Eliminar producto",
											children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5 text-red-500" })
										})]
									})
								]
							})]
						}, item.id))
					}),
					cart.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-8 border-t border-brand-light/20 bg-brand-bg dark:bg-brand-dark/20",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between items-end mb-8",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.3em]",
								children: "Total estimado"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-3xl font-black text-brand-dark dark:text-white tracking-tighter",
								children: formatCOP(total)
							})]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleCheckout,
							className: "w-full btn-premium py-6 flex items-center justify-center gap-3 group",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-black uppercase tracking-[0.2em] text-sm",
								children: "Finalizar pedido"
							}), /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: previewImage && /* @__PURE__ */ jsx(motion.div, {
				className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90",
				onClick: () => setPreviewImage(null),
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .2 },
				children: /* @__PURE__ */ jsxs(motion.div, {
					className: "relative max-w-4xl w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10",
					onClick: (event) => event.stopPropagation(),
					initial: {
						scale: .96,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: {
						scale: .98,
						opacity: 0
					},
					transition: {
						type: "tween",
						duration: .2
					},
					children: [/* @__PURE__ */ jsx("img", {
						src: previewImage,
						alt: "Vista previa",
						className: "w-full h-full object-cover"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "absolute top-8 right-8 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black transition-all",
						onClick: () => setPreviewImage(null),
						"aria-label": "Cerrar vista previa",
						children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
					})]
				})
			}) })
		]
	}) });
};
//#endregion
//#region src/components/layout/Navbar.jsx
var Navbar = () => {
	const { user, logout, isAuthenticated } = useAuthStore();
	const { isDark, toggleTheme } = useThemeStore();
	const { cart } = useCoffeeStore();
	const [isCartOpen, setIsCartOpen] = useState(false);
	const navigate = useNavigate();
	const canUseClientFeatures = !!user && ["client", "user"].includes(user.role);
	const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
	const handleLogout = () => {
		logout();
		navigate("/login");
	};
	const handleCartOpen = () => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}
		if (!canUseClientFeatures) return;
		setIsCartOpen(true);
	};
	return /* @__PURE__ */ jsxs("nav", {
		className: "nav-premium",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/",
				className: "flex items-center gap-4 hover:opacity-80 transition-opacity group",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10",
					children: /* @__PURE__ */ jsxs("svg", {
						className: "w-8 h-8 text-brand-beige dark:text-[#8B5E3C]",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [
							/* @__PURE__ */ jsx("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
							/* @__PURE__ */ jsx("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }),
							/* @__PURE__ */ jsx("line", {
								x1: "6",
								y1: "1",
								x2: "6",
								y2: "4"
							}),
							/* @__PURE__ */ jsx("line", {
								x1: "10",
								y1: "1",
								x2: "10",
								y2: "4"
							}),
							/* @__PURE__ */ jsx("line", {
								x1: "14",
								y1: "1",
								x2: "14",
								y2: "4"
							})
						]
					})
				}), /* @__PURE__ */ jsx("span", {
					className: "text-2xl font-black tracking-tighter uppercase italic dark:text-white",
					children: "CaféHub"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-6 sm:gap-12",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6 sm:gap-10 text-[10px] font-black uppercase tracking-[0.2em]",
					children: [
						!isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
							to: "/login",
							className: "hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300",
							children: "Iniciar sesión"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/register",
							className: "px-6 py-3 bg-brand-medium dark:bg-white dark:text-black hover:bg-brand-medium/80 rounded-xl transition-all border border-white/10 shadow-lg",
							children: "Registro"
						})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/dashboard",
								className: "hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300",
								children: "Panel"
							}),
							user?.role === "admin" && /* @__PURE__ */ jsx(Link, {
								to: "/admin",
								className: "hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300",
								children: "Administración"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "hidden sm:inline text-white opacity-90",
								children: ["Hola, ", user?.name || "Barista"]
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: handleLogout,
								className: "px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[9px] transition-colors font-black dark:text-white",
								children: "Cerrar sesión"
							})
						] }),
						/* @__PURE__ */ jsx("button", {
							onClick: toggleTheme,
							className: "p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors active:opacity-90",
							"aria-label": "Cambiar tema",
							children: isDark ? /* @__PURE__ */ jsx(Sun, {
								className: "w-5 h-5 text-yellow-400",
								strokeWidth: 2.5
							}) : /* @__PURE__ */ jsx(Moon, {
								className: "w-5 h-5 text-brand-beige",
								strokeWidth: 2.5
							})
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: handleCartOpen,
							disabled: isAuthenticated && !canUseClientFeatures,
							className: "relative p-2.5 bg-brand-medium dark:bg-white/10 hover:bg-brand-dark dark:hover:bg-white/20 rounded-xl border border-white/10 transition-colors active:opacity-90 group shadow-lg disabled:cursor-not-allowed disabled:opacity-60",
							"aria-label": "Abrir carrito",
							title: isAuthenticated && !canUseClientFeatures ? "Disponible solo para clientes" : "Abrir carrito",
							children: [/* @__PURE__ */ jsx(ShoppingBag, {
								className: "w-5 h-5 text-white",
								strokeWidth: 2.75
							}), cartCount > 0 && /* @__PURE__ */ jsx("span", {
								className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border border-black dark:border-white animate-bounce-slow",
								children: cartCount
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(CartSidebar, {
				isOpen: isCartOpen,
				onClose: () => setIsCartOpen(false)
			})
		]
	});
};
//#endregion
//#region src/components/layout/MainLayout.jsx
var MainLayout = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col min-h-screen bg-brand-bg",
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-20",
				children: /* @__PURE__ */ jsx(Outlet, {})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "py-20 border-t border-brand-light/20 text-center bg-brand-beige/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-6",
					children: [
						/* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-brand-medium mx-auto mb-8 rounded-full opacity-20" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-brand-medium font-black text-[10px] uppercase tracking-[0.5em] mb-4",
							children: "CaféHub Premium Experience"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-brand-medium text-xs font-bold opacity-80",
							children: "© 2026 Todos los derechos reservados. El arte de tostar café."
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/store/useFilterStore.js
var useFilterStore = create((set) => ({
	filters: {
		availability: false,
		sortBy: "name",
		onlyFavorites: false
	},
	setFilters: (newFilters) => set((state) => ({ filters: {
		...state.filters,
		...newFilters
	} })),
	clearFilters: () => set({ filters: {
		availability: false,
		sortBy: "name",
		onlyFavorites: false
	} }),
	updateFilter: (key, value) => set((state) => ({ filters: {
		...state.filters,
		[key]: value
	} }))
}));
//#endregion
//#region src/components/filters/FilterBar.jsx
var FilterBar = () => {
	const { filters, setFilters, clearFilters } = useFilterStore();
	const user = useAuthStore((state) => state.user);
	const canUseFavorites = !!user && ["client", "user"].includes(user.role);
	useEffect(() => {
		if (!canUseFavorites && filters.onlyFavorites) setFilters({
			...filters,
			onlyFavorites: false
		});
	}, [
		canUseFavorites,
		filters,
		setFilters
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "card-premium p-6 mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 sticky top-4 z-10 shadow-lg dark:bg-[#1A1A1A]/80 backdrop-blur-md",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-8",
			children: [/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-4 text-brand-dark dark:text-white font-black cursor-pointer group",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: filters.availability || false,
						onChange: (e) => setFilters({
							...filters,
							availability: e.target.checked
						}),
						className: "peer appearance-none w-7 h-7 rounded-xl border-2 border-brand-medium/40 dark:border-white/20 bg-white/70 dark:bg-white/10 checked:bg-brand-medium dark:checked:bg-white checked:border-brand-medium dark:checked:border-white transition-colors cursor-pointer shadow-sm"
					}), /* @__PURE__ */ jsx("svg", {
						className: "absolute top-1.5 left-1.5 w-4 h-4 text-brand-dark opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none peer-checked:text-white dark:peer-checked:text-black",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "4",
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M5 13l4 4L19 7"
						})
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: "group-hover:text-brand-medium dark:group-hover:text-gray-300 transition-colors uppercase tracking-widest text-xs",
					children: "Solo disponibles"
				})]
			}), /* @__PURE__ */ jsxs("label", {
				className: `flex items-center gap-4 text-brand-dark dark:text-white font-black group ${canUseFavorites ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: filters.onlyFavorites || false,
						onChange: (e) => setFilters({
							...filters,
							onlyFavorites: e.target.checked
						}),
						disabled: !canUseFavorites,
						className: "peer appearance-none w-7 h-7 rounded-xl border-2 border-brand-medium/40 dark:border-white/20 bg-white/70 dark:bg-white/10 checked:bg-red-500 dark:checked:bg-red-500 checked:border-red-500 transition-colors shadow-sm disabled:cursor-not-allowed"
					}), /* @__PURE__ */ jsx("svg", {
						className: "absolute top-1.5 left-1.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none",
						fill: "currentColor",
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ jsx("path", { d: "M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.749 0 3.3.834 4.312 2.134C13.012 3.834 14.562 3 16.312 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" })
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: `transition-colors uppercase tracking-widest text-xs ${canUseFavorites ? "group-hover:text-brand-medium dark:group-hover:text-gray-300" : ""}`,
					children: "Mis favoritos"
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-6 w-full lg:w-auto",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4 flex-1 lg:flex-none",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-brand-medium dark:text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap",
					children: "Ordenar por"
				}), /* @__PURE__ */ jsxs("select", {
					value: filters.sortBy || "name",
					onChange: (e) => setFilters({
						...filters,
						sortBy: e.target.value
					}),
					className: "flex-1 lg:flex-none p-3 bg-brand-beige/20 dark:bg-black/40 border-2 border-brand-beige dark:border-white/10 rounded-xl text-brand-dark dark:text-white font-bold focus:ring-4 focus:ring-brand-dark/5 focus:border-brand-dark focus:outline-none cursor-pointer hover:bg-brand-beige/40 transition-all text-sm min-w-[180px]",
					children: [
						/* @__PURE__ */ jsx("option", {
							value: "name",
							children: "Alfabeto (A-Z)"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "price-asc",
							children: "Precio: Más bajo"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "price-desc",
							children: "Precio: Más alto"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "rating",
							children: "Mejor valoración"
						})
					]
				})]
			}), (filters.availability || filters.onlyFavorites || filters.sortBy !== "name") && /* @__PURE__ */ jsxs("button", {
				onClick: clearFilters,
				className: "flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors",
				children: [/* @__PURE__ */ jsx("svg", {
					className: "w-4 h-4",
					fill: "none",
					stroke: "currentColor",
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: "3",
						d: "M6 18L18 6M6 6l12 12"
					})
				}), "Limpiar"]
			})]
		})]
	});
};
//#endregion
//#region src/components/ui/ReviewModal.jsx
var ReviewModal = ({ cafe, isOpen, onClose }) => {
	const { addReview } = useCoffeeStore();
	const { user } = useAuthStore();
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [hoverRating, setHoverRating] = useState(0);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	if (!isOpen) return null;
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!comment.trim() || !user) return;
		setSaving(true);
		setError("");
		try {
			await addReview(cafe._id || cafe.id, {
				rating,
				comment
			});
			setComment("");
			setRating(5);
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "No se pudo publicar la resena.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-black/80 backdrop-blur-sm",
			onClick: onClose
		}), /* @__PURE__ */ jsx("div", {
			className: "relative w-full max-w-lg bg-brand-beige rounded-[3rem] shadow-2xl overflow-hidden border border-brand-light/20 animate-scale-in",
			children: /* @__PURE__ */ jsxs("div", {
				className: "p-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-start mb-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tighter",
						children: "Deja tu resena"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mt-1",
						children: ["Compartiendo sobre ", cafe.name]
					})] }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "p-2 hover:bg-brand-light/10 rounded-full dark:text-white",
						"aria-label": "Cerrar",
						children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center gap-4 bg-brand-bg dark:bg-brand-dark/20 p-6 rounded-3xl border border-brand-light/10",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.3em]",
									children: "Tu calificacion"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex gap-2",
									children: [
										1,
										2,
										3,
										4,
										5
									].map((star) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onMouseEnter: () => setHoverRating(star),
										onMouseLeave: () => setHoverRating(0),
										onClick: () => setRating(star),
										className: "transition-transform active:scale-90",
										"aria-label": `${star} estrellas`,
										children: /* @__PURE__ */ jsx("svg", {
											className: `w-10 h-10 ${(hoverRating || rating) >= star ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-700"}`,
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ jsx("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })
										})
									}, star))
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-xl font-black text-brand-dark dark:text-white",
									children: [rating, ".0"]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest ml-2",
								children: "Tu experiencia"
							}), /* @__PURE__ */ jsx("textarea", {
								required: true,
								value: comment,
								onChange: (event) => setComment(event.target.value),
								placeholder: "Que te parecio este cafe? Notas de sabor, aroma, cuerpo...",
								className: "input-premium h-40 resize-none !p-6"
							})]
						}),
						error && /* @__PURE__ */ jsx("div", {
							className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700",
							children: error
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: saving,
							className: "w-full btn-premium py-6 group",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-black uppercase tracking-[0.2em]",
								children: saving ? "Publicando..." : "Publicar resena"
							}), /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" })]
						})
					]
				})]
			})
		})]
	});
};
//#endregion
//#region src/components/ui/LoadingSpinner.jsx
var LoadingSpinner = ({ message = "Preparando tu café..." }) => /* @__PURE__ */ jsxs("div", {
	className: "flex flex-col justify-center items-center py-32",
	children: [/* @__PURE__ */ jsxs("div", {
		className: "relative w-24 h-24 mb-10",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 border-[6px] border-brand-light/40 dark:border-white/20 border-t-brand-dark dark:border-t-white rounded-full animate-spin",
				style: { animationDuration: "1s" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-4 border-[6px] border-brand-light/25 dark:border-white/10 border-b-brand-medium dark:border-b-white/40 rounded-full animate-spin",
				style: { animationDuration: "1.8s" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 flex items-center justify-center",
				children: /* @__PURE__ */ jsx(Coffee, {
					className: "w-11 h-11 text-brand-dark dark:text-[#8B5E3C]",
					strokeWidth: 2.75
				})
			})
		]
	}), /* @__PURE__ */ jsx("p", {
		className: "text-brand-dark font-black uppercase tracking-[0.4em] text-[10px] animate-pulse",
		children: message
	})]
});
//#endregion
//#region src/components/ui/ErrorState.jsx
var ErrorState = ({ message = "Ups! Algo salió mal con tu pedido.", onRetry }) => /* @__PURE__ */ jsxs("div", {
	className: "card-premium flex flex-col items-center justify-center p-12 max-w-md mx-auto",
	children: [
		/* @__PURE__ */ jsx("div", {
			className: "w-20 h-20 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-6 border border-red-200/60 dark:border-red-900/40",
			children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-10 h-10 text-red-600 dark:text-red-400" })
		}),
		/* @__PURE__ */ jsx("h3", {
			className: "text-xl font-black text-brand-dark mb-2 text-center",
			children: "Error"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "text-brand-medium font-medium mb-8 text-center leading-relaxed",
			children: message
		}),
		onRetry && /* @__PURE__ */ jsx("button", {
			onClick: onRetry,
			className: "btn-premium px-8 py-4",
			children: "Reintentar"
		})
	]
});
//#endregion
//#region src/components/CoffeeList.jsx
var getCafeId = (cafe) => String(cafe?._id || cafe?.id);
var CoffeeCard = ({ cafe }) => {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { voteCoffee, addToCart, toggleFavorite, favorites } = useCoffeeStore();
	const [voted, setVoted] = useState(false);
	const [added, setAdded] = useState(false);
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
	const [showReviews, setShowReviews] = useState(false);
	const cafeId = getCafeId(cafe);
	const isFavorite = favorites.includes(cafeId);
	const isUnavailable = !cafe.available;
	const cafeImageUrl = cafe.imageUrl || "https://via.placeholder.com/800x800.png?text=Sin+imagen";
	const isClient = !!user && ["client", "user"].includes(user.role);
	const isBlockedByRole = !!user && !isClient;
	const requireSession = () => {
		if (!user) {
			navigate("/login");
			return false;
		}
		if (!isClient) return false;
		return true;
	};
	const handleVote = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (!requireSession()) return;
		await voteCoffee(cafeId);
		setVoted(true);
		setTimeout(() => setVoted(false), 2e3);
	};
	const handleToggleFavorite = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (!requireSession()) return;
		await toggleFavorite(cafeId);
	};
	const handleAddToCart = () => {
		if (isUnavailable) return;
		if (!requireSession()) return;
		addToCart(cafe);
		setAdded(true);
		setTimeout(() => setAdded(false), 1e3);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "card-premium group flex flex-col h-full hover:shadow-2xl relative",
		children: [
			voted && /* @__PURE__ */ jsx("div", {
				className: "absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce shadow-xl border border-black",
				children: "Gracias por tu voto"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative h-72 overflow-hidden",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: cafeImageUrl,
						alt: cafe.name,
						className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleToggleFavorite,
						disabled: isBlockedByRole,
						className: `absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-500 z-20 shadow-xl border ${isFavorite ? "bg-red-500 border-red-400 scale-110" : "bg-black/20 border-white/20 hover:bg-black/40 hover:scale-110"}`,
						title: isBlockedByRole ? "Disponible solo para clientes" : isFavorite ? "Quitar de favoritos" : "Anadir a favoritos",
						children: /* @__PURE__ */ jsx("svg", {
							className: `w-6 h-6 transition-colors duration-500 ${isFavorite ? "text-white fill-current" : "text-white"}`,
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: "2.5",
								d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							})
						})
					}),
					!cafe.available && /* @__PURE__ */ jsx("div", {
						className: "badge-unavailable",
						children: "No disponible"
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark/40 to-transparent" })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "p-8 flex flex-col flex-1",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-start mb-4 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-2xl font-black text-brand-dark dark:text-white leading-none mb-2",
							children: cafe.name
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.2em]",
							children: cafe.brand
						})] }), /* @__PURE__ */ jsx("span", {
							className: "text-2xl font-black text-brand-dark dark:text-white tracking-tighter",
							children: formatCOP(cafe.price)
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-brand-medium dark:text-gray-300 text-sm mb-8 line-clamp-2 italic font-medium leading-relaxed",
						children: [
							"\"",
							cafe.description,
							"\""
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setShowReviews(!showReviews),
							className: "text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest hover:text-brand-dark dark:hover:text-white transition-colors",
							children: showReviews ? "Ocultar resenas" : `Ver resenas (${cafe.reviews?.length || 0})`
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => {
								if (!requireSession()) return;
								setIsReviewModalOpen(true);
							},
							disabled: isBlockedByRole,
							className: "text-[10px] font-black text-brand-medium dark:text-white underline uppercase tracking-widest",
							title: isBlockedByRole ? "Disponible solo para clientes" : "Escribir resena",
							children: "Escribir resena"
						})]
					}),
					showReviews && /* @__PURE__ */ jsx("div", {
						className: "mb-8 space-y-4 max-h-40 overflow-y-auto pr-2 scrollbar-premium",
						children: cafe.reviews?.length ? cafe.reviews.map((review) => /* @__PURE__ */ jsxs("div", {
							className: "bg-brand-bg dark:bg-brand-dark/20 p-4 rounded-2xl border border-brand-light/10",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center mb-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-black dark:text-white",
									children: review.userName
								}), /* @__PURE__ */ jsx("span", {
									className: "text-yellow-400 text-[10px]",
									children: "★".repeat(review.rating)
								})]
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs italic dark:text-gray-300 leading-snug",
								children: [
									"\"",
									review.comment,
									"\""
								]
							})]
						}, review._id || review.id)) : /* @__PURE__ */ jsx("p", {
							className: "text-[10px] italic text-gray-400",
							children: "Aun no hay resenas. Se el primero."
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 mb-10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "card-info-box",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[9px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mb-1",
								children: "Origen"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold text-brand-dark dark:text-white",
								children: cafe.origin
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "card-info-box",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[9px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mb-1",
								children: "Tueste"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold text-brand-dark dark:text-white",
								children: cafe.roast
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-auto flex items-center justify-between border-t border-brand-light/20 pt-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: handleVote,
								disabled: voted || isBlockedByRole,
								className: `flex items-center px-3 py-1.5 rounded-lg border shadow-sm transition-all ${voted ? "bg-green-500 border-green-600 scale-95" : "bg-yellow-400 dark:bg-yellow-500 border-yellow-500 hover:scale-105 active:scale-95"}`,
								title: voted ? "Voto registrado" : "Votar por este cafe",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm",
									children: voted ? "✓" : "★"
								}), /* @__PURE__ */ jsx("span", {
									className: `ml-1.5 text-sm font-black ${voted ? "text-white" : "text-brand-dark dark:text-black"}`,
									children: Number(cafe.rating || 0).toFixed(1)
								})]
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-[10px] font-black text-brand-medium dark:text-gray-200 uppercase tracking-widest",
								children: [
									"(",
									cafe.votes || 0,
									" votos)"
								]
							})]
						}), /* @__PURE__ */ jsx("button", {
							onClick: handleAddToCart,
							disabled: isUnavailable || isBlockedByRole,
							className: `w-12 h-12 !p-0 !rounded-xl shadow-2xl transition-colors duration-200 flex items-center justify-center border border-white/10 ${added ? "bg-green-500 scale-110 rotate-12" : isUnavailable || isBlockedByRole ? "cursor-not-allowed bg-gray-400 dark:bg-gray-700 opacity-60" : "bg-brand-medium dark:bg-white hover:bg-brand-dark dark:hover:bg-gray-200 active:opacity-90"}`,
							title: isBlockedByRole ? "Disponible solo para clientes" : isUnavailable ? "Producto no disponible" : "Anadir al carrito",
							children: added ? /* @__PURE__ */ jsx(Check, {
								className: "w-7 h-7 text-white",
								strokeWidth: 3.25
							}) : /* @__PURE__ */ jsx(Plus, {
								className: "w-7 h-7 text-white dark:text-black",
								strokeWidth: 3.25
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(ReviewModal, {
				cafe,
				isOpen: isReviewModalOpen,
				onClose: () => setIsReviewModalOpen(false)
			})
		]
	});
};
var CoffeeList = () => {
	const { filters } = useFilterStore();
	const { cafes, fetchCafes, favorites, fetchFavorites, loading, error } = useCoffeeStore();
	const { user } = useAuthStore();
	const isClient = !!user && ["client", "user"].includes(user.role);
	useEffect(() => {
		fetchCafes();
	}, [fetchCafes]);
	useEffect(() => {
		if (isClient) fetchFavorites();
	}, [isClient, fetchFavorites]);
	const filteredAndSortedCafes = useMemo(() => {
		let result = [...cafes];
		if (filters.availability) result = result.filter((cafe) => cafe.available);
		if (filters.onlyFavorites) result = result.filter((cafe) => favorites.includes(getCafeId(cafe)));
		switch (filters.sortBy) {
			case "price-asc":
				result.sort((a, b) => a.price - b.price);
				break;
			case "price-desc":
				result.sort((a, b) => b.price - a.price);
				break;
			case "rating":
				result.sort((a, b) => b.rating - a.rating);
				break;
			default:
				result.sort((a, b) => a.name.localeCompare(b.name));
				break;
		}
		return result;
	}, [
		cafes,
		filters,
		favorites
	]);
	if (loading) return /* @__PURE__ */ jsx(LoadingSpinner, {});
	if (error) return /* @__PURE__ */ jsx(ErrorState, { message: error });
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full pb-20",
		children: [/* @__PURE__ */ jsx(FilterBar, {}), filteredAndSortedCafes.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "text-center py-20 bg-brand-beige/20 rounded-[3rem] border-4 border-dashed border-brand-light/30",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-3xl font-black text-brand-dark tracking-tighter mb-2",
				children: "No se encontraron cafes"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-brand-medium font-bold uppercase tracking-widest text-xs",
				children: "Prueba ajustando los filtros de busqueda"
			})]
		}) : /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12",
			children: filteredAndSortedCafes.map((cafe) => /* @__PURE__ */ jsx(CoffeeCard, { cafe }, getCafeId(cafe)))
		})]
	});
};
//#endregion
//#region src/pages/HomePage.jsx
var HomePage = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full flex flex-col pt-16",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-16 text-center max-w-3xl mx-auto",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.4em] mb-4 block bg-brand-beige w-fit mx-auto px-4 py-1 rounded-full",
					children: "Edición Limitada"
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "text-6xl font-black text-brand-dark mb-6 leading-[1.1]",
					children: [
						"Catálogo de ",
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx("span", {
							className: "text-brand-medium",
							children: "Café Premium"
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-brand-medium text-xl font-medium leading-relaxed",
					children: "Descubre nuestra exclusiva selección de cafés de origen único, tostados artesanalmente para resaltar cada nota de sabor."
				})
			]
		}), /* @__PURE__ */ jsx(CoffeeList, {})]
	});
};
//#endregion
//#region src/components/forms/LoginForm.jsx
var schema = z.object({
	email: z.string().email("Correo invalido"),
	password: z.string().min(6, "Minimo 6 caracteres")
});
var LoginForm = () => {
	const { login, loading, error: authError } = useAuthStore();
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
	const onSubmit = async (data) => {
		try {
			await login(data);
			navigate("/dashboard");
		} catch (err) {
			console.error(err);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "card-premium w-full max-w-[460px] p-10 sm:p-14",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center mb-12",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-24 h-24 bg-brand-dark dark:bg-[#F1E7E2] rounded-full flex items-center justify-center shadow-2xl mb-8 border-8 border-brand-bg",
					children: /* @__PURE__ */ jsx(Coffee, {
						className: "w-12 h-12 text-white dark:text-[#6F4A2D]",
						strokeWidth: 2.75
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-4xl font-black text-brand-dark mb-2 tracking-tighter",
					children: "Iniciar sesion"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-brand-medium font-bold text-sm uppercase tracking-widest opacity-70",
					children: "Accede a tu cuenta de CafeHub"
				})
			]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Correo electronico"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "email",
							placeholder: "tu@email.com",
							...register("email"),
							className: `input-premium ${errors.email ? "border-red-300 focus:ring-red-100" : ""}`
						}),
						errors.email && /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-red-500 font-bold italic",
							children: errors.email.message
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Contrasena"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "password",
							placeholder: "********",
							...register("password"),
							className: `input-premium ${errors.password ? "border-red-300 ring-4 ring-red-50" : ""}`
						}),
						errors.password && /* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-red-500 font-black uppercase tracking-wider ml-1",
							children: errors.password.message
						})
					]
				}),
				authError && /* @__PURE__ */ jsxs("div", {
					className: "p-5 bg-red-50 text-red-700 rounded-2xl border-2 border-red-100 text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-shake",
					children: [/* @__PURE__ */ jsx("svg", {
						className: "w-6 h-6 shrink-0",
						fill: "currentColor",
						viewBox: "0 0 20 20",
						children: /* @__PURE__ */ jsx("path", {
							fillRule: "evenodd",
							d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
							clipRule: "evenodd"
						})
					}), authError]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "submit",
					disabled: loading,
					className: "btn-premium w-full mt-4",
					children: loading ? /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : "Ingresar"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-center text-brand-medium mt-8 font-medium",
					children: ["No tienes cuenta? ", /* @__PURE__ */ jsx(Link, {
						to: "/register",
						className: "text-brand-dark font-black hover:underline underline-offset-4",
						children: "Registrate aqui"
					})]
				})
			]
		})]
	});
};
//#endregion
//#region src/pages/LoginPage.jsx
var LoginPage = () => {
	return /* @__PURE__ */ jsx("div", {
		className: "flex-1 flex items-center justify-center w-full",
		children: /* @__PURE__ */ jsx(LoginForm, {})
	});
};
//#endregion
//#region src/components/forms/RegisterForm.jsx
var RegisterForm = () => {
	const { register: registerUser, loading, error: authError } = useAuthStore();
	const navigate = useNavigate();
	const { register, handleSubmit, getValues, formState: { errors } } = useForm();
	const onSubmit = async (data) => {
		try {
			await registerUser(data);
			navigate("/dashboard");
		} catch (err) {
			console.error(err);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "card-premium w-full max-w-[500px] p-10 sm:p-14 my-10",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "text-center mb-12",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-4xl font-black text-brand-dark mb-2 tracking-tighter",
				children: "Crear cuenta"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-brand-medium font-bold text-sm uppercase tracking-widest opacity-70",
				children: "Unete a la comunidad de CafeHub"
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Nombre completo"
						}),
						/* @__PURE__ */ jsx("input", {
							placeholder: "Juan Perez",
							...register("name", { required: "El nombre es obligatorio" }),
							className: `input-premium ${errors.name ? "border-red-300 ring-4 ring-red-50" : ""}`
						}),
						errors.name && /* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-red-500 font-black uppercase tracking-wider ml-1",
							children: errors.name.message
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Correo electronico"
						}),
						/* @__PURE__ */ jsx("input", {
							placeholder: "tu@email.com",
							...register("email", {
								required: "El correo es obligatorio",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Correo electronico invalido"
								}
							}),
							className: `input-premium ${errors.email ? "border-red-300 ring-4 ring-red-50" : ""}`
						}),
						errors.email && /* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-red-500 font-black uppercase tracking-wider ml-1",
							children: errors.email.message
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Contrasena"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "password",
							placeholder: "********",
							...register("password", {
								required: "La contrasena es obligatoria",
								minLength: {
									value: 6,
									message: "Minimo 6 caracteres"
								}
							}),
							className: `input-premium ${errors.password ? "border-red-300 ring-4 ring-red-50" : ""}`
						}),
						errors.password && /* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-red-500 font-black uppercase tracking-wider ml-1",
							children: errors.password.message
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Confirmar contrasena"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "password",
							placeholder: "********",
							...register("confirmPassword", {
								required: "Confirma tu contrasena",
								validate: (value) => value === getValues("password") || "Las contrasenas no coinciden"
							}),
							className: `input-premium ${errors.confirmPassword ? "border-red-300 ring-4 ring-red-50" : ""}`
						}),
						errors.confirmPassword && /* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-red-500 font-black uppercase tracking-wider ml-1",
							children: errors.confirmPassword.message
						})
					]
				}),
				authError && /* @__PURE__ */ jsxs("div", {
					className: "p-5 bg-red-50 text-red-700 rounded-2xl border-2 border-red-100 text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-shake",
					children: [/* @__PURE__ */ jsx("svg", {
						className: "w-6 h-6 shrink-0",
						fill: "currentColor",
						viewBox: "0 0 20 20",
						children: /* @__PURE__ */ jsx("path", {
							fillRule: "evenodd",
							d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
							clipRule: "evenodd"
						})
					}), authError]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "pt-6",
					children: /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: loading,
						className: "btn-premium w-full shadow-2xl py-5 text-sm uppercase tracking-[0.2em]",
						children: loading ? /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" }) : "Crear cuenta"
					})
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-center text-brand-medium mt-10 font-bold text-xs uppercase tracking-widest",
					children: ["Ya tienes cuenta? ", /* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: "text-brand-dark font-black hover:underline underline-offset-8 decoration-2",
						children: "Inicia sesion"
					})]
				})
			]
		})]
	});
};
//#endregion
//#region src/pages/RegisterPage.jsx
var RegisterPage = () => {
	return /* @__PURE__ */ jsx("div", {
		className: "flex-1 flex items-center justify-center w-full",
		children: /* @__PURE__ */ jsx(RegisterForm, {})
	});
};
//#endregion
//#region src/pages/Dashboard.jsx
var Dashboard = () => {
	const { user, loading, refreshMe } = useAuthStore();
	const { isDark } = useThemeStore();
	const { cafes, cart, favorites, fetchCafes, fetchFavorites, clearItemFromCart, removeFromCart, addToCart } = useCoffeeStore();
	const [reviews, setReviews] = useState([]);
	const [dashboardError, setDashboardError] = useState("");
	useEffect(() => {
		const loadDashboard = async () => {
			try {
				await Promise.all([
					fetchCafes(),
					fetchFavorites(),
					refreshMe()
				]);
				const myReviews = await reviewApi.getMine();
				setReviews(Array.isArray(myReviews) ? myReviews : []);
			} catch {
				setDashboardError("No se pudo actualizar tu panel en este momento.");
			}
		};
		loadDashboard();
	}, [
		fetchCafes,
		fetchFavorites,
		refreshMe
	]);
	const favoriteCafes = useMemo(() => {
		const favoriteSet = new Set(favorites.map(String));
		return cafes.filter((cafe) => favoriteSet.has(String(cafe._id || cafe.id)));
	}, [cafes, favorites]);
	const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
	if (loading) return /* @__PURE__ */ jsx(LoadingSpinner, {});
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto w-full pt-8 px-4 pb-20",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "mb-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 mb-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg border border-brand-light/30 dark:border-white/15",
						style: {
							backgroundColor: isDark ? "#F1E7E2" : "#3E2723",
							color: isDark ? "#3E2723" : "#FFFFFF"
						},
						children: /* @__PURE__ */ jsx("span", {
							style: { color: isDark ? "#3E2723" : "#FFFFFF" },
							className: "leading-none font-black",
							children: (user?.name || user?.email || "U").trim().charAt(0).toUpperCase()
						})
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-4xl font-black text-brand-dark tracking-tight",
						children: ["Hola, ", user?.name || "Barista"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-brand-medium text-lg font-medium",
						children: "Tu actividad de CafeHub, siempre al dia."
					})] })]
				}), dashboardError && /* @__PURE__ */ jsx("div", {
					className: "mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700",
					children: dashboardError
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-4 gap-5 mb-10",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-6",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Favoritos"
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-4xl font-black text-brand-dark mt-3",
							children: favorites.length
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-6",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Resenas"
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-4xl font-black text-brand-dark mt-3",
							children: reviews.length
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-6",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Puntos"
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-4xl font-black text-brand-dark mt-3",
							children: user?.points || 0
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-6",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Carrito"
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-4xl font-black text-brand-dark mt-3",
							children: cart.length
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "card-premium p-8",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black text-brand-dark uppercase tracking-wide mb-6",
							children: "Tus favoritos"
						}), favoriteCafes.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-brand-medium font-bold",
							children: "Todavia no has guardado cafes favoritos."
						}) : /* @__PURE__ */ jsx("div", {
							className: "space-y-4",
							children: favoriteCafes.map((cafe) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4 rounded-2xl border border-brand-light p-4",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: cafe.imageUrl,
										alt: cafe.name,
										className: "h-16 w-16 rounded-xl object-cover"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ jsx("h3", {
											className: "font-black text-brand-dark",
											children: cafe.name
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-brand-medium",
											children: cafe.brand
										})]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "font-black text-brand-dark",
										children: formatCOP(cafe.price)
									})
								]
							}, cafe._id || cafe.id))
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card-premium p-8",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black text-brand-dark uppercase tracking-wide mb-6",
							children: "Tu carrito"
						}), cart.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-brand-medium font-bold",
							children: "Tu carrito esta vacio."
						}) : /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [cart.map((item) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4 rounded-2xl border border-brand-light p-4",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.imageUrl,
										alt: item.name,
										className: "h-16 w-16 rounded-xl object-cover"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1",
										children: [
											/* @__PURE__ */ jsx("h3", {
												className: "font-black text-brand-dark",
												children: item.name
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "text-xs font-bold text-brand-medium",
												children: [
													formatCOP(item.price),
													" x ",
													item.quantity
												]
											}),
											!item.available && /* @__PURE__ */ jsx("p", {
												className: "mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-600",
												children: "No disponible"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ jsx("button", {
												className: "rounded-lg border border-brand-light px-3 py-1 font-black",
												onClick: () => removeFromCart(item.id),
												children: "-"
											}),
											/* @__PURE__ */ jsx("button", {
												className: "rounded-lg border border-brand-light px-3 py-1 font-black disabled:cursor-not-allowed disabled:opacity-50",
												onClick: () => addToCart(item),
												disabled: !item.available,
												children: "+"
											}),
											/* @__PURE__ */ jsx("button", {
												className: "rounded-lg bg-red-600 px-3 py-1 font-black text-white",
												onClick: () => clearItemFromCart(item.id),
												children: "Quitar"
											})
										]
									})
								]
							}, item.id)), /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between border-t border-brand-light pt-5 text-lg font-black text-brand-dark",
								children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", { children: formatCOP(cartTotal) })]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "card-premium p-8 lg:col-span-2",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black text-brand-dark uppercase tracking-wide mb-6",
							children: "Tus resenas"
						}), reviews.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-brand-medium font-bold",
							children: "Cuando publiques una resena, aparecera aqui."
						}) : /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: reviews.map((review) => /* @__PURE__ */ jsxs("article", {
								className: "rounded-2xl border border-brand-light p-5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 mb-4",
									children: [review.cafe?.imageUrl && /* @__PURE__ */ jsx("img", {
										src: review.cafe.imageUrl,
										alt: review.cafe.name,
										className: "h-14 w-14 rounded-xl object-cover"
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
										className: "font-black text-brand-dark",
										children: review.cafe?.name || "Cafe eliminado"
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs font-bold text-brand-medium",
										children: [review.rating, "/5 estrellas"]
									})] })]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm font-medium text-brand-medium",
									children: [
										"\"",
										review.comment,
										"\""
									]
								})]
							}, review._id))
						})]
					})
				]
			})
		]
	});
};
//#endregion
//#region src/pages/AdminDashboard.jsx
var emptyCafe = {
	name: "",
	brand: "",
	description: "",
	origin: "",
	roast: "Medio",
	price: "0",
	available: true,
	imageUrl: ""
};
var AdminDashboard = () => {
	const { isAdmin } = useAuthStore();
	const [users, setUsers] = useState([]);
	const [cafes, setCafes] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [activeTab, setActiveTab] = useState("cafes");
	const [adminError, setAdminError] = useState("");
	const [loading, setLoading] = useState(true);
	const [newCafe, setNewCafe] = useState(emptyCafe);
	const [editingCafeId, setEditingCafeId] = useState(null);
	const [editingCafeData, setEditingCafeData] = useState(emptyCafe);
	const stats = useMemo(() => ({
		users: users.length,
		cafes: cafes.length,
		reviews: reviews.length,
		averageRating: reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1) : "0.0"
	}), [
		users,
		cafes,
		reviews
	]);
	const loadAdminData = async () => {
		setLoading(true);
		setAdminError("");
		try {
			const [usersRes, cafesRes, reviewsRes] = await Promise.all([
				adminApi.getUsers(),
				adminApi.getCafes(),
				adminApi.getReviews()
			]);
			setUsers(Array.isArray(usersRes) ? usersRes : []);
			setCafes(Array.isArray(cafesRes) ? cafesRes : []);
			setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);
		} catch (error) {
			setAdminError(error.response?.data?.message || "No se pudo cargar el panel de administracion.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (isAdmin()) loadAdminData();
	}, [isAdmin]);
	const buildCafePayload = (cafe) => ({
		...cafe,
		price: Number(cafe.price),
		available: Boolean(cafe.available),
		imageUrl: cafe.imageUrl || void 0
	});
	const handleRoleChange = async (userId, newRole) => {
		try {
			const updatedUser = await adminApi.updateUserRole(userId, newRole);
			setUsers((current) => current.map((user) => user._id === userId ? updatedUser : user));
		} catch (error) {
			setAdminError(error.response?.data?.message || "No se pudo actualizar el rol.");
		}
	};
	const handleDeleteUser = async (userId) => {
		if (!confirm("Seguro que deseas eliminar este usuario?")) return;
		try {
			await adminApi.deleteUser(userId);
			setUsers((current) => current.filter((user) => user._id !== userId));
		} catch (error) {
			setAdminError(error.response?.data?.message || "No se pudo eliminar el usuario.");
		}
	};
	const handleCreateCafe = async (event) => {
		event.preventDefault();
		setAdminError("");
		try {
			const created = await adminApi.createCafe(buildCafePayload(newCafe));
			setCafes((current) => [...current, created]);
			setNewCafe(emptyCafe);
		} catch (error) {
			setAdminError(error.response?.data?.message || "No se pudo crear el cafe.");
		}
	};
	const handleEditCafe = (cafe) => {
		setEditingCafeId(cafe._id);
		setEditingCafeData({
			name: cafe.name || "",
			brand: cafe.brand || "",
			description: cafe.description || "",
			origin: cafe.origin || "",
			roast: cafe.roast || "Medio",
			price: String(cafe.price ?? 0),
			available: cafe.available ?? true,
			imageUrl: cafe.imageUrl || ""
		});
		setAdminError("");
	};
	const handleSaveCafe = async (cafeId) => {
		setAdminError("");
		try {
			const updated = await adminApi.updateCafe(cafeId, buildCafePayload(editingCafeData));
			setCafes((current) => current.map((cafe) => cafe._id === cafeId ? updated : cafe));
			setEditingCafeId(null);
			setEditingCafeData(emptyCafe);
		} catch (error) {
			setAdminError(error.response?.data?.message || "No se pudo actualizar el cafe.");
		}
	};
	const handleDeleteCafe = async (cafeId) => {
		if (!confirm("Seguro que deseas eliminar este cafe?")) return;
		try {
			await adminApi.deleteCafe(cafeId);
			setCafes((current) => current.filter((cafe) => cafe._id !== cafeId));
			setReviews((current) => current.filter((review) => review.cafe?._id !== cafeId));
		} catch (error) {
			setAdminError(error.response?.data?.message || "No se pudo eliminar el cafe.");
		}
	};
	const handleDeleteReview = async (reviewId) => {
		if (!confirm("Seguro que deseas eliminar esta resena?")) return;
		try {
			await adminApi.deleteReview(reviewId);
			setReviews((current) => current.filter((review) => review._id !== reviewId));
		} catch (error) {
			setAdminError(error.response?.data?.message || "No se pudo eliminar la resena.");
		}
	};
	const updateCafeForm = (setter) => (field, value) => {
		setter((current) => ({
			...current,
			[field]: value
		}));
	};
	if (!isAdmin()) return /* @__PURE__ */ jsx("div", {
		className: "max-w-4xl mx-auto p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "card-premium p-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-black text-brand-dark",
				children: "Acceso restringido"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-brand-medium font-bold mt-2",
				children: "No tienes permisos para acceder a esta pagina."
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-7xl mx-auto w-full px-4 py-10",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-black text-brand-dark tracking-tight",
					children: "Panel de administracion"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-brand-medium font-bold mt-2",
					children: "Gestiona usuarios, cafes y resenas conectadas a la base de datos."
				})]
			}),
			adminError && /* @__PURE__ */ jsx("div", {
				className: "mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700",
				children: adminError
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Usuarios"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.users
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Cafes"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.cafes
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Resenas"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.reviews
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Rating medio"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.averageRating
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8 flex flex-wrap gap-3",
				children: [[
					["cafes", `Cafes (${cafes.length})`],
					["reviews", `Resenas (${reviews.length})`],
					["users", `Usuarios (${users.length})`]
				].map(([tab, label]) => /* @__PURE__ */ jsx("button", {
					onClick: () => setActiveTab(tab),
					className: `rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-brand-dark text-white shadow-lg" : "bg-brand-beige text-brand-dark border border-brand-light"}`,
					children: label
				}, tab)), /* @__PURE__ */ jsx("button", {
					onClick: loadAdminData,
					className: "rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest bg-white text-brand-dark border border-brand-light",
					children: "Actualizar"
				})]
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "card-premium p-10 text-center font-black text-brand-medium",
				children: "Cargando panel..."
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
				activeTab === "cafes" && /* @__PURE__ */ jsxs("section", {
					className: "space-y-8",
					children: [
						/* @__PURE__ */ jsx(CafeForm, {
							title: "Crear nuevo cafe",
							cafe: newCafe,
							onChange: updateCafeForm(setNewCafe),
							onSubmit: handleCreateCafe,
							submitLabel: "Agregar cafe"
						}),
						editingCafeId && /* @__PURE__ */ jsx(CafeForm, {
							title: "Editar cafe",
							cafe: editingCafeData,
							onChange: updateCafeForm(setEditingCafeData),
							onSubmit: (event) => {
								event.preventDefault();
								handleSaveCafe(editingCafeId);
							},
							submitLabel: "Guardar cambios",
							secondaryAction: () => {
								setEditingCafeId(null);
								setEditingCafeData(emptyCafe);
							}
						}),
						/* @__PURE__ */ jsx(DataTable, {
							headers: [
								"Nombre",
								"Marca",
								"Origen",
								"Precio",
								"Estado",
								"Acciones"
							],
							emptyMessage: "No hay cafes registrados.",
							children: cafes.map((cafe) => /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("td", {
									className: "table-cell-admin font-black",
									children: cafe.name
								}),
								/* @__PURE__ */ jsx("td", {
									className: "table-cell-admin",
									children: cafe.brand
								}),
								/* @__PURE__ */ jsx("td", {
									className: "table-cell-admin",
									children: cafe.origin
								}),
								/* @__PURE__ */ jsx("td", {
									className: "table-cell-admin",
									children: formatCOP(cafe.price)
								}),
								/* @__PURE__ */ jsx("td", {
									className: "table-cell-admin",
									children: cafe.available ? "Disponible" : "No disponible"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "table-cell-admin",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => handleEditCafe(cafe),
											className: "btn-table-primary",
											children: "Editar"
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => handleDeleteCafe(cafe._id),
											className: "btn-table-danger",
											children: "Eliminar"
										})]
									})
								})
							] }, cafe._id))
						})
					]
				}),
				activeTab === "reviews" && /* @__PURE__ */ jsx(DataTable, {
					headers: [
						"Usuario",
						"Cafe",
						"Calificacion",
						"Comentario",
						"Acciones"
					],
					emptyMessage: "No hay resenas registradas.",
					children: reviews.map((review) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: review.user?.name || "Sin usuario"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: review.cafe?.name || "Cafe eliminado"
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "table-cell-admin",
							children: [review.rating, "/5"]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin max-w-md",
							children: review.comment
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => handleDeleteReview(review._id),
								className: "btn-table-danger",
								children: "Eliminar"
							})
						})
					] }, review._id))
				}),
				activeTab === "users" && /* @__PURE__ */ jsx(DataTable, {
					headers: [
						"Nombre",
						"Email",
						"Rol",
						"Puntos",
						"Acciones"
					],
					emptyMessage: "No hay usuarios registrados.",
					children: users.map((user) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin font-black",
							children: user.name
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: user.email
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: /* @__PURE__ */ jsxs("select", {
								value: user.role,
								onChange: (event) => handleRoleChange(user._id, event.target.value),
								className: "rounded-lg border border-brand-light bg-brand-beige px-3 py-2 text-sm font-bold text-brand-dark dark:text-white",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "client",
										children: "Cliente"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "user",
										children: "Cliente"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "admin",
										children: "Administrador"
									})
								]
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: user.points || 0
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => handleDeleteUser(user._id),
								className: "btn-table-danger",
								children: "Eliminar"
							})
						})
					] }, user._id))
				})
			] })
		]
	});
};
var CafeForm = ({ title, cafe, onChange, onSubmit, submitLabel, secondaryAction }) => /* @__PURE__ */ jsxs("section", {
	className: "card-premium p-6 sm:p-8",
	children: [/* @__PURE__ */ jsx("h2", {
		className: "text-2xl font-black text-brand-dark mb-6",
		children: title
	}), /* @__PURE__ */ jsxs("form", {
		onSubmit,
		className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
		children: [
			/* @__PURE__ */ jsx("input", {
				value: cafe.name,
				onChange: (event) => onChange("name", event.target.value),
				placeholder: "Nombre",
				className: "input-premium",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				value: cafe.brand,
				onChange: (event) => onChange("brand", event.target.value),
				placeholder: "Marca",
				className: "input-premium",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				value: cafe.origin,
				onChange: (event) => onChange("origin", event.target.value),
				placeholder: "Origen",
				className: "input-premium",
				required: true
			}),
			/* @__PURE__ */ jsxs("select", {
				value: cafe.roast,
				onChange: (event) => onChange("roast", event.target.value),
				className: "input-premium",
				children: [
					/* @__PURE__ */ jsx("option", {
						value: "Claro",
						children: "Claro"
					}),
					/* @__PURE__ */ jsx("option", {
						value: "Medio",
						children: "Medio"
					}),
					/* @__PURE__ */ jsx("option", {
						value: "Oscuro",
						children: "Oscuro"
					})
				]
			}),
			/* @__PURE__ */ jsx("input", {
				type: "number",
				value: cafe.price,
				onChange: (event) => onChange("price", event.target.value),
				placeholder: "Precio",
				className: "input-premium",
				min: "0",
				step: "0.01",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				value: cafe.imageUrl,
				onChange: (event) => onChange("imageUrl", event.target.value),
				placeholder: "URL de imagen o deja vacío para subir archivo",
				className: "input-premium"
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex flex-col gap-2 rounded-2xl border border-brand-light bg-brand-bg px-5 py-4 text-sm font-black text-brand-dark",
				children: [/* @__PURE__ */ jsx("span", {
					className: "uppercase tracking-[0.2em] text-[10px] font-black text-brand-medium",
					children: "Imagen desde tu equipo"
				}), /* @__PURE__ */ jsx("input", {
					type: "file",
					accept: "image/*",
					onChange: (event) => {
						const file = event.target.files?.[0];
						if (!file) return;
						const reader = new FileReader();
						reader.onload = () => onChange("imageUrl", reader.result || "");
						reader.readAsDataURL(file);
					},
					className: "input-premium"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-3 rounded-2xl border border-brand-light bg-brand-bg px-5 py-4 text-sm font-black text-brand-dark",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: cafe.available,
					onChange: (event) => onChange("available", event.target.checked)
				}), "Disponible para clientes"]
			}),
			/* @__PURE__ */ jsx("textarea", {
				value: cafe.description,
				onChange: (event) => onChange("description", event.target.value),
				placeholder: "Descripcion",
				rows: "3",
				className: "input-premium lg:col-span-2",
				required: true
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-2 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx("button", {
					type: "submit",
					className: "btn-premium",
					children: submitLabel
				}), secondaryAction && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: secondaryAction,
					className: "rounded-2xl border border-brand-light px-6 py-4 text-xs font-black uppercase tracking-widest text-brand-dark",
					children: "Cancelar"
				})]
			})
		]
	})]
});
var DataTable = ({ headers, children, emptyMessage }) => {
	const rowCount = Children.count(children);
	return /* @__PURE__ */ jsx("div", {
		className: "card-premium overflow-x-auto",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full min-w-[760px] border-collapse",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", {
				className: "bg-brand-bg",
				children: headers.map((header) => /* @__PURE__ */ jsx("th", {
					className: "border-b border-brand-light px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium",
					children: header
				}, header))
			}) }), /* @__PURE__ */ jsx("tbody", { children: rowCount ? children : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
				colSpan: headers.length,
				className: "px-6 py-10 text-center font-bold text-brand-medium",
				children: emptyMessage
			}) }) })]
		})
	});
};
//#endregion
//#region src/pages/CheckoutPage.jsx
var CheckoutPage = () => {
	const navigate = useNavigate();
	const { cart, clearCart } = useCoffeeStore();
	const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
	const total = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
	const handleConfirmPayment = () => {
		clearCart();
		navigate("/dashboard");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-5xl mx-auto pt-10 pb-20",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "mb-10",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "inline-flex rounded-full bg-brand-beige px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark",
					children: "Cobrar"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-4 text-4xl font-black tracking-tight text-brand-dark dark:text-white",
					children: "Finalizar compra"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-brand-medium dark:text-gray-300",
					children: "Revisa tu pedido antes de continuar con el cobro."
				})
			]
		}), cart.length === 0 ? /* @__PURE__ */ jsxs("section", {
			className: "card-premium p-10 text-center",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-black text-brand-dark dark:text-white",
					children: "No hay productos en el carrito"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-brand-medium dark:text-gray-300",
					children: "Agrega cafes al carrito para poder pasar a cobrar."
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => navigate("/"),
					className: "mt-8 btn-premium px-8 py-4",
					children: "Ir al catalogo"
				})
			]
		}) : /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 lg:grid-cols-[1.5fr_1fr]",
			children: [/* @__PURE__ */ jsxs("section", {
				className: "card-premium p-8",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-6 text-2xl font-black uppercase tracking-wide text-brand-dark dark:text-white",
					children: "Resumen del pedido"
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: cart.map((item) => /* @__PURE__ */ jsxs("article", {
						className: "flex items-center gap-4 rounded-2xl border border-brand-light/20 p-4",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: item.imageUrl,
								alt: item.name,
								className: "h-20 w-20 rounded-2xl object-cover"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ jsx("h3", {
										className: "font-black text-brand-dark dark:text-white",
										children: item.name
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs font-bold uppercase tracking-[0.2em] text-brand-medium dark:text-gray-400",
										children: item.brand
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-2 text-sm font-bold text-brand-medium dark:text-gray-300",
										children: [
											formatCOP(item.price),
											" x ",
											item.quantity
										]
									})
								]
							}),
							/* @__PURE__ */ jsx("strong", {
								className: "text-lg font-black text-brand-dark dark:text-white",
								children: formatCOP(item.price * item.quantity)
							})
						]
					}, item.id))
				})]
			}), /* @__PURE__ */ jsxs("aside", {
				className: "card-premium h-fit p-8",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-black uppercase tracking-wide text-brand-dark dark:text-white",
						children: "Total a cobrar"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 space-y-4 border-y border-brand-light/20 py-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-sm font-bold text-brand-medium dark:text-gray-300",
							children: [/* @__PURE__ */ jsx("span", { children: "Productos" }), /* @__PURE__ */ jsx("span", { children: totalItems })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-sm font-bold text-brand-medium dark:text-gray-300",
							children: [/* @__PURE__ */ jsx("span", { children: "Subtotal" }), /* @__PURE__ */ jsx("span", { children: formatCOP(total) })]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex items-end justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black uppercase tracking-[0.3em] text-brand-medium dark:text-gray-400",
							children: "Total final"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-3xl font-black tracking-tight text-brand-dark dark:text-white",
							children: formatCOP(total)
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleConfirmPayment,
						className: "mt-8 w-full btn-premium py-5",
						children: "Confirmar cobro"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => navigate(-1),
						className: "mt-4 w-full rounded-2xl border border-brand-light/20 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-brand-dark transition-colors hover:bg-brand-light/10 dark:text-white",
						children: "Volver"
					})
				]
			})]
		})]
	});
};
//#endregion
//#region src/components/ProtectedRoute.jsx
var ProtectedRoute = ({ children, requiredRole }) => {
	const { isAuthenticated, loading, user } = useAuthStore();
	if (loading) return null;
	if (!isAuthenticated) return /* @__PURE__ */ jsx(Navigate, { to: "/login" });
	if (requiredRole && user?.role !== requiredRole) return /* @__PURE__ */ jsx(Navigate, { to: "/dashboard" });
	return children;
};
//#endregion
//#region src/App.jsx
var hasBootstrappedApp = false;
function App() {
	const initialize = useAuthStore((state) => state.initialize);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const initializing = useAuthStore((state) => state.initializing);
	const initTheme = useThemeStore((state) => state.initTheme);
	useEffect(() => {
		if (hasBootstrappedApp) return;
		hasBootstrappedApp = true;
		initTheme();
		initialize();
	}, [initTheme, initialize]);
	if (initializing) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center",
		children: "Cargando sesión..."
	});
	return /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsxs(Route, {
		element: /* @__PURE__ */ jsx(MainLayout, {}),
		children: [
			/* @__PURE__ */ jsx(Route, {
				path: "/",
				element: /* @__PURE__ */ jsx(HomePage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/login",
				element: isAuthenticated ? /* @__PURE__ */ jsx(Navigate, { to: "/dashboard" }) : /* @__PURE__ */ jsx(LoginPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/register",
				element: isAuthenticated ? /* @__PURE__ */ jsx(Navigate, { to: "/dashboard" }) : /* @__PURE__ */ jsx(RegisterPage, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/dashboard",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Dashboard, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/cobrar",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(CheckoutPage, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/admin",
				element: /* @__PURE__ */ jsx(ProtectedRoute, {
					requiredRole: "admin",
					children: /* @__PURE__ */ jsx(AdminDashboard, {})
				})
			})
		]
	}) });
}
//#endregion
//#region app/routes/catchall.jsx
var catchall_exports = /* @__PURE__ */ __exportAll({ default: () => catchall_default });
var catchall_default = UNSAFE_withComponentProps(function Component() {
	return /* @__PURE__ */ jsx(App, {});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-CM08-lPB.js",
		"imports": ["/assets/preload-helper-CrH_C1E0.js", "/assets/jsx-runtime-BgPukLlu.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-LhO6qfX-.js",
			"imports": ["/assets/preload-helper-CrH_C1E0.js", "/assets/jsx-runtime-BgPukLlu.js"],
			"css": ["/assets/root-Cu2cwVrb.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/catchall": {
			"id": "routes/catchall",
			"parentId": "root",
			"path": "*?",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/catchall-BmZzcSEY.js",
			"imports": [
				"/assets/preload-helper-CrH_C1E0.js",
				"/assets/useAuthStore-BGE1HaAA.js",
				"/assets/jsx-runtime-BgPukLlu.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-83bda6e8.js",
	"version": "83bda6e8",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build\\client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"v8_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/catchall": {
		id: "routes/catchall",
		parentId: "root",
		path: "*?",
		index: void 0,
		caseSensitive: void 0,
		module: catchall_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
