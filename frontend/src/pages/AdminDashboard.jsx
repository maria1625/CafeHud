import { Children, useEffect, useMemo, useState } from "react";
import { adminApi } from "../api/api";
import { useAuthStore } from "../store/useAuthStore";
import { formatCOP } from "../utils/formatters";

const emptyCafe = {
  name: "",
  brand: "",
  description: "",
  origin: "",
  roast: "Medio",
  price: "0",
  stock: "0",
  minimumStock: "0",
  available: true,
  imageUrl: ""
};

const AdminDashboard = () => {
  const { isAdmin } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("cafes");
  const [adminError, setAdminError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newCafe, setNewCafe] = useState(emptyCafe);
  const [editingCafeId, setEditingCafeId] = useState(null);
  const [editingCafeData, setEditingCafeData] = useState(emptyCafe);

  const stats = useMemo(() => ({
    users: users.length,
    cafes: cafes.length,
    reviews: reviews.length,
    lowStock: cafes.filter((cafe) => Number(cafe.stock || 0) <= Number(cafe.minimumStock || 0)).length,
    averageRating: reviews.length
      ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1)
      : "0.0"
  }), [users, cafes, reviews]);

  const loadAdminData = async () => {
    setLoading(true);
    setAdminError("");
    try {
      const [usersRes, cafesRes, reviewsRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getCafes(),
        adminApi.getReviews()
      ]);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setCafes(Array.isArray(cafesRes) ? cafesRes : []);
      setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);
    } catch (error) {
      setAdminError(error.response?.data?.message || "No se pudo cargar el panel de administracion.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      loadAdminData();
    }
  }, [isAdmin]);

  const buildCafePayload = (cafe) => ({
    ...cafe,
    price: Number(cafe.price),
    stock: Number(cafe.stock),
    minimumStock: Number(cafe.minimumStock),
    available: Boolean(cafe.available),
    imageUrl: cafe.imageUrl || undefined
  });

  const inventoryStatus = (stock, minimumStock) => {
    if (stock <= 0) {
      return { label: "Agotado", className: "bg-red-50 text-red-700 border-red-200" };
    }
    if (stock <= minimumStock) {
      return { label: "Bajo", className: "bg-amber-50 text-amber-800 border-amber-200" };
    }
    return { label: "OK", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  };

  const goToEditCafe = (cafe) => {
    handleEditCafe(cafe);
    setActiveTab("cafes");
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedUser = await adminApi.updateUserRole(userId, newRole);
      setUsers((current) => current.map((user) => user._id === userId ? updatedUser : user));
    } catch (error) {
      setAdminError(error.response?.data?.message || "No se pudo actualizar el rol.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Seguro que deseas eliminar este usuario?")) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers((current) => current.filter((user) => user._id !== userId));
    } catch (error) {
      setAdminError(error.response?.data?.message || "No se pudo eliminar el usuario.");
    }
  };

  const handleCreateCafe = async (event) => {
    event.preventDefault();
    setAdminError("");
    try {
      await adminApi.createCafe(buildCafePayload(newCafe));
      setNewCafe(emptyCafe);
      await loadAdminData();
      setActiveTab("inventory");
    } catch (error) {
      setAdminError(
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "No se pudo crear el cafe."
      );
    }
  };

  const handleEditCafe = (cafe) => {
    setEditingCafeId(cafe._id);
    setEditingCafeData({
      name: cafe.name || "",
      brand: cafe.brand || "",
      description: cafe.description || "",
      origin: cafe.origin || "",
      roast: cafe.roast || "Medio",
      price: String(cafe.price ?? 0),
      stock: String(cafe.stock ?? 0),
      minimumStock: String(cafe.minimumStock ?? 0),
      available: cafe.available ?? true,
      imageUrl: cafe.imageUrl || ""
    });
    setAdminError("");
  };

  const handleSaveCafe = async (cafeId) => {
    setAdminError("");
    try {
      await adminApi.updateCafe(cafeId, buildCafePayload(editingCafeData));
      await loadAdminData();
      setEditingCafeId(null);
      setEditingCafeData(emptyCafe);
      setActiveTab("inventory");
    } catch (error) {
      setAdminError(
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "No se pudo actualizar el cafe."
      );
    }
  };

  const handleDeleteCafe = async (cafeId) => {
    if (!confirm("Seguro que deseas eliminar este cafe?")) return;
    try {
      await adminApi.deleteCafe(cafeId);
      setCafes((current) => current.filter((cafe) => cafe._id !== cafeId));
      setReviews((current) => current.filter((review) => review.cafe?._id !== cafeId));
    } catch (error) {
      setAdminError(error.response?.data?.message || "No se pudo eliminar el cafe.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Seguro que deseas eliminar esta reseña?")) return;
    try {
      await adminApi.deleteReview(reviewId);
      setReviews((current) => current.filter((review) => review._id !== reviewId));
    } catch (error) {
      setAdminError(error.response?.data?.message || "No se pudo eliminar la reseña.");
    }
  };

  const updateCafeForm = (setter) => (field, value) => {
    setter((current) => ({ ...current, [field]: value }));
  };

  if (!isAdmin()) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="card-premium p-8">
          <h1 className="text-2xl font-black text-brand-dark">Acceso restringido</h1>
          <p className="text-brand-medium font-bold mt-2">No tienes permisos para acceder a esta pagina.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-brand-dark tracking-tight">Panel de administracion</h1>
        <p className="text-brand-medium font-bold mt-2">Gestiona usuarios, cafes y reseñas conectadas a la base de datos.</p>
      </header>

      {adminError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {adminError}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        <div className="card-premium p-5">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Usuarios</span>
          <strong className="block text-3xl font-black text-brand-dark mt-2">{stats.users}</strong>
        </div>
        <div className="card-premium p-5">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Cafes</span>
          <strong className="block text-3xl font-black text-brand-dark mt-2">{stats.cafes}</strong>
        </div>
        <div className="card-premium p-5">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Reseñas</span>
          <strong className="block text-3xl font-black text-brand-dark mt-2">{stats.reviews}</strong>
        </div>
        <div className="card-premium p-5">
          <span className="text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]">Rating medio</span>
          <strong className="block text-3xl font-black text-brand-dark mt-2">{stats.averageRating}</strong>
        </div>
      </section>

      <div className="mb-8 flex flex-wrap gap-3">
        {[
          ["cafes", `Cafes (${cafes.length})`],
          ["inventory", `Inventario (${stats.lowStock} bajos)`],
          ["reviews", `Reseñas (${reviews.length})`],
          ["users", `Usuarios (${users.length})`],
        ].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? "bg-brand-dark dark:bg-white text-white dark:text-black shadow-lg" : "bg-brand-beige text-brand-dark border border-brand-light"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card-premium p-10 text-center font-black text-brand-medium">Cargando panel...</div>
      ) : (
        <>
          {activeTab === "cafes" && (
            <section className="space-y-8">
              <CafeForm
                title="Crear nuevo cafe"
                cafe={newCafe}
                onChange={updateCafeForm(setNewCafe)}
                onSubmit={handleCreateCafe}
                submitLabel="Agregar cafe"
              />

              {editingCafeId && (
                <CafeForm
                  title="Editar cafe"
                  cafe={editingCafeData}
                  onChange={updateCafeForm(setEditingCafeData)}
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSaveCafe(editingCafeId);
                  }}
                  submitLabel="Guardar cambios"
                  secondaryAction={() => {
                    setEditingCafeId(null);
                    setEditingCafeData(emptyCafe);
                  }}
                />
              )}
            </section>
          )}

          {activeTab === "inventory" && (
            <section className="space-y-6">
              <div className="card-premium p-6">
                <h2 className="text-2xl font-black text-brand-dark">Inventario</h2>
                <p className="text-brand-medium font-bold mt-2">Consulta el stock por producto y abre la edicion cuando un cafe tenga stock bajo.</p>
              </div>

              {cafes.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...cafes]
                    .sort((a, b) => {
                      const aLow = Number(a.stock ?? 0) <= Number(a.minimumStock ?? 0) ? 1 : 0;
                      const bLow = Number(b.stock ?? 0) <= Number(b.minimumStock ?? 0) ? 1 : 0;
                      return bLow - aLow;
                    })
                    .map((cafe) => {
                      const stock = Number(cafe.stock ?? 0);
                      const minimumStock = Number(cafe.minimumStock ?? 0);
                      const status = inventoryStatus(stock, minimumStock);
                      const isLowStock = stock <= minimumStock;

                      return (
                        <article key={cafe._id} className="card-premium overflow-hidden">
                          <img
                            src={cafe.imageUrl}
                            alt={cafe.name}
                            width="640"
                            height="416"
                            loading="lazy"
                            decoding="async"
                            className="h-52 w-full object-cover"
                          />
                          <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-xl font-black text-brand-dark leading-tight">{cafe.name}</h3>
                                <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-brand-medium">{cafe.brand}</p>
                              </div>
                              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${status.className}`}>
                                {status.label}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-2xl border border-brand-light bg-brand-bg px-4 py-4">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">Stock</span>
                                <strong className="mt-2 block text-2xl font-black text-brand-dark">{stock}</strong>
                              </div>
                              <div className="rounded-2xl border border-brand-light bg-brand-bg px-4 py-4">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">Stock mínimo</span>
                                <strong className="mt-2 block text-2xl font-black text-brand-dark">{minimumStock}</strong>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-2xl border border-brand-light bg-brand-bg px-4 py-4">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">Origen</span>
                                <strong className="mt-2 block text-base font-black text-brand-dark">{cafe.origin}</strong>
                              </div>
                              <div className="rounded-2xl border border-brand-light bg-brand-bg px-4 py-4">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">Precio</span>
                                <strong className="mt-2 block text-base font-black text-brand-dark">{formatCOP(cafe.price)}</strong>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => goToEditCafe(cafe)} className="btn-table-primary flex-1">
                                {isLowStock ? "Stock bajo: editar" : "Editar"}
                              </button>
                              <button onClick={() => handleDeleteCafe(cafe._id)} className="btn-table-danger flex-1">
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                </div>
              ) : (
                <div className="card-premium px-6 py-10 text-center font-bold text-brand-medium">
                  No hay cafes registrados.
                </div>
              )}
            </section>
          )}

          {activeTab === "reviews" && (
            <DataTable
              headers={["Usuario", "Cafe", "Calificacion", "Comentario", "Acciones"]}
              emptyMessage="No hay reseñas registradas."
            >
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="table-cell-admin">{review.user?.name || "Sin usuario"}</td>
                  <td className="table-cell-admin">{review.cafe?.name || "Cafe eliminado"}</td>
                  <td className="table-cell-admin">{review.rating}/5</td>
                  <td className="table-cell-admin max-w-md">{review.comment}</td>
                  <td className="table-cell-admin">
                    <button onClick={() => handleDeleteReview(review._id)} className="btn-table-danger">Eliminar</button>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}

          {activeTab === "users" && (
            <DataTable
              headers={["Nombre", "Email", "Rol", "Puntos", "Acciones"]}
              emptyMessage="No hay usuarios registrados."
            >
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="table-cell-admin font-black">{user.name}</td>
                  <td className="table-cell-admin">{user.email}</td>
                  <td className="table-cell-admin">
                    <select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user._id, event.target.value)}
                      aria-label={`Cambiar rol de ${user.name}`}
                      className="rounded-lg border border-brand-light bg-brand-beige px-3 py-2 text-sm font-bold text-brand-dark dark:text-white"
                    >
                      <option value="client">Cliente</option>
                      <option value="user">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td className="table-cell-admin">{user.points || 0}</td>
                  <td className="table-cell-admin">
                    <button onClick={() => handleDeleteUser(user._id)} className="btn-table-danger">Eliminar</button>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </>
      )}
    </div>
  );
};

const CafeForm = ({ title, cafe, onChange, onSubmit, submitLabel, secondaryAction }) => (
  <section className="card-premium p-6 sm:p-8">
    <h2 className="text-2xl font-black text-brand-dark mb-6">{title}</h2>
    <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="lg:col-span-2 rounded-3xl border border-brand-light bg-brand-bg p-4">
        {cafe.imageUrl ? (
          <img
            src={cafe.imageUrl}
            alt={cafe.name || "Vista previa del cafe"}
            width="896"
            height="448"
            loading="lazy"
            decoding="async"
            className="h-56 w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-dashed border-brand-light text-sm font-bold text-brand-medium">
            La imagen aparecera aqui
          </div>
        )}
      </div>
      <input aria-label="Nombre del cafe" value={cafe.name} onChange={(event) => onChange("name", event.target.value)} placeholder="Nombre" className="input-premium" required />
      <input aria-label="Marca del cafe" value={cafe.brand} onChange={(event) => onChange("brand", event.target.value)} placeholder="Marca" className="input-premium" required />
      <input aria-label="Origen del cafe" value={cafe.origin} onChange={(event) => onChange("origin", event.target.value)} placeholder="Origen" className="input-premium" required />
      <select aria-label="Nivel de tueste" value={cafe.roast} onChange={(event) => onChange("roast", event.target.value)} className="input-premium">
        <option value="Claro">Claro</option>
        <option value="Medio">Medio</option>
        <option value="Oscuro">Oscuro</option>
      </select>
      <input aria-label="Precio del cafe" type="number" value={cafe.price} onChange={(event) => onChange("price", event.target.value)} placeholder="Precio" className="input-premium" min="0" step="0.01" required />
      <input aria-label="Stock disponible" type="number" value={cafe.stock} onChange={(event) => onChange("stock", event.target.value)} placeholder="Stock" className="input-premium" min="0" step="1" required />
      <input aria-label="Stock mínimo" type="number" value={cafe.minimumStock} onChange={(event) => onChange("minimumStock", event.target.value)} placeholder="Stock mínimo" className="input-premium" min="0" step="1" required />
      <input aria-label="URL de imagen" value={cafe.imageUrl} onChange={(event) => onChange("imageUrl", event.target.value)} placeholder="URL de imagen o deja vacío para subir archivo" className="input-premium" />
      <label className="flex flex-col gap-2 rounded-2xl border border-brand-light bg-brand-bg px-5 py-4 text-sm font-black text-brand-dark">
        <span className="uppercase tracking-[0.2em] text-[10px] font-black text-brand-medium">Imagen desde tu equipo</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onChange("imageUrl", reader.result || "");
            reader.readAsDataURL(file);
          }}
          className="input-premium"
        />
      </label>
      <div className="rounded-2xl border border-brand-light bg-brand-bg px-5 py-4 text-sm font-black text-brand-dark">
        Disponible para clientes segun el stock registrado
      </div>
      <textarea aria-label="Descripcion del cafe" value={cafe.description} onChange={(event) => onChange("description", event.target.value)} placeholder="Descripcion" rows="3" className="input-premium lg:col-span-2" required />
      <div className="lg:col-span-2 flex flex-wrap gap-3">
        <button type="submit" className="btn-premium">{submitLabel}</button>
        {secondaryAction && (
          <button type="button" onClick={secondaryAction} className="rounded-2xl border border-brand-light px-6 py-4 text-xs font-black uppercase tracking-widest text-brand-dark">
            Cancelar
          </button>
        )}
      </div>
    </form>
  </section>
);

const DataTable = ({ headers, children, emptyMessage }) => {
  const rowCount = Children.count(children);

  return (
    <div className="card-premium overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="bg-brand-bg">
            {headers.map((header) => (
              <th key={header} className="border-b border-brand-light px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowCount ? children : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-10 text-center font-bold text-brand-medium">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
