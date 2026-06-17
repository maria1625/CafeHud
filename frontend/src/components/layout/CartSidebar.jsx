import { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X, ZoomIn } from "lucide-react";
import { useCoffeeStore } from "../../store/useCoffeeStore";
import { formatCOP } from "../../utils/formatters";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, clearItemFromCart } = useCoffeeStore();
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate("/cobrar");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          ></Motion.div>

          <Motion.div
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-brand-beige shadow-2xl flex flex-col border-l border-brand-light/20"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="p-8 border-b border-brand-light/10 flex justify-between items-center bg-brand-bg dark:bg-brand-dark/20">
              <div>
                <h2 className="text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tighter">Tu carrito</h2>
                <p className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mt-1">
                  {cart.length} artículos seleccionados
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-3 hover:bg-brand-light/10 rounded-full transition-colors dark:text-white"
                aria-label="Cerrar carrito"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-brand-light/10 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-brand-medium opacity-40" strokeWidth={2.5} />
                  </div>
                  <p className="text-brand-medium font-bold uppercase tracking-widest text-xs">Tu carrito está vacío</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 text-brand-medium dark:text-white underline font-black text-[10px] uppercase tracking-widest"
                  >
                    Explorar catálogo
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <button
                      type="button"
                      className="relative w-28 h-28 rounded-3xl overflow-hidden bg-brand-light/10 flex-shrink-0 border-2 border-brand-light/20 group-hover:border-brand-medium transition-all duration-500 cursor-pointer shadow-lg"
                      onClick={() => setPreviewImage(item.imageUrl)}
                      aria-label={`Ampliar imagen de ${item.name}`}
                      title="Ampliar imagen"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        width="112"
                        height="112"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>

                    <div className="flex-1 py-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-brand-dark dark:text-white text-base uppercase leading-tight tracking-tight">{item.name}</h4>
                        <span className="font-black text-brand-dark dark:text-white text-base tracking-tighter">
                          {formatCOP(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-[10px] text-brand-medium dark:text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 mb-4">
                        {item.brand}
                      </p>
                      {!item.available && (
                        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                          No disponible
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-brand-light/10 dark:bg-white/10 rounded-xl border border-brand-light/20 p-1.5">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-brand-medium/20 rounded-lg text-brand-dark dark:text-white transition-colors font-black"
                            aria-label="Quitar una unidad"
                          >
                            <Minus className="w-5 h-5" strokeWidth={3} />
                          </button>
                          <span className="px-4 text-sm font-black text-brand-dark dark:text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                            className="w-9 h-9 flex items-center justify-center hover:bg-brand-medium/20 rounded-lg text-brand-dark dark:text-white transition-colors font-black disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Agregar una unidad"
                          >
                            <Plus className="w-5 h-5" strokeWidth={3} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => clearItemFromCart(item.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          aria-label={`Eliminar ${item.name} del carrito`}
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-brand-light/20 bg-brand-bg dark:bg-brand-dark/20">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.3em]">Total estimado</span>
                  <span className="text-3xl font-black text-brand-dark dark:text-white tracking-tighter">{formatCOP(total)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full btn-premium py-6 flex items-center justify-center gap-3 group"
                >
                  <span className="font-black uppercase tracking-[0.2em] text-sm">Finalizar pedido</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </Motion.div>

          <AnimatePresence>
            {previewImage && (
              <Motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
                onClick={() => setPreviewImage(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Motion.div
                  className="relative max-w-4xl w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10"
                  onClick={(event) => event.stopPropagation()}
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.2 }}
                >
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    width="1024"
                    height="1024"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-8 right-8 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    onClick={() => setPreviewImage(null)}
                    aria-label="Cerrar vista previa"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </Motion.div>
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
