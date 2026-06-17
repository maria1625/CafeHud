import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useCoffeeStore } from "../../store/useCoffeeStore";
import { useAuthStore } from "../../store/useAuthStore";

const ReviewModal = ({ cafe, isOpen, onClose }) => {
  const { addReview } = useCoffeeStore();
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim() || !user) return;

    setSaving(true);
    setError("");
    try {
      await addReview(cafe._id || cafe.id, { rating, comment });
      setComment("");
      setRating(5);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo publicar la reseña.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-brand-beige rounded-[3rem] shadow-2xl overflow-hidden border border-brand-light/20 animate-scale-in">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tighter">Deja tu reseña</h2>
              <p className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest mt-1">
                Compartiendo sobre {cafe.name}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-brand-light/10 rounded-full dark:text-white" aria-label="Cerrar">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center gap-4 bg-brand-bg dark:bg-brand-dark/20 p-6 rounded-3xl border border-brand-light/10">
              <span className="text-[9px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-[0.3em]">Tu calificacion</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90"
                    aria-label={`${star} estrellas`}
                  >
                    <svg
                      className={`w-10 h-10 ${(hoverRating || rating) >= star ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-700"}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="text-xl font-black text-brand-dark dark:text-white">{rating}.0</span>
            </div>

            <div className="space-y-3">
              <label htmlFor="review-comment" className="text-[10px] font-black text-brand-medium dark:text-gray-400 uppercase tracking-widest ml-2">Tu experiencia</label>
              <textarea
                id="review-comment"
                required
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Que te parecio este cafe? Notas de sabor, aroma, cuerpo..."
                className="input-premium h-40 resize-none !p-6"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={saving} className="w-full btn-premium py-6 group">
              <span className="font-black uppercase tracking-[0.2em]">{saving ? "Publicando..." : "Publicar reseña"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
