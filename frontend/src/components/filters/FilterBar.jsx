import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useFilterStore } from "../../store/useFilterStore";

const FilterBar = () => {
  const { filters, setFilters, clearFilters } = useFilterStore();
  const user = useAuthStore((state) => state.user);
  const canUseFavorites = !!user && ["client", "user"].includes(user.role);

  useEffect(() => {
    if (!canUseFavorites && filters.onlyFavorites) {
      setFilters({ ...filters, onlyFavorites: false });
    }
  }, [canUseFavorites, filters, setFilters]);

  return (
    <div className="card-premium p-6 mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 sticky top-4 z-10 shadow-lg dark:bg-[#1A1A1A]/80 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-4 text-brand-dark dark:text-white font-black cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              checked={filters.availability || false}
              onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
              aria-label="Mostrar solo cafes disponibles"
              className="peer appearance-none w-7 h-7 rounded-xl border-2 border-brand-medium/40 dark:border-white/20 bg-white/70 dark:bg-white/10 checked:bg-brand-medium dark:checked:bg-white checked:border-brand-medium dark:checked:border-white transition-colors cursor-pointer shadow-sm"
            />
            <svg 
              className="absolute top-1.5 left-1.5 w-4 h-4 text-brand-dark opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none peer-checked:text-white dark:peer-checked:text-black" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="group-hover:text-brand-medium dark:group-hover:text-gray-300 transition-colors uppercase tracking-widest text-xs">Solo disponibles</span>
        </label>

        <label className={`flex items-center gap-4 text-brand-dark dark:text-white font-black group ${canUseFavorites ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}>
          <div className="relative">
            <input 
              type="checkbox" 
              checked={filters.onlyFavorites || false}
              onChange={(e) => setFilters({ ...filters, onlyFavorites: e.target.checked })}
              disabled={!canUseFavorites}
              aria-label="Mostrar solo mis favoritos"
              className="peer appearance-none w-7 h-7 rounded-xl border-2 border-brand-medium/40 dark:border-white/20 bg-white/70 dark:bg-white/10 checked:bg-red-500 dark:checked:bg-red-500 checked:border-red-500 transition-colors shadow-sm disabled:cursor-not-allowed"
            />
            <svg 
              className="absolute top-1.5 left-1.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.749 0 3.3.834 4.312 2.134C13.012 3.834 14.562 3 16.312 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
            </svg>
          </div>
          <span className={`transition-colors uppercase tracking-widest text-xs ${canUseFavorites ? "group-hover:text-brand-medium dark:group-hover:text-gray-300" : ""}`}>
            Mis favoritos
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
        <div className="flex items-center gap-4 flex-1 lg:flex-none">
          <span className="text-brand-medium dark:text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">Ordenar por</span>
          <select 
            value={filters.sortBy || "name"}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            aria-label="Ordenar cafes"
            className="flex-1 lg:flex-none p-3 bg-brand-beige/20 dark:bg-black/40 border-2 border-brand-beige dark:border-white/10 rounded-xl text-brand-dark dark:text-white font-bold focus:ring-4 focus:ring-brand-dark/5 focus:border-brand-dark focus:outline-none cursor-pointer hover:bg-brand-beige/40 transition-all text-sm min-w-[180px]"
          >
            <option value="name">Alfabeto (A-Z)</option>
            <option value="price-asc">Precio: Más bajo</option>
            <option value="price-desc">Precio: Más alto</option>
            <option value="rating">Mejor valoración</option>
          </select>
        </div>
        
        {(filters.availability || filters.onlyFavorites || filters.sortBy !== "name") && (
          <button 
            onClick={clearFilters}
            aria-label="Limpiar filtros"
            className="flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
