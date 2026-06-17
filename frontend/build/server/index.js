import { t as useAuthStore } from "./assets/useAuthStore-C1pxADfH.js";
import { t as useThemeStore } from "./assets/useThemeStore-Cmsy8b-V.js";
import { t as useCoffeeStore } from "./assets/useCoffeeStore-CeDh0gDO.js";
import { t as formatCOP } from "./assets/formatters-DyCPb0-K.js";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Navigate, Outlet, Route, Routes, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, useLocation, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Suspense, lazy, useEffect, useState } from "react";
import { ArrowRight, Minus, Moon, Plus, ShoppingBag, Sun, Trash2, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
var SITE_URL = "https://cafehud-frontend.onrender.com";
var DEFAULT_TITLE = "CafeHub Premium | Cafe de especialidad y compras en linea";
var DEFAULT_DESCRIPTION = "Descubre CafeHub Premium: catalogo de cafe de especialidad, favoritos, reseñas y pedidos en linea.";
var getBackendOrigin = () => {
	const apiUrl = "http://localhost:4000";
	try {
		return new URL(apiUrl).origin;
	} catch {
		return null;
	}
};
var buildCsp = () => {
	return [
		"default-src 'self'",
		"base-uri 'self'",
		"object-src 'none'",
		"frame-ancestors 'self'",
		"img-src 'self' https: data: blob:",
		"font-src 'self' https://fonts.gstatic.com data:",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"script-src 'self' 'unsafe-inline'",
		`connect-src 'self' https: wss:`,
		"form-action 'self'",
		"upgrade-insecure-requests"
	].join("; ");
};
function Layout({ children }) {
	const backendOrigin = getBackendOrigin();
	return /* @__PURE__ */ jsxs("html", {
		lang: "es",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}),
			/* @__PURE__ */ jsx("title", { children: DEFAULT_TITLE }),
			/* @__PURE__ */ jsx("meta", {
				name: "description",
				content: DEFAULT_DESCRIPTION
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "robots",
				content: "index, follow"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "theme-color",
				content: "#3E2723"
			}),
			/* @__PURE__ */ jsx("meta", {
				httpEquiv: "Content-Security-Policy",
				content: buildCsp()
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:type",
				content: "website"
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:site_name",
				content: "CafeHub Premium"
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:url",
				content: SITE_URL
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:image",
				content: `${SITE_URL}/images/hero.png`
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:title",
				content: DEFAULT_TITLE
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:description",
				content: DEFAULT_DESCRIPTION
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "twitter:card",
				content: "summary_large_image"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "twitter:title",
				content: DEFAULT_TITLE
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "twitter:description",
				content: DEFAULT_DESCRIPTION
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "twitter:image",
				content: `${SITE_URL}/images/hero.png`
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "canonical",
				href: SITE_URL
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			}),
			/* @__PURE__ */ jsx("link", {
				rel: "dns-prefetch",
				href: SITE_URL
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
			backendOrigin && /* @__PURE__ */ jsx("link", {
				rel: "preconnect",
				href: backendOrigin,
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
								"aria-label": `Ampliar imagen de ${item.name}`,
								title: "Ampliar imagen",
								children: [/* @__PURE__ */ jsx("img", {
									src: item.imageUrl,
									alt: item.name,
									width: "112",
									height: "112",
									loading: "lazy",
									decoding: "async",
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
											"aria-label": `Eliminar ${item.name} del carrito`,
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
						width: "1024",
						height: "1024",
						decoding: "async",
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
	const handleLogout = async () => {
		await logout();
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
var HomePage = lazy(() => import("./assets/HomePage-kYIySLfl.js"));
var LoginPage = lazy(() => import("./assets/LoginPage-D3bbgaxm.js"));
var RegisterPage = lazy(() => import("./assets/RegisterPage-BVYq2_fX.js"));
var Dashboard = lazy(() => import("./assets/Dashboard-C7CSM-kK.js"));
var AdminDashboard = lazy(() => import("./assets/AdminDashboard-B5xTeHP_.js"));
var CheckoutPage = lazy(() => import("./assets/CheckoutPage-BzH04MWQ.js"));
var ROUTE_META = {
	"/": {
		title: "CafeHub Premium | Catalogo de cafe de especialidad",
		description: "Explora cafes de especialidad, revisa stock disponible y agrega tus favoritos en CafeHub Premium."
	},
	"/login": {
		title: "Iniciar sesion | CafeHub Premium",
		description: "Accede a tu cuenta de CafeHub Premium para gestionar favoritos, carrito y pedidos."
	},
	"/register": {
		title: "Crear cuenta | CafeHub Premium",
		description: "Registrate en CafeHub Premium para guardar favoritos, reseñas y pedidos de cafe."
	},
	"/dashboard": {
		title: "Tu panel | CafeHub Premium",
		description: "Consulta tus favoritos, carrito, puntos y reseñas desde tu panel de CafeHub Premium."
	},
	"/cobrar": {
		title: "Finalizar compra | CafeHub Premium",
		description: "Revisa el resumen de tu pedido y confirma el cobro en CafeHub Premium."
	},
	"/admin": {
		title: "Administracion | CafeHub Premium",
		description: "Administra usuarios, cafes, reseñas e inventario desde el panel administrativo de CafeHub Premium."
	}
};
var setHeadTag = (selector, value) => {
	if (typeof document === "undefined") return;
	const tag = document.head.querySelector(selector);
	if (tag) tag.setAttribute("content", value);
};
function App() {
	const initialize = useAuthStore((state) => state.initialize);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const initializing = useAuthStore((state) => state.initializing);
	const initTheme = useThemeStore((state) => state.initTheme);
	const location = useLocation();
	useEffect(() => {
		if (hasBootstrappedApp) return;
		hasBootstrappedApp = true;
		initTheme();
		initialize();
	}, [initTheme, initialize]);
	useEffect(() => {
		const meta = ROUTE_META[location.pathname] || ROUTE_META[Object.keys(ROUTE_META).find((path) => path !== "/" && location.pathname.startsWith(path)) || "/"];
		if (typeof document === "undefined" || !meta) return;
		document.title = meta.title;
		setHeadTag("meta[name=\"description\"]", meta.description);
		setHeadTag("meta[property=\"og:title\"]", meta.title);
		setHeadTag("meta[property=\"og:description\"]", meta.description);
		setHeadTag("meta[name=\"twitter:title\"]", meta.title);
		setHeadTag("meta[name=\"twitter:description\"]", meta.description);
	}, [location.pathname]);
	if (initializing) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center",
		children: "Cargando sesión..."
	});
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("div", {
			className: "min-h-screen flex items-center justify-center",
			children: "Cargando..."
		}),
		children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsxs(Route, {
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
		}) })
	});
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
		"module": "/assets/entry.client-BDwBRkaD.js",
		"imports": [
			"/assets/preload-helper-C6xl7tY2.js",
			"/assets/chunk-6CSD65Y2-F3WXWfpM.js",
			"/assets/jsx-runtime-IUG6VCHl.js"
		],
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
			"module": "/assets/root-BSdsNNDH.js",
			"imports": [
				"/assets/preload-helper-C6xl7tY2.js",
				"/assets/chunk-6CSD65Y2-F3WXWfpM.js",
				"/assets/jsx-runtime-IUG6VCHl.js"
			],
			"css": ["/assets/root-f84fDZNJ.css"],
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
			"module": "/assets/catchall-kmOMxSs2.js",
			"imports": [
				"/assets/preload-helper-C6xl7tY2.js",
				"/assets/useAuthStore-D07826xy.js",
				"/assets/createLucideIcon-DYulKnAS.js",
				"/assets/x-D-bU77X2.js",
				"/assets/chunk-6CSD65Y2-F3WXWfpM.js",
				"/assets/jsx-runtime-IUG6VCHl.js",
				"/assets/useCoffeeStore-Ct_q8Vun.js",
				"/assets/useThemeStore-wvVrjub8.js",
				"/assets/formatters-CyBzXBKw.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-997d5f46.js",
	"version": "997d5f46",
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
