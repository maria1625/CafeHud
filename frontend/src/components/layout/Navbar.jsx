import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const handleCartOpen = () => {
    if (!isAuthenticated) {
      navigate("/login");
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
            className="w-8 h-8 text-brand-beige dark:text-white" 
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
              <Link to="/login" className="hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300">Login</Link>
              <Link 
                to="/register" 
                className="px-6 py-3 bg-brand-medium dark:bg-white dark:text-black hover:bg-brand-medium/80 rounded-xl transition-all border border-white/10 shadow-lg"
              >
                Registro
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300">Dashboard</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-brand-beige dark:hover:text-white transition-colors dark:text-gray-300">Admin</Link>
              )}
              <span className="hidden sm:inline text-brand-beige dark:text-white">Hola, {user?.name || 'Barista'}</span>
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
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-brand-beige" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Cart Toggle */}
          <button 
            onClick={handleCartOpen}
            className="relative p-2.5 bg-brand-medium dark:bg-white/10 hover:bg-brand-dark dark:hover:bg-white/20 rounded-xl border border-white/10 transition-all active:scale-95 group shadow-lg"
            aria-label="Abrir carrito"
          >
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
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
