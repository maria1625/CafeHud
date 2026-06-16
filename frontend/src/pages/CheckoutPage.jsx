import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useCoffeeStore } from "../store/useCoffeeStore";
import { formatCOP } from "../utils/formatters";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCoffeeStore();

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );
  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const handleConfirmPayment = () => {
    clearCart();
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-5xl mx-auto pt-10 pb-20">
      <header className="mb-10">
        <span className="inline-flex rounded-full bg-brand-beige px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark">
          Cobrar
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-brand-dark dark:text-white">
          Finalizar compra
        </h1>
        <p className="mt-3 text-brand-medium dark:text-gray-300">
          Revisa tu pedido antes de continuar con el cobro.
        </p>
      </header>

      {cart.length === 0 ? (
        <section className="card-premium p-10 text-center">
          <h2 className="text-2xl font-black text-brand-dark dark:text-white">
            No hay productos en el carrito
          </h2>
          <p className="mt-3 text-brand-medium dark:text-gray-300">
            Agrega cafes al carrito para poder pasar a cobrar.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 btn-premium px-8 py-4"
          >
            Ir al catalogo
          </button>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section className="card-premium p-8">
            <h2 className="mb-6 text-2xl font-black uppercase tracking-wide text-brand-dark dark:text-white">
              Resumen del pedido
            </h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-brand-light/20 p-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-black text-brand-dark dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-medium dark:text-gray-400">
                      {item.brand}
                    </p>
                    <p className="mt-2 text-sm font-bold text-brand-medium dark:text-gray-300">
                      {formatCOP(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <strong className="text-lg font-black text-brand-dark dark:text-white">
                    {formatCOP(item.price * item.quantity)}
                  </strong>
                </article>
              ))}
            </div>
          </section>

          <aside className="card-premium h-fit p-8">
            <h2 className="text-2xl font-black uppercase tracking-wide text-brand-dark dark:text-white">
              Total a cobrar
            </h2>
            <div className="mt-8 space-y-4 border-y border-brand-light/20 py-6">
              <div className="flex items-center justify-between text-sm font-bold text-brand-medium dark:text-gray-300">
                <span>Productos</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-brand-medium dark:text-gray-300">
                <span>Subtotal</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-medium dark:text-gray-400">
                Total final
              </span>
              <span className="text-3xl font-black tracking-tight text-brand-dark dark:text-white">
                {formatCOP(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleConfirmPayment}
              className="mt-8 w-full btn-premium py-5"
            >
              Confirmar cobro
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 w-full rounded-2xl border border-brand-light/20 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-brand-dark transition-colors hover:bg-brand-light/10 dark:text-white"
            >
              Volver
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
