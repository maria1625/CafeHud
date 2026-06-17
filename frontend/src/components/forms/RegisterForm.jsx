import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

const RegisterForm = () => {
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

  return (
    <div className="card-premium w-full max-w-[500px] p-10 sm:p-14 my-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-brand-dark mb-2 tracking-tighter">
          Crear cuenta
        </h2>
        <p className="text-brand-medium font-bold text-sm uppercase tracking-widest opacity-70">
          Unete a la comunidad de CafeHub
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1">
            Nombre completo
          </label>
          <input
            placeholder="Juan Perez"
            {...register("name", { required: "El nombre es obligatorio" })}
            className={`input-premium ${errors.name ? "border-red-300 ring-4 ring-red-50" : ""}`}
          />
          {errors.name && <p className="text-[11px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1">
            Correo electronico
          </label>
          <input
            placeholder="tu@email.com"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electronico invalido"
              }
            })}
            className={`input-premium ${errors.email ? "border-red-300 ring-4 ring-red-50" : ""}`}
          />
          {errors.email && <p className="text-[11px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1">
            Contrasena
          </label>
          <input
            type="password"
            placeholder="********"
            {...register("password", {
              required: "La contrasena es obligatoria",
              minLength: { value: 6, message: "Minimo 6 caracteres" }
            })}
            className={`input-premium ${errors.password ? "border-red-300 ring-4 ring-red-50" : ""}`}
          />
          {errors.password && <p className="text-[11px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-brand-dark uppercase tracking-[0.3em] ml-1">
            Confirmar contrasena
          </label>
          <input
            type="password"
            placeholder="********"
            {...register("confirmPassword", {
              required: "Confirma tu contrasena",
              validate: (value) => value === getValues("password") || "Las contrasenas no coinciden",
            })}
            className={`input-premium ${errors.confirmPassword ? "border-red-300 ring-4 ring-red-50" : ""}`}
          />
          {errors.confirmPassword && <p className="text-[11px] text-red-500 font-black uppercase tracking-wider ml-1">{errors.confirmPassword.message}</p>}
        </div>

        {authError && (
          <div className="p-5 bg-red-50 text-red-700 rounded-2xl border-2 border-red-100 text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
            <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            {authError}
          </div>
        )}

        <div className="pt-6">
          <button type="submit" disabled={loading} className="btn-premium w-full shadow-2xl py-5 text-sm uppercase tracking-[0.2em]">
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Crear cuenta"}
          </button>
        </div>

        <p className="text-center text-brand-medium mt-10 font-bold text-xs uppercase tracking-widest">
          Ya tienes cuenta? <Link to="/login" className="text-brand-dark font-black hover:underline underline-offset-8 decoration-2">Inicia sesion</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
