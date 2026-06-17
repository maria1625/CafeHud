import { t as useAuthStore } from "./useAuthStore-C1pxADfH.js";
import { t as useCoffeeStore } from "./useCoffeeStore-CeDh0gDO.js";
import { t as formatCOP } from "./formatters-DyCPb0-K.js";
import { t as LoadingSpinner } from "./LoadingSpinner-CQ0bRasM.js";
import { useNavigate } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Check, Plus, X } from "lucide-react";
import { create } from "zustand";
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
						"aria-label": "Mostrar solo cafes disponibles",
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
						"aria-label": "Mostrar solo mis favoritos",
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
					"aria-label": "Ordenar cafes",
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
				"aria-label": "Limpiar filtros",
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
			setError(err.response?.data?.message || "No se pudo publicar la reseña.");
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
						children: "Deja tu reseña"
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
								htmlFor: "review-comment",
								className: "text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest ml-2",
								children: "Tu experiencia"
							}), /* @__PURE__ */ jsx("textarea", {
								id: "review-comment",
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
								children: saving ? "Publicando..." : "Publicar reseña"
							}), /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" })]
						})
					]
				})]
			})
		})]
	});
};
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
	const stock = Number(cafe.stock);
	const hasStock = Number.isFinite(stock);
	const isOutOfStock = hasStock && stock <= 0;
	const isUnavailable = !cafe.available || isOutOfStock;
	const badgeLabel = isOutOfStock ? "Agotado" : !cafe.available ? "No disponible" : hasStock ? `Stock: ${stock}` : null;
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
						width: "800",
						height: "800",
						loading: "lazy",
						decoding: "async",
						className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleToggleFavorite,
						disabled: isBlockedByRole,
						"aria-label": isBlockedByRole ? "Disponible solo para clientes" : isFavorite ? "Quitar de favoritos" : "Anadir a favoritos",
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
					badgeLabel && /* @__PURE__ */ jsx("div", {
						className: "absolute top-6 left-6 z-20 rounded-full border border-white/20 bg-black/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md",
						children: badgeLabel
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
							"aria-label": showReviews ? "Ocultar reseñas" : `Ver reseñas (${cafe.reviews?.length || 0})`,
							className: "text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest hover:text-brand-dark dark:hover:text-white transition-colors",
							children: showReviews ? "Ocultar reseñas" : `Ver reseñas (${cafe.reviews?.length || 0})`
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => {
								if (!requireSession()) return;
								setIsReviewModalOpen(true);
							},
							disabled: isBlockedByRole,
							"aria-label": isBlockedByRole ? "Disponible solo para clientes" : "Escribir reseña",
							className: "text-[10px] font-black text-brand-medium dark:text-white underline uppercase tracking-widest",
							title: isBlockedByRole ? "Disponible solo para clientes" : "Escribir reseña",
							children: "Escribir reseña"
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
							children: "Aun no hay reseñas. Se el primero."
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
								"aria-label": voted ? "Voto registrado" : "Votar por este cafe",
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
							"aria-label": isBlockedByRole ? "Disponible solo para clientes" : isUnavailable ? "Producto no disponible" : "Anadir al carrito",
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
export { HomePage as default };
