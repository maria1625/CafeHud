import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiInstance, axiosCreateMock, setUserMock } = vi.hoisted(() => {
  const interceptorsUse = vi.fn();
  const instance = {
    interceptors: {
      response: {
        use: interceptorsUse,
      },
    },
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };

  return {
    apiInstance: instance,
    axiosCreateMock: vi.fn(() => instance),
    setUserMock: vi.fn(),
  };
});

vi.mock("axios", () => ({
  default: {
    create: axiosCreateMock,
  },
}));

vi.mock("../store/useAuthStore", () => ({
  useAuthStore: {
    getState: () => ({
      setUser: setUserMock,
    }),
  },
}));

const loadRejectedInterceptor = async () => {
  vi.resetModules();
  await import("../api/api");
  return apiInstance.interceptors.response.use.mock.calls[0][1];
};

describe("api interceptor", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState({}, "", "/dashboard");
  });

  it("redirige a /login en un 401 de una ruta no-auth", async () => {
    const replaceSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/dashboard",
      replace: replaceSpy,
    });
    apiInstance.post.mockResolvedValue({ data: {} });
    localStorage.setItem("demo", "1");
    sessionStorage.setItem("demo", "1");
    const rejected = await loadRejectedInterceptor();

    const error = {
      config: { url: "/cafes" },
      response: { status: 401 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(apiInstance.post).toHaveBeenCalledWith("/auth/logout");
    expect(setUserMock).toHaveBeenCalledWith(null);
    expect(localStorage.getItem("demo")).toBeNull();
    expect(sessionStorage.getItem("demo")).toBeNull();
    expect(replaceSpy).toHaveBeenCalledWith("/login");
  });

  it("no redirige cuando el 401 ocurre en una ruta de auth", async () => {
    const replaceSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/dashboard",
      replace: replaceSpy,
    });
    const rejected = await loadRejectedInterceptor();
    const error = {
      config: { url: "/auth/login" },
      response: { status: 401 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(apiInstance.post).not.toHaveBeenCalled();
    expect(setUserMock).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("limpia sesion pero no redirige si ya esta en /login", async () => {
    const replaceSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/login",
      replace: replaceSpy,
    });
    apiInstance.post.mockResolvedValue({ data: {} });
    const rejected = await loadRejectedInterceptor();
    const error = {
      config: { url: "/admin/users" },
      response: { status: 401 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(apiInstance.post).toHaveBeenCalledWith("/auth/logout");
    expect(setUserMock).toHaveBeenCalledWith(null);
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("continua con la limpieza aunque el logout silencioso falle", async () => {
    const replaceSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/dashboard",
      replace: replaceSpy,
    });
    apiInstance.post.mockRejectedValue(new Error("logout failed"));
    const rejected = await loadRejectedInterceptor();
    const error = {
      config: { url: "/favorites" },
      response: { status: 401 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(setUserMock).toHaveBeenCalledWith(null);
    expect(replaceSpy).toHaveBeenCalledWith("/login");
  });

  it("no limpia sesion ni redirige cuando el error no es 401", async () => {
    const replaceSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/dashboard",
      replace: replaceSpy,
    });

    const rejected = await loadRejectedInterceptor();
    const error = {
      config: { url: "/cafes" },
      response: { status: 500 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(apiInstance.post).not.toHaveBeenCalled();
    expect(setUserMock).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("tolera errores sin config.url y los rechaza sin efectos secundarios", async () => {
    const replaceSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/dashboard",
      replace: replaceSpy,
    });

    const rejected = await loadRejectedInterceptor();
    const error = {
      response: { status: 500 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(apiInstance.post).not.toHaveBeenCalled();
    expect(setUserMock).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("devuelve la respuesta original en la rama exitosa del interceptor", async () => {
    vi.resetModules();
    await import("../api/api");
    const fulfilled = apiInstance.interceptors.response.use.mock.calls[0][0];
    const response = { data: { ok: true } };

    expect(fulfilled(response)).toBe(response);
  });

  it("rechaza de inmediato un segundo 401 mientras ya se maneja otro", async () => {
    const replaceSpy = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      pathname: "/dashboard",
      replace: replaceSpy,
    });

    let resolveLogout;
    apiInstance.post.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogout = resolve;
        })
    );

    const rejected = await loadRejectedInterceptor();
    const firstError = { config: { url: "/cafes" }, response: { status: 401 } };
    const secondError = { config: { url: "/admin/users" }, response: { status: 401 } };

    const firstPromise = rejected(firstError);
    await Promise.resolve();

    await expect(rejected(secondError)).rejects.toBe(secondError);

    resolveLogout({ data: {} });
    await expect(firstPromise).rejects.toBe(firstError);
    expect(setUserMock).toHaveBeenCalledTimes(1);
    expect(replaceSpy).toHaveBeenCalledWith("/login");
  });
});

describe("api helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("configura la instancia axios con la baseURL esperada", async () => {
    await import("../api/api");

    expect(axiosCreateMock).toHaveBeenCalledWith({
      baseURL: "http://localhost:4000/api/v1",
      withCredentials: true,
    });
  });

  it("authApi usa unwrap sobre respuestas anidadas", async () => {
    const { authApi } = await import("../api/api");
    apiInstance.post
      .mockResolvedValueOnce({ data: { data: { user: { email: "test@example.com" } } } })
      .mockResolvedValueOnce({ data: { data: { user: { email: "nuevo@example.com" } } } })
      .mockResolvedValueOnce({ data: { data: { ok: true } } });
    apiInstance.get.mockResolvedValueOnce({ data: { data: { user: { name: "Maria" } } } });

    await expect(authApi.login({ email: "test@example.com", password: "Test1234" })).resolves.toEqual({
      user: { email: "test@example.com" },
    });
    await expect(authApi.register({ email: "nuevo@example.com", password: "Test1234" })).resolves.toEqual({
      user: { email: "nuevo@example.com" },
    });
    await expect(authApi.me()).resolves.toEqual({ user: { name: "Maria" } });
    await expect(authApi.logout()).resolves.toEqual({ ok: true });
  });

  it("cafeApi invoca los endpoints de catalogo correctamente", async () => {
    const { cafeApi } = await import("../api/api");
    apiInstance.get
      .mockResolvedValueOnce({ data: { data: [{ id: 1 }] } })
      .mockResolvedValueOnce({ data: { data: { id: 2 } } });
    apiInstance.post
      .mockResolvedValueOnce({ data: { data: { id: 3, votes: 8 } } })
      .mockResolvedValueOnce({ data: { data: { id: 4, reviews: [] } } });

    await expect(cafeApi.getCafes()).resolves.toEqual([{ id: 1 }]);
    await expect(cafeApi.getCafe("2")).resolves.toEqual({ id: 2 });
    await expect(cafeApi.vote("3")).resolves.toEqual({ id: 3, votes: 8 });
    await expect(cafeApi.addReview("4", { rating: 5, comment: "Buen cafe" })).resolves.toEqual({
      id: 4,
      reviews: [],
    });
  });

  it("favoriteApi, reviewApi y adminApi usan sus endpoints esperados", async () => {
    const { favoriteApi, reviewApi, adminApi } = await import("../api/api");
    apiInstance.get
      .mockResolvedValueOnce({ data: { data: ["cafe-1"] } })
      .mockResolvedValueOnce({ data: { extra: true } })
      .mockResolvedValueOnce({ data: { data: [{ id: "user-1" }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: "cafe-1" }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: "cafe-1", stock: 2 }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: "cafe-1", stock: 1 }] } })
      .mockResolvedValueOnce({ data: { data: [{ id: "review-1" }] } });
    apiInstance.post
      .mockResolvedValueOnce({ data: { data: ["cafe-1", "cafe-2"] } })
      .mockResolvedValueOnce({ data: { data: { id: "cafe-2" } } });
    apiInstance.put
      .mockResolvedValueOnce({ data: { data: { id: "review-1", comment: "Editada" } } })
      .mockResolvedValueOnce({ data: { data: { id: "user-1", role: "admin" } } })
      .mockResolvedValueOnce({ data: { data: { id: "cafe-1", price: 19000 } } });
    apiInstance.patch.mockResolvedValueOnce({ data: { data: { id: "cafe-1", stock: 9 } } });
    apiInstance.delete
      .mockResolvedValueOnce({ data: { data: { ok: true } } })
      .mockResolvedValueOnce({ data: { data: { ok: true } } })
      .mockResolvedValueOnce({ data: { data: { ok: true } } })
      .mockResolvedValueOnce({ data: { data: { ok: true } } });

    await expect(favoriteApi.getFavorites()).resolves.toEqual(["cafe-1"]);
    await expect(favoriteApi.toggle("cafe-1")).resolves.toEqual(["cafe-1", "cafe-2"]);
    await expect(reviewApi.getMine()).resolves.toEqual({ extra: true });
    await expect(reviewApi.update("review-1", { comment: "Editada" })).resolves.toEqual({
      id: "review-1",
      comment: "Editada",
    });
    await expect(reviewApi.delete("review-1")).resolves.toEqual({ ok: true });

    await expect(adminApi.getUsers()).resolves.toEqual([{ id: "user-1" }]);
    await expect(adminApi.updateUserRole("user-1", "admin")).resolves.toEqual({ id: "user-1", role: "admin" });
    await expect(adminApi.deleteUser("user-1")).resolves.toEqual({ ok: true });
    await expect(adminApi.getCafes()).resolves.toEqual([{ id: "cafe-1" }]);
    await expect(adminApi.createCafe({ name: "Nuevo" })).resolves.toEqual({ id: "cafe-2" });
    await expect(adminApi.updateCafe("cafe-1", { price: 19000 })).resolves.toEqual({ id: "cafe-1", price: 19000 });
    await expect(adminApi.getInventory()).resolves.toEqual([{ id: "cafe-1", stock: 2 }]);
    await expect(adminApi.getLowStock()).resolves.toEqual([{ id: "cafe-1", stock: 1 }]);
    await expect(adminApi.updateCafeInventory("cafe-1", { stock: 9 })).resolves.toEqual({ id: "cafe-1", stock: 9 });
    await expect(adminApi.deleteCafe("cafe-1")).resolves.toEqual({ ok: true });
    await expect(adminApi.getReviews()).resolves.toEqual([{ id: "review-1" }]);
    await expect(adminApi.deleteReview("review-1")).resolves.toEqual({ ok: true });
  });
});
