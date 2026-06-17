import { t as useAuthStore } from "./useAuthStore-C1pxADfH.js";
import { Link, useNavigate } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
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
			noValidate: true,
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "register-name",
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Nombre completo"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "register-name",
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
							htmlFor: "register-email",
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Correo electronico"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "register-email",
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
							htmlFor: "register-password",
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Contrasena"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "register-password",
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
							htmlFor: "register-confirm-password",
							className: "block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1",
							children: "Confirmar contrasena"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "register-confirm-password",
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
export { RegisterPage as default };
