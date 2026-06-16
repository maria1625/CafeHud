import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Check, Plus } from "lucide-react";
import { useFilterStore } from "../store/useFilterStore";
import { useCoffeeStore } from "../store/useCoffeeStore";
import { useAuthStore } from "../store/useAuthStore";
import FilterBar from "./filters/FilterBar";
import ReviewModal from "./ui/ReviewModal";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorState from "./ui/ErrorState";
import { formatCOP } from '../utils/formatters';

const getCafeId = (cafe) => String(cafe?._id || cafe?.id);

const CoffeeCard = ({ cafe }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { voteCoffee, addToCart, toggleFavorite, favorites } = useCoffeeStore();
  const [voted, setVoted] = useState(false);
  const [added, setAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const cafeId = getCafeId(cafe);
  const isFavorite = favorites.includes(cafeId);
  const stock = Number(cafe.stock);
  const hasStock = Number.isFinite(stock);
  const isOutOfStock = hasStock && stock <= 0;
  const isUnavailable = !cafe.available || isOutOfStock;
  const badgeLabel = isOutOfStock
    ? "Agotado"
    : !cafe.available
      ? "No disponible"
      : hasStock
        ? `Stock: ${stock}`
        : null;
  const cafeImageUrl = cafe.imageUrl || 'https://via.placeholder.com/800x800.png?text=Sin+imagen';
  const isClient = !!user && ["client", "user"].includes(user.role);
  const isBlockedByRole = !!user && !isClient;

  const requireSession = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    if (!isClient) {
      return false;
    }
    return true;
  };

  const handleVote = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!requireSession()) return;

    await voteCoffee(cafeId);
    setVoted(true);
    setTimeout(() => setVoted(false), 2000);
  };

  const handleToggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!requireSession()) return;

    await toggleFavorite(cafeId);
  };

  const handleAddToCart = () => {
    if (isUnavailable) return;
    if (!requireSession()) return;

    addToCart(cafe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="card-premium group flex flex-col h-full hover:shadow-2xl relative">
      {voted && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce shadow-xl border border-black">
          Gracias por tu voto
        </div>
      )}

      <div className="relative h-72 overflow-hidden">
        <img
          src={cafeImageUrl}
          alt={cafe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <button
          onClick={handleToggleFavorite}
          disabled={isBlockedByRole}
          className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-500 z-20 shadow-xl border ${
            isFavorite
              ? "bg-red-500 border-red-400 scale-110"
              : "bg-black/20 border-white/20 hover:bg-black/40 hover:scale-110"
          }`}
          title={isBlockedByRole ? "Disponible solo para clientes" : isFavorite ? "Quitar de favoritos" : "Anadir a favoritos"}
        >
          <svg
            className={`w-6 h-6 transition-colors duration-500 ${isFavorite ? "text-white fill-current" : "text-white"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {badgeLabel && (
          <div className="absolute top-6 left-6 z-20 rounded-full border border-white/20 bg-black/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
            {badgeLabel}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark/40 to-transparent" />
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h3 className="text-2xl font-black text-brand-dark dark:text-white leading-none mb-2">{cafe.name}</h3>
            <p className="text-xs font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.2em]">{cafe.brand}</p>
          </div>
          <span className="text-2xl font-black text-brand-dark dark:text-white tracking-tighter">{formatCOP(cafe.price)}</span>
        </div>

        <p className="text-brand-medium dark:text-gray-300 text-sm mb-8 line-clamp-2 italic font-medium leading-relaxed">
          "{cafe.description}"
        </p>

        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest hover:text-brand-dark dark:hover:text-white transition-colors"
          >
            {showReviews ? "Ocultar reseñas" : `Ver reseñas (${cafe.reviews?.length || 0})`}
          </button>
          <button
            onClick={() => {
              if (!requireSession()) return;
              setIsReviewModalOpen(true);
            }}
            disabled={isBlockedByRole}
            className="text-[10px] font-black text-brand-medium dark:text-white underline uppercase tracking-widest"
            title={isBlockedByRole ? "Disponible solo para clientes" : "Escribir reseña"}
          >
            Escribir reseña
          </button>
        </div>

        {showReviews && (
          <div className="mb-8 space-y-4 max-h-40 overflow-y-auto pr-2 scrollbar-premium">
            {cafe.reviews?.length ? (
              cafe.reviews.map((review) => (
                <div key={review._id || review.id} className="bg-brand-bg dark:bg-brand-dark/20 p-4 rounded-2xl border border-brand-light/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black dark:text-white">{review.userName}</span>
                    <span className="text-yellow-400 text-[10px]">{"★".repeat(review.rating)}</span>
                  </div>
                  <p className="text-xs italic dark:text-gray-300 leading-snug">"{review.comment}"</p>
                </div>
              ))
            ) : (
              <p className="text-[10px] italic text-gray-400">Aun no hay reseñas. Se el primero.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="card-info-box">
            <span className="text-[9px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mb-1">Origen</span>
            <span className="text-xs font-bold text-brand-dark dark:text-white">{cafe.origin}</span>
          </div>
          <div className="card-info-box">
            <span className="text-[9px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mb-1">Tueste</span>
            <span className="text-xs font-bold text-brand-dark dark:text-white">{cafe.roast}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-brand-light/20 pt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVote}
            disabled={voted || isBlockedByRole}
              className={`flex items-center px-3 py-1.5 rounded-lg border shadow-sm transition-all ${
                voted
                  ? "bg-green-500 border-green-600 scale-95"
                  : "bg-yellow-400 dark:bg-yellow-500 border-yellow-500 hover:scale-105 active:scale-95"
              }`}
              title={voted ? "Voto registrado" : "Votar por este cafe"}
            >
              <span className="text-sm">{voted ? "✓" : "★"}</span>
              <span className={`ml-1.5 text-sm font-black ${voted ? "text-white" : "text-brand-dark dark:text-black"}`}>
                {Number(cafe.rating || 0).toFixed(1)}
              </span>
            </button>
            <span className="text-[10px] font-black text-brand-medium dark:text-gray-200 uppercase tracking-widest">
              ({cafe.votes || 0} votos)
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isUnavailable || isBlockedByRole}
            className={`w-12 h-12 !p-0 !rounded-xl shadow-2xl transition-colors duration-200 flex items-center justify-center border border-white/10 ${
              added
                ? "bg-green-500 scale-110 rotate-12"
                : isUnavailable || isBlockedByRole
                  ? "cursor-not-allowed bg-gray-400 dark:bg-gray-700 opacity-60"
                  : "bg-brand-medium dark:bg-white hover:bg-brand-dark dark:hover:bg-gray-200 active:opacity-90"
            }`}
            title={
              isBlockedByRole
                ? "Disponible solo para clientes"
                : isUnavailable
                  ? "Producto no disponible"
                  : "Anadir al carrito"
            }
          >
            {added ? (
              <Check className="w-7 h-7 text-white" strokeWidth={3.25} />
            ) : (
              <Plus className="w-7 h-7 text-white dark:text-black" strokeWidth={3.25} />
            )}
          </button>
        </div>
      </div>

      <ReviewModal
        cafe={cafe}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};

const CoffeeList = () => {
  const { filters } = useFilterStore();
  const { cafes, fetchCafes, favorites, fetchFavorites, loading, error } = useCoffeeStore();
  const { user } = useAuthStore();
  const isClient = !!user && ["client", "user"].includes(user.role);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  useEffect(() => {
    if (isClient) {
      fetchFavorites();
    }
  }, [isClient, fetchFavorites]);

  const filteredAndSortedCafes = useMemo(() => {
    let result = [...cafes];

    if (filters.availability) {
      result = result.filter((cafe) => cafe.available);
    }

    if (filters.onlyFavorites) {
      result = result.filter((cafe) => favorites.includes(getCafeId(cafe)));
    }

    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [cafes, filters, favorites]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="w-full pb-20">
      <FilterBar />

      {filteredAndSortedCafes.length === 0 ? (
        <div className="text-center py-20 bg-brand-beige/20 rounded-[3rem] border-4 border-dashed border-brand-light/30">
          <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-2">No se encontraron cafes</h3>
          <p className="text-brand-medium font-bold uppercase tracking-widest text-xs">Prueba ajustando los filtros de busqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredAndSortedCafes.map((cafe) => (
            <CoffeeCard key={getCafeId(cafe)} cafe={cafe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoffeeList;
