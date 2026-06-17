import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "../components/forms/LoginForm";

const { navigateMock, loginMock, useAuthStoreMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  loginMock: vi.fn(),
  useAuthStoreMock: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../store/useAuthStore", () => ({
  useAuthStore: () => useAuthStoreMock(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStoreMock.mockReturnValue({
      login: loginMock,
      loading: false,
      error: null,
    });
  });

  it("muestra errores de validacion cuando el formulario es invalido", async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByPlaceholderText("tu@email.com"), {
      target: { value: "correo-invalido" },
    });
    fireEvent.input(screen.getByPlaceholderText("********"), {
      target: { value: "123" },
    });
    fireEvent.submit(document.querySelector("form"));

    expect(await screen.findByText("Correo invalido")).toBeInTheDocument();
    expect(await screen.findByText("Minimo 6 caracteres")).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("envia credenciales validas y navega al dashboard", async () => {
    loginMock.mockResolvedValue({ id: 1, name: "Test User" });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByPlaceholderText("tu@email.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("********"), {
      target: { value: "Test1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Test1234",
      });
    });
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });

  it("muestra el error de autenticacion que viene del store", () => {
    useAuthStoreMock.mockReturnValue({
      login: loginMock,
      loading: false,
      error: "Credenciales invalidas",
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByText("Credenciales invalidas")).toBeInTheDocument();
  });
});
