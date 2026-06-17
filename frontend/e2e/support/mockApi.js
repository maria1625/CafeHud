export const sampleCafe = {
  _id: "cafe-1",
  id: "cafe-1",
  name: "Cafe de Prueba",
  brand: "CafeHub",
  description: "Cafe de origen para pruebas E2E",
  origin: "Colombia",
  roast: "Medio",
  price: 15900,
  rating: 4.8,
  votes: 10,
  available: true,
  stock: 5,
  minimumStock: 1,
  imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  reviews: [],
};

const json = (payload) => ({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify(payload),
});

export const installMockApi = async (page) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  const state = {
    loggedIn: false,
    user: {
      _id: "user-1",
      name: "Test User",
      email: "test@example.com",
      role: "client",
      points: 25,
    },
    favorites: [],
    cafes: [structuredClone(sampleCafe)],
    reviews: [],
  };

  await page.route("**/api/v1/**", async (route) => {
    const request = route.request();
    const method = request.method();
    const url = new URL(request.url());
    const normalizedPath = url.pathname.replace(/\/$/, "");

    if (normalizedPath.includes("/auth/me") && method === "GET") {
      if (!state.loggedIn) {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "No autenticado" }),
        });
        return;
      }

      await route.fulfill(json({ success: true, data: { user: state.user } }));
      return;
    }

    if (normalizedPath.includes("/auth/login") && method === "POST") {
      const credentials = request.postDataJSON();
      if (credentials?.email === "test@example.com" && credentials?.password === "Test1234") {
        state.loggedIn = true;
        await route.fulfill(json({ success: true, data: { user: state.user } }));
        return;
      }

      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Credenciales invalidas" }),
      });
      return;
    }

    if (normalizedPath.includes("/auth/logout") && method === "POST") {
      state.loggedIn = false;
      await route.fulfill(json({ success: true, data: { ok: true } }));
      return;
    }

    if (normalizedPath.includes("/cafes") && method === "GET") {
      await route.fulfill(json({ success: true, data: state.cafes }));
      return;
    }

    if (normalizedPath.includes("/favorites") && method === "GET") {
      await route.fulfill(json({ success: true, data: state.favorites }));
      return;
    }

    if (normalizedPath.includes("/favorites/") && normalizedPath.endsWith("/toggle") && method === "POST") {
      const cafeId = normalizedPath.split("/").at(-2);
      if (state.favorites.includes(cafeId)) {
        state.favorites = state.favorites.filter((id) => id !== cafeId);
      } else {
        state.favorites = [...state.favorites, cafeId];
      }

      await route.fulfill(json({ success: true, data: state.favorites }));
      return;
    }

    if (normalizedPath.includes("/reviews/mine") && method === "GET") {
      await route.fulfill(json({ success: true, data: state.reviews }));
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: {} }),
    });
  });

  return state;
};
