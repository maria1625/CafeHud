import { n as adminApi, t as useAuthStore } from "./useAuthStore-C1pxADfH.js";
import { t as formatCOP } from "./formatters-DyCPb0-K.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Children, useEffect, useMemo, useState } from "react";
//#region src/pages/AdminDashboard.jsx
var emptyCafe = {
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
var AdminDashboard = () => {
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
		averageRating: reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1) : "0.0"
	}), [
		users,
		cafes,
		reviews
	]);
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
		if (isAdmin()) loadAdminData();
	}, [isAdmin]);
	const buildCafePayload = (cafe) => ({
		...cafe,
		price: Number(cafe.price),
		stock: Number(cafe.stock),
		minimumStock: Number(cafe.minimumStock),
		available: Boolean(cafe.available),
		imageUrl: cafe.imageUrl || void 0
	});
	const inventoryStatus = (stock, minimumStock) => {
		if (stock <= 0) return {
			label: "Agotado",
			className: "bg-red-50 text-red-700 border-red-200"
		};
		if (stock <= minimumStock) return {
			label: "Bajo",
			className: "bg-amber-50 text-amber-800 border-amber-200"
		};
		return {
			label: "OK",
			className: "bg-emerald-50 text-emerald-700 border-emerald-200"
		};
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
			setAdminError(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "No se pudo crear el cafe.");
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
			setAdminError(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "No se pudo actualizar el cafe.");
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
		setter((current) => ({
			...current,
			[field]: value
		}));
	};
	if (!isAdmin()) return /* @__PURE__ */ jsx("div", {
		className: "max-w-4xl mx-auto p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "card-premium p-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-black text-brand-dark",
				children: "Acceso restringido"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-brand-medium font-bold mt-2",
				children: "No tienes permisos para acceder a esta pagina."
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-7xl mx-auto w-full px-4 py-10",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-black text-brand-dark tracking-tight",
					children: "Panel de administracion"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-brand-medium font-bold mt-2",
					children: "Gestiona usuarios, cafes y reseñas conectadas a la base de datos."
				})]
			}),
			adminError && /* @__PURE__ */ jsx("div", {
				className: "mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700",
				children: adminError
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Usuarios"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.users
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Cafes"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.cafes
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Reseñas"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.reviews
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-black text-brand-medium uppercase tracking-[0.2em]",
							children: "Rating medio"
						}), /* @__PURE__ */ jsx("strong", {
							className: "block text-3xl font-black text-brand-dark mt-2",
							children: stats.averageRating
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mb-8 flex flex-wrap gap-3",
				children: [
					["cafes", `Cafes (${cafes.length})`],
					["inventory", `Inventario (${stats.lowStock} bajos)`],
					["reviews", `Reseñas (${reviews.length})`],
					["users", `Usuarios (${users.length})`]
				].map(([tab, label]) => /* @__PURE__ */ jsx("button", {
					onClick: () => setActiveTab(tab),
					className: `rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-brand-dark dark:bg-white text-white dark:text-black shadow-lg" : "bg-brand-beige text-brand-dark border border-brand-light"}`,
					children: label
				}, tab))
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "card-premium p-10 text-center font-black text-brand-medium",
				children: "Cargando panel..."
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
				activeTab === "cafes" && /* @__PURE__ */ jsxs("section", {
					className: "space-y-8",
					children: [/* @__PURE__ */ jsx(CafeForm, {
						title: "Crear nuevo cafe",
						cafe: newCafe,
						onChange: updateCafeForm(setNewCafe),
						onSubmit: handleCreateCafe,
						submitLabel: "Agregar cafe"
					}), editingCafeId && /* @__PURE__ */ jsx(CafeForm, {
						title: "Editar cafe",
						cafe: editingCafeData,
						onChange: updateCafeForm(setEditingCafeData),
						onSubmit: (event) => {
							event.preventDefault();
							handleSaveCafe(editingCafeId);
						},
						submitLabel: "Guardar cambios",
						secondaryAction: () => {
							setEditingCafeId(null);
							setEditingCafeData(emptyCafe);
						}
					})]
				}),
				activeTab === "inventory" && /* @__PURE__ */ jsxs("section", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "card-premium p-6",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-black text-brand-dark",
							children: "Inventario"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-brand-medium font-bold mt-2",
							children: "Consulta el stock por producto y abre la edicion cuando un cafe tenga stock bajo."
						})]
					}), cafes.length ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
						children: [...cafes].sort((a, b) => {
							const aLow = Number(a.stock ?? 0) <= Number(a.minimumStock ?? 0) ? 1 : 0;
							return (Number(b.stock ?? 0) <= Number(b.minimumStock ?? 0) ? 1 : 0) - aLow;
						}).map((cafe) => {
							const stock = Number(cafe.stock ?? 0);
							const minimumStock = Number(cafe.minimumStock ?? 0);
							const status = inventoryStatus(stock, minimumStock);
							const isLowStock = stock <= minimumStock;
							return /* @__PURE__ */ jsxs("article", {
								className: "card-premium overflow-hidden",
								children: [/* @__PURE__ */ jsx("img", {
									src: cafe.imageUrl,
									alt: cafe.name,
									width: "640",
									height: "416",
									loading: "lazy",
									decoding: "async",
									className: "h-52 w-full object-cover"
								}), /* @__PURE__ */ jsxs("div", {
									className: "p-6 space-y-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-black text-brand-dark leading-tight",
												children: cafe.name
											}), /* @__PURE__ */ jsx("p", {
												className: "mt-1 text-xs font-black uppercase tracking-[0.2em] text-brand-medium",
												children: cafe.brand
											})] }), /* @__PURE__ */ jsx("span", {
												className: `inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${status.className}`,
												children: status.label
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "rounded-2xl border border-brand-light bg-brand-bg px-4 py-4",
												children: [/* @__PURE__ */ jsx("span", {
													className: "block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium",
													children: "Stock"
												}), /* @__PURE__ */ jsx("strong", {
													className: "mt-2 block text-2xl font-black text-brand-dark",
													children: stock
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "rounded-2xl border border-brand-light bg-brand-bg px-4 py-4",
												children: [/* @__PURE__ */ jsx("span", {
													className: "block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium",
													children: "Stock mínimo"
												}), /* @__PURE__ */ jsx("strong", {
													className: "mt-2 block text-2xl font-black text-brand-dark",
													children: minimumStock
												})]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-2 gap-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "rounded-2xl border border-brand-light bg-brand-bg px-4 py-4",
												children: [/* @__PURE__ */ jsx("span", {
													className: "block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium",
													children: "Origen"
												}), /* @__PURE__ */ jsx("strong", {
													className: "mt-2 block text-base font-black text-brand-dark",
													children: cafe.origin
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "rounded-2xl border border-brand-light bg-brand-bg px-4 py-4",
												children: [/* @__PURE__ */ jsx("span", {
													className: "block text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium",
													children: "Precio"
												}), /* @__PURE__ */ jsx("strong", {
													className: "mt-2 block text-base font-black text-brand-dark",
													children: formatCOP(cafe.price)
												})]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex gap-3",
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => goToEditCafe(cafe),
												className: "btn-table-primary flex-1",
												children: isLowStock ? "Stock bajo: editar" : "Editar"
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => handleDeleteCafe(cafe._id),
												className: "btn-table-danger flex-1",
												children: "Eliminar"
											})]
										})
									]
								})]
							}, cafe._id);
						})
					}) : /* @__PURE__ */ jsx("div", {
						className: "card-premium px-6 py-10 text-center font-bold text-brand-medium",
						children: "No hay cafes registrados."
					})]
				}),
				activeTab === "reviews" && /* @__PURE__ */ jsx(DataTable, {
					headers: [
						"Usuario",
						"Cafe",
						"Calificacion",
						"Comentario",
						"Acciones"
					],
					emptyMessage: "No hay reseñas registradas.",
					children: reviews.map((review) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: review.user?.name || "Sin usuario"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: review.cafe?.name || "Cafe eliminado"
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "table-cell-admin",
							children: [review.rating, "/5"]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin max-w-md",
							children: review.comment
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => handleDeleteReview(review._id),
								className: "btn-table-danger",
								children: "Eliminar"
							})
						})
					] }, review._id))
				}),
				activeTab === "users" && /* @__PURE__ */ jsx(DataTable, {
					headers: [
						"Nombre",
						"Email",
						"Rol",
						"Puntos",
						"Acciones"
					],
					emptyMessage: "No hay usuarios registrados.",
					children: users.map((user) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin font-black",
							children: user.name
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: user.email
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: /* @__PURE__ */ jsxs("select", {
								value: user.role,
								onChange: (event) => handleRoleChange(user._id, event.target.value),
								"aria-label": `Cambiar rol de ${user.name}`,
								className: "rounded-lg border border-brand-light bg-brand-beige px-3 py-2 text-sm font-bold text-brand-dark dark:text-white",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "client",
										children: "Cliente"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "user",
										children: "Cliente"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "admin",
										children: "Administrador"
									})
								]
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: user.points || 0
						}),
						/* @__PURE__ */ jsx("td", {
							className: "table-cell-admin",
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => handleDeleteUser(user._id),
								className: "btn-table-danger",
								children: "Eliminar"
							})
						})
					] }, user._id))
				})
			] })
		]
	});
};
var CafeForm = ({ title, cafe, onChange, onSubmit, submitLabel, secondaryAction }) => /* @__PURE__ */ jsxs("section", {
	className: "card-premium p-6 sm:p-8",
	children: [/* @__PURE__ */ jsx("h2", {
		className: "text-2xl font-black text-brand-dark mb-6",
		children: title
	}), /* @__PURE__ */ jsxs("form", {
		onSubmit,
		className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "lg:col-span-2 rounded-3xl border border-brand-light bg-brand-bg p-4",
				children: cafe.imageUrl ? /* @__PURE__ */ jsx("img", {
					src: cafe.imageUrl,
					alt: cafe.name || "Vista previa del cafe",
					width: "896",
					height: "448",
					loading: "lazy",
					decoding: "async",
					className: "h-56 w-full rounded-2xl object-cover"
				}) : /* @__PURE__ */ jsx("div", {
					className: "flex h-56 w-full items-center justify-center rounded-2xl border border-dashed border-brand-light text-sm font-bold text-brand-medium",
					children: "La imagen aparecera aqui"
				})
			}),
			/* @__PURE__ */ jsx("input", {
				"aria-label": "Nombre del cafe",
				value: cafe.name,
				onChange: (event) => onChange("name", event.target.value),
				placeholder: "Nombre",
				className: "input-premium",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				"aria-label": "Marca del cafe",
				value: cafe.brand,
				onChange: (event) => onChange("brand", event.target.value),
				placeholder: "Marca",
				className: "input-premium",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				"aria-label": "Origen del cafe",
				value: cafe.origin,
				onChange: (event) => onChange("origin", event.target.value),
				placeholder: "Origen",
				className: "input-premium",
				required: true
			}),
			/* @__PURE__ */ jsxs("select", {
				"aria-label": "Nivel de tueste",
				value: cafe.roast,
				onChange: (event) => onChange("roast", event.target.value),
				className: "input-premium",
				children: [
					/* @__PURE__ */ jsx("option", {
						value: "Claro",
						children: "Claro"
					}),
					/* @__PURE__ */ jsx("option", {
						value: "Medio",
						children: "Medio"
					}),
					/* @__PURE__ */ jsx("option", {
						value: "Oscuro",
						children: "Oscuro"
					})
				]
			}),
			/* @__PURE__ */ jsx("input", {
				"aria-label": "Precio del cafe",
				type: "number",
				value: cafe.price,
				onChange: (event) => onChange("price", event.target.value),
				placeholder: "Precio",
				className: "input-premium",
				min: "0",
				step: "0.01",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				"aria-label": "Stock disponible",
				type: "number",
				value: cafe.stock,
				onChange: (event) => onChange("stock", event.target.value),
				placeholder: "Stock",
				className: "input-premium",
				min: "0",
				step: "1",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				"aria-label": "Stock mínimo",
				type: "number",
				value: cafe.minimumStock,
				onChange: (event) => onChange("minimumStock", event.target.value),
				placeholder: "Stock mínimo",
				className: "input-premium",
				min: "0",
				step: "1",
				required: true
			}),
			/* @__PURE__ */ jsx("input", {
				"aria-label": "URL de imagen",
				value: cafe.imageUrl,
				onChange: (event) => onChange("imageUrl", event.target.value),
				placeholder: "URL de imagen o deja vacío para subir archivo",
				className: "input-premium"
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex flex-col gap-2 rounded-2xl border border-brand-light bg-brand-bg px-5 py-4 text-sm font-black text-brand-dark",
				children: [/* @__PURE__ */ jsx("span", {
					className: "uppercase tracking-[0.2em] text-[10px] font-black text-brand-medium",
					children: "Imagen desde tu equipo"
				}), /* @__PURE__ */ jsx("input", {
					type: "file",
					accept: "image/*",
					onChange: (event) => {
						const file = event.target.files?.[0];
						if (!file) return;
						const reader = new FileReader();
						reader.onload = () => onChange("imageUrl", reader.result || "");
						reader.readAsDataURL(file);
					},
					className: "input-premium"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "rounded-2xl border border-brand-light bg-brand-bg px-5 py-4 text-sm font-black text-brand-dark",
				children: "Disponible para clientes segun el stock registrado"
			}),
			/* @__PURE__ */ jsx("textarea", {
				"aria-label": "Descripcion del cafe",
				value: cafe.description,
				onChange: (event) => onChange("description", event.target.value),
				placeholder: "Descripcion",
				rows: "3",
				className: "input-premium lg:col-span-2",
				required: true
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-2 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx("button", {
					type: "submit",
					className: "btn-premium",
					children: submitLabel
				}), secondaryAction && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: secondaryAction,
					className: "rounded-2xl border border-brand-light px-6 py-4 text-xs font-black uppercase tracking-widest text-brand-dark",
					children: "Cancelar"
				})]
			})
		]
	})]
});
var DataTable = ({ headers, children, emptyMessage }) => {
	const rowCount = Children.count(children);
	return /* @__PURE__ */ jsx("div", {
		className: "card-premium overflow-x-auto",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full min-w-[760px] border-collapse",
			children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", {
				className: "bg-brand-bg",
				children: headers.map((header) => /* @__PURE__ */ jsx("th", {
					className: "border-b border-brand-light px-4 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium",
					children: header
				}, header))
			}) }), /* @__PURE__ */ jsx("tbody", { children: rowCount ? children : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
				colSpan: headers.length,
				className: "px-6 py-10 text-center font-bold text-brand-medium",
				children: emptyMessage
			}) }) })]
		})
	});
};
//#endregion
export { AdminDashboard as default };
