import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { Coffee } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const schema = z.object({
  email: z.string().email("Correo invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

const LoginForm = () => {
  const { login, loading, error: authError } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card-premium w-full max-w-[460px] p-10 sm:p-14">
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 bg-brand-dark dark:bg-[#F1E7E2] rounded-full flex items-center justify-center shadow-2xl mb-8 border-8 border-brand-bg">
          <Coffee className="w-12 h-12 text-white dark:text-[#6F4A2D]" strokeWidth={2.75} />
        </div>
        <h2 className="text-4xl font-black text-brand-dark mb-2 tracking-tighter">
          Iniciar sesion
        </h2>
        <p className="text-brand-medium font-bold text-sm uppercase tracking-widest opacity-70">
          Accede a tu cuenta de CafeHub
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="login-email" className="block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1">
            Correo electronico
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="tu@email.com"
            {...register("email")}
            className={`input-premium ${errors.email ? "border-red-300 focus:ring-red-100" : ""}`}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500 font-bold italic">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label htmlFor="login-password" className="block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1">
            Contrasena
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="********"
            {...register("password")}
            className={`input-premium ${errors.password ? "border-red-300 ring-4 ring-red-50" : ""}`}
          />
          {errors.password && (
            <p className="text-[11px] text-red-500 font-black uppercase tracking-wider ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {authError && (
          <div className="p-5 bg-red-50 text-red-700 rounded-2xl border-2 border-red-100 text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            {authError}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-premium w-full mt-4">
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Ingresar"
          )}
        </button>

        <p className="text-center text-brand-medium mt-8 font-medium">
          No tienes cuenta? <Link to="/register" className="text-brand-dark font-black hover:underline underline-offset-4">Registrate aqui</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
