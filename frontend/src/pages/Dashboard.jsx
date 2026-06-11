import { useEffect, useMemo, useState } from "react";
import { reviewApi } from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import { useCoffeeStore } from "../store/useCoffeeStore";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Dashboard = () => {
  const { user, loading, refreshMe } = useAuthStore();
  const {
    cafes,
    cart,
    favorites,
    fetchCafes,
    fetchFavorites,
    clearItemFromCart,
    removeFromCart,
    addToCart,
  } = useCoffeeStore();
  const [reviews, setReviews] = useState([]);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await Promise.all([fetchCafes(), fetchFavorites(), refreshMe()]);
        const myReviews = await reviewApi.getMine();
        setReviews(Array.isArray(myReviews) ? myReviews : []);
      } catch (error) {
        setDashboardError("No se pudo actualizar tu panel en este momento.");
      }
    };

    loadDashboard();
  }, [fetchCafes, fetchFavorites, refreshMe]);

  const favoriteCafes = useMemo(() => {
    const favoriteSet = new Set(favorites.map(String));
    return cafes.filter((cafe) => favoriteSet.has(String(cafe._id || cafe.id)));
  }, [cafes, favorites]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto w-full pt-8 px-4 pb-20">
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-brand-dark text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-black text-brand-dark tracking-tight">
              Hola, {user?.name || "Barista"}
            </h1>
            <p className="text-brand-medium text-lg font-medium">Tu actividad de CafeHub, siempre al dia.</p>
          </div>
        </div>
        {dashboardError && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            {dashboardError}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-10">
        <div className="card-premium p-6">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Favoritos</span>
          <h3 className="text-4xl font-black text-brand-dark mt-3">{favorites.length}</h3>
        </div>
        <div className="card-premium p-6">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Resenas</span>
          <h3 className="text-4xl font-black text-brand-dark mt-3">{reviews.length}</h3>
        </div>
        <div className="card-premium p-6">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Puntos</span>
          <h3 className="text-4xl font-black text-brand-dark mt-3">{user?.points || 0}</h3>
        </div>
        <div className="card-premium p-6">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Carrito</span>
          <h3 className="text-4xl font-black text-brand-dark mt-3">{cart.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="card-premium p-8">
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-wide mb-6">Tus favoritos</h2>
          {favoriteCafes.length === 0 ? (
            <p className="text-brand-medium font-bold">Todavia no has guardado cafes favoritos.</p>
          ) : (
            <div className="space-y-4">
              {favoriteCafes.map((cafe) => (
                <div key={cafe._id || cafe.id} className="flex items-center gap-4 rounded-2xl border border-brand-light p-4">
                  <img src={cafe.imageUrl} alt={cafe.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-black text-brand-dark">{cafe.name}</h3>
                    <p className="text-xs font-bold text-brand-medium">{cafe.brand}</p>
                  </div>
                  <span className="font-black text-brand-dark">${cafe.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card-premium p-8">
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-wide mb-6">Tu carrito</h2>
          {cart.length === 0 ? (
            <p className="text-brand-medium font-bold">Tu carrito esta vacio.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-brand-light p-4">
                  <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-black text-brand-dark">{item.name}</h3>
                    <p className="text-xs font-bold text-brand-medium">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-brand-light px-3 py-1 font-black" onClick={() => removeFromCart(item.id)}>-</button>
                    <button className="rounded-lg border border-brand-light px-3 py-1 font-black" onClick={() => addToCart(item)}>+</button>
                    <button className="rounded-lg bg-red-600 px-3 py-1 font-black text-white" onClick={() => clearItemFromCart(item.id)}>Quitar</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t border-brand-light pt-5 text-lg font-black text-brand-dark">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </section>

        <section className="card-premium p-8 lg:col-span-2">
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-wide mb-6">Tus resenas</h2>
          {reviews.length === 0 ? (
            <p className="text-brand-medium font-bold">Cuando publiques una resena, aparecera aqui.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((review) => (
                <article key={review._id} className="rounded-2xl border border-brand-light p-5">
                  <div className="flex items-center gap-4 mb-4">
                    {review.cafe?.imageUrl && (
                      <img src={review.cafe.imageUrl} alt={review.cafe.name} className="h-14 w-14 rounded-xl object-cover" />
                    )}
                    <div>
                      <h3 className="font-black text-brand-dark">{review.cafe?.name || "Cafe eliminado"}</h3>
                      <p className="text-xs font-bold text-brand-medium">{review.rating}/5 estrellas</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-brand-medium">"{review.comment}"</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
