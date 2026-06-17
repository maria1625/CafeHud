import { a as reviewApi, t as useAuthStore } from "./useAuthStore-C1pxADfH.js";
import { t as useThemeStore } from "./useThemeStore-Cmsy8b-V.js";
import { t as useCoffeeStore } from "./useCoffeeStore-CeDh0gDO.js";
import { t as formatCOP } from "./formatters-DyCPb0-K.js";
import { t as LoadingSpinner } from "./LoadingSpinner-CQ0bRasM.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
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
							children: "Reseñas"
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
										width: "64",
										height: "64",
										loading: "lazy",
										decoding: "async",
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
										width: "64",
										height: "64",
										loading: "lazy",
										decoding: "async",
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
												"aria-label": `Quitar una unidad de ${item.name}`,
												className: "rounded-lg border border-brand-light px-3 py-1 font-black",
												onClick: () => removeFromCart(item.id),
												children: "-"
											}),
											/* @__PURE__ */ jsx("button", {
												"aria-label": `Agregar una unidad de ${item.name}`,
												className: "rounded-lg border border-brand-light px-3 py-1 font-black disabled:cursor-not-allowed disabled:opacity-50",
												onClick: () => addToCart(item),
												disabled: !item.available,
												children: "+"
											}),
											/* @__PURE__ */ jsx("button", {
												"aria-label": `Quitar ${item.name} del carrito`,
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
							children: "Tus reseñas"
						}), reviews.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-brand-medium font-bold",
							children: "Cuando publiques una reseña, aparecera aqui."
						}) : /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: reviews.map((review) => /* @__PURE__ */ jsxs("article", {
								className: "rounded-2xl border border-brand-light p-5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 mb-4",
									children: [review.cafe?.imageUrl && /* @__PURE__ */ jsx("img", {
										src: review.cafe.imageUrl,
										alt: review.cafe.name,
										width: "56",
										height: "56",
										loading: "lazy",
										decoding: "async",
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
export { Dashboard as default };
