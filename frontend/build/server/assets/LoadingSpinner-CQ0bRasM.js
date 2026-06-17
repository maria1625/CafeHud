import { jsx, jsxs } from "react/jsx-runtime";
import { Coffee } from "lucide-react";
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
export { LoadingSpinner as t };
