import { beforeEach, describe, expect, it, vi } from "vitest";

const { authApiMock } = vi.hoisted(() => ({
  authApiMock: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock("../api/api", () => ({
  authApi: authApiMock,
}));

const loadStore = async () => {
  vi.resetModules();
  const module = await import("../store/useAuthStore");
  return module.useAuthStore;
};

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("inicia con estado vacio cuando no hay usuario persistido", async () => {
    const useAuthStore = await loadStore();
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.initializing).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("hidrata el usuario inicial desde localStorage", async () => {
    localStorage.setItem("cafe_user", JSON.stringify({ name: "Maria", role: "admin" }));

    const useAuthStore = await loadStore();

    expect(useAuthStore.getState().user).toEqual({ name: "Maria", role: "admin" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("setUser actualiza el estado y persiste el usuario", async () => {
    const useAuthStore = await loadStore();

    useAuthStore.getState().setUser({ name: "Ana", role: "client" });

    expect(useAuthStore.getState().user).toEqual({ name: "Ana", role: "client" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(JSON.parse(localStorage.getItem("cafe_user"))).toEqual({ name: "Ana", role: "client" });
  });

  it("setUser con null elimina la persistencia local", async () => {
    localStorage.setItem("cafe_user", JSON.stringify({ name: "Ana", role: "client" }));
    const useAuthStore = await loadStore();

    useAuthStore.getState().setUser(null);

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("cafe_user")).toBeNull();
  });

  it("login exitoso guarda usuario y limpia errores", async () => {
    authApiMock.login.mockResolvedValue({ user: { id: 1, name: "Ana", role: "client" } });
    const useAuthStore = await loadStore();

    const user = await useAuthStore.getState().login({
      email: "test@example.com",
      password: "Test1234",
    });

    expect(authApiMock.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Test1234",
    });
    expect(user).toEqual({ id: 1, name: "Ana", role: "client" });
    expect(useAuthStore.getState().user).toEqual({ id: 1, name: "Ana", role: "client" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it("login fallido guarda el mensaje de error", async () => {
    authApiMock.login.mockRejectedValue({
      response: { data: { message: "Credenciales invalidas" } },
    });
    const useAuthStore = await loadStore();

    await expect(
      useAuthStore.getState().login({
        email: "test@example.com",
        password: "mal",
      })
    ).rejects.toThrow("Credenciales invalidas");

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().error).toBe("Credenciales invalidas");
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it("initialize carga el usuario autenticado cuando /me responde correctamente", async () => {
    authApiMock.me.mockResolvedValue({ user: { id: 2, name: "Luis", role: "client" } });
    const useAuthStore = await loadStore();

    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().user).toEqual({ id: 2, name: "Luis", role: "client" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().initializing).toBe(false);
    expect(JSON.parse(localStorage.getItem("cafe_user"))).toEqual({ id: 2, name: "Luis", role: "client" });
  });

  it("initialize limpia el usuario cuando /me falla", async () => {
    localStorage.setItem("cafe_user", JSON.stringify({ name: "Persistido", role: "client" }));
    authApiMock.me.mockRejectedValue(new Error("401"));
    const useAuthStore = await loadStore();

    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().initializing).toBe(false);
    expect(localStorage.getItem("cafe_user")).toBeNull();
  });

  it("refreshMe actualiza el usuario autenticado", async () => {
    authApiMock.me.mockResolvedValue({ user: { id: 3, name: "Cata", role: "admin" } });
    const useAuthStore = await loadStore();

    const user = await useAuthStore.getState().refreshMe();

    expect(user).toEqual({ id: 3, name: "Cata", role: "admin" });
    expect(useAuthStore.getState().user).toEqual({ id: 3, name: "Cata", role: "admin" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("register exitoso autentica al usuario", async () => {
    authApiMock.register.mockResolvedValue({ user: { id: 4, name: "Nora", role: "client" } });
    const useAuthStore = await loadStore();

    const user = await useAuthStore.getState().register({
      name: "Nora",
      email: "nora@example.com",
      password: "Test1234",
    });

    expect(user).toEqual({ id: 4, name: "Nora", role: "client" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("register fallido expone el mensaje de error", async () => {
    authApiMock.register.mockRejectedValue({
      response: { data: { message: "Correo ya registrado" } },
    });
    const useAuthStore = await loadStore();

    await expect(
      useAuthStore.getState().register({
        name: "Nora",
        email: "nora@example.com",
        password: "Test1234",
      })
    ).rejects.toThrow("Correo ya registrado");

    expect(useAuthStore.getState().error).toBe("Correo ya registrado");
  });

  it("logout limpia el usuario aunque la API falle", async () => {
    authApiMock.logout.mockRejectedValue(new Error("network"));
    const useAuthStore = await loadStore();

    useAuthStore.getState().setUser({ id: 7, name: "Demo", role: "client" });
    await useAuthStore.getState().logout();

    expect(authApiMock.logout).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
    expect(localStorage.getItem("cafe_user")).toBeNull();
  });

  it("tolera un usuario persistido corrupto en localStorage", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("cafe_user", "{json-invalido");

    const useAuthStore = await loadStore();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("funciona sin window ni localStorage disponibles", async () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("localStorage", undefined);

    const useAuthStore = await loadStore();

    expect(useAuthStore.getState().user).toBeNull();
    expect(() => useAuthStore.getState().setUser({ name: "Sin storage", role: "client" })).not.toThrow();
    expect(useAuthStore.getState().user).toEqual({ name: "Sin storage", role: "client" });
  });

  it("isAdmin e isClient responden segun el rol actual", async () => {
    const useAuthStore = await loadStore();

    useAuthStore.getState().setUser({ name: "Admin", role: "admin" });
    expect(useAuthStore.getState().isAdmin()).toBe(true);
    expect(useAuthStore.getState().isClient()).toBe(false);

    useAuthStore.getState().setUser({ name: "Cliente", role: "client" });
    expect(useAuthStore.getState().isAdmin()).toBe(false);
    expect(useAuthStore.getState().isClient()).toBe(true);

    useAuthStore.getState().setUser({ name: "Legacy", role: "user" });
    expect(useAuthStore.getState().isClient()).toBe(true);
  });
});
