import "./useAuthStore-C1pxADfH.js";
import { t as useCoffeeStore } from "./useCoffeeStore-CeDh0gDO.js";
import { t as formatCOP } from "./formatters-DyCPb0-K.js";
import { useNavigate } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
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
								width: "80",
								height: "80",
								loading: "lazy",
								decoding: "async",
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
export { CheckoutPage as default };
