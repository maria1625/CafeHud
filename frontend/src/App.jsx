import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

let hasBootstrappedApp = false;

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

const ROUTE_META = {
  "/": {
    title: "CafeHub Premium | Catalogo de cafe de especialidad",
    description:
      "Explora cafes de especialidad, revisa stock disponible y agrega tus favoritos en CafeHub Premium.",
  },
  "/login": {
    title: "Iniciar sesion | CafeHub Premium",
    description:
      "Accede a tu cuenta de CafeHub Premium para gestionar favoritos, carrito y pedidos.",
  },
  "/register": {
    title: "Crear cuenta | CafeHub Premium",
    description:
      "Registrate en CafeHub Premium para guardar favoritos, reseñas y pedidos de cafe.",
  },
  "/dashboard": {
    title: "Tu panel | CafeHub Premium",
    description:
      "Consulta tus favoritos, carrito, puntos y reseñas desde tu panel de CafeHub Premium.",
  },
  "/cobrar": {
    title: "Finalizar compra | CafeHub Premium",
    description:
      "Revisa el resumen de tu pedido y confirma el cobro en CafeHub Premium.",
  },
  "/admin": {
    title: "Administracion | CafeHub Premium",
    description:
      "Administra usuarios, cafes, reseñas e inventario desde el panel administrativo de CafeHub Premium.",
  },
};

const setHeadTag = (selector, value) => {
  if (typeof document === "undefined") {
    return;
  }

  const tag = document.head.querySelector(selector);
  if (tag) {
    tag.setAttribute("content", value);
  }
};

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializing = useAuthStore((state) => state.initializing);
  const initTheme = useThemeStore((state) => state.initTheme);
  const location = useLocation();

  useEffect(() => {
    if (hasBootstrappedApp) {
      return;
    }

    hasBootstrappedApp = true;
    initTheme();
    initialize();
  }, [initTheme, initialize]);

  useEffect(() => {
    const meta =
      ROUTE_META[location.pathname] ||
      ROUTE_META[
        Object.keys(ROUTE_META).find((path) => path !== "/" && location.pathname.startsWith(path)) || "/"
      ];

    if (typeof document === "undefined" || !meta) {
      return;
    }

    document.title = meta.title;
    setHeadTag('meta[name="description"]', meta.description);
    setHeadTag('meta[property="og:title"]', meta.title);
    setHeadTag('meta[property="og:description"]', meta.description);
    setHeadTag('meta[name="twitter:title"]', meta.title);
    setHeadTag('meta[name="twitter:description"]', meta.description);
  }, [location.pathname]);

  if (initializing) {
    return <div className="min-h-screen flex items-center justify-center">Cargando sesión...</div>;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cobrar"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
