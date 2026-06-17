import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "../components/ProtectedRoute";

const { useAuthStoreMock } = vi.hoisted(() => ({
  useAuthStoreMock: vi.fn(),
}));

vi.mock("../store/useAuthStore", () => ({
  useAuthStore: () => useAuthStoreMock(),
}));

const renderProtectedRoute = (element) =>
  render(
    <MemoryRouter initialEntries={["/privado"]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/dashboard" element={<div>Dashboard page</div>} />
        <Route path="/privado" element={element} />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no renderiza nada mientras carga", () => {
    useAuthStoreMock.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null,
    });

    const { container } = renderProtectedRoute(
      <ProtectedRoute>
        <div>Contenido secreto</div>
      </ProtectedRoute>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("redirige al login si el usuario no esta autenticado", () => {
    useAuthStoreMock.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    });

    renderProtectedRoute(
      <ProtectedRoute>
        <div>Contenido secreto</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirige al dashboard si el rol requerido no coincide", () => {
    useAuthStoreMock.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { role: "client" },
    });

    renderProtectedRoute(
      <ProtectedRoute requiredRole="admin">
        <div>Panel admin</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });

  it("renderiza los hijos cuando el usuario tiene acceso", () => {
    useAuthStoreMock.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { role: "admin" },
    });

    renderProtectedRoute(
      <ProtectedRoute requiredRole="admin">
        <div>Panel admin</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Panel admin")).toBeInTheDocument();
  });
});
