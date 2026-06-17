import { t as useAuthStore } from "./useAuthStore-C1pxADfH.js";
import { Link, useNavigate } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Coffee } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
			noValidate: true,
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "login-email",
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Correo electronico"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "login-email",
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
							htmlFor: "login-password",
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Contrasena"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "login-password",
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
export { LoginPage as default };
