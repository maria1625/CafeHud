import { expect, test } from "@playwright/test";
import { installMockApi } from "./support/mockApi";

test("Landing -> validacion de formulario -> login exitoso -> logout", async ({ page }) => {
  await installMockApi(page);

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /café premium/i })).toBeVisible();

  await page.getByRole("link", { name: /iniciar sesión/i }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder("tu@email.com").fill("test@example.com");
  await page.getByPlaceholder("********").fill("123");
  await page.getByRole("button", { name: /ingresar/i }).click();
  await expect(page.getByText("Minimo 6 caracteres")).toBeVisible();

  await page.getByPlaceholder("tu@email.com").fill("test@example.com");
  await page.getByPlaceholder("********").fill("Wrong123");
  await page.getByRole("button", { name: /ingresar/i }).click();

  await expect(page.getByText("Credenciales invalidas")).toBeVisible();

  await page.getByPlaceholder("tu@email.com").fill("test@example.com");
  await page.getByPlaceholder("********").fill("Test1234");
  await page.getByRole("button", { name: /ingresar/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /hola, test user/i })).toBeVisible();

  await page.getByRole("button", { name: /cerrar sesión/i }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: /iniciar sesion/i })).toBeVisible();
});
