import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Moon, ShoppingBag, Sun } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { useCoffeeStore } from "../../store/useCoffeeStore";
import CartSidebar from "./CartSidebar";

const Navbar = () => {
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
    if (!canUseClientFeatures) {
      return;
    }
    setIsCartOpen(true);
  };

  return (
    <nav className="nav-premium">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity group">
        <div className="w-12 h-12 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
          <svg 
            className="w-8 h-8 text-brand-beige dark:text-[#8B5E3C]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">CaféHub</span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6 sm:gap-12">
        <div className="flex items-center gap-6 sm:gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300">Iniciar sesión</Link>
              <Link 
                to="/register" 
                className="px-6 py-3 bg-brand-medium dark:bg-white dark:text-black hover:bg-brand-medium/80 rounded-xl transition-all border border-white/10 shadow-lg"
              >
                Registro
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300">Panel</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300">Administración</Link>
              )}
              <span className="hidden sm:inline text-white opacity-90">Hola, {user?.name || 'Barista'}</span>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[9px] transition-colors font-black dark:text-white"
              >
                Cerrar sesión
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors active:opacity-90"
            aria-label="Cambiar tema"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" strokeWidth={2.5} />
            ) : (
              <Moon className="w-5 h-5 text-brand-beige" strokeWidth={2.5} />
            )}
          </button>

          {/* Cart Toggle */}
          <button 
            onClick={handleCartOpen}
            disabled={isAuthenticated && !canUseClientFeatures}
            className="relative p-2.5 bg-brand-medium dark:bg-white/10 hover:bg-brand-dark dark:hover:bg-white/20 rounded-xl border border-white/10 transition-colors active:opacity-90 group shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Abrir carrito"
            title={isAuthenticated && !canUseClientFeatures ? "Disponible solo para clientes" : "Abrir carrito"}
          >
            <ShoppingBag className="w-5 h-5 text-white" strokeWidth={2.75} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border border-black dark:border-white animate-bounce-slow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
