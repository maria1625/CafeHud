import { expect, test } from "@playwright/test";
import { installMockApi, sampleCafe } from "./support/mockApi";

test("login y manipulacion de datos en dashboard", async ({ page }) => {
  await installMockApi(page);

  await page.goto("/login");

  await page.getByPlaceholder("tu@email.com").fill("test@example.com");
  await page.getByPlaceholder("********").fill("Test1234");
  await page.getByRole("button", { name: /ingresar/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /hola, test user/i })).toBeVisible();

  await page.getByRole("link", { name: /caféhub/i }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.getByTitle("Anadir a favoritos").first().click();
  await page.getByTitle("Anadir al carrito").first().click();
  await page.getByLabel("Abrir carrito").click();

  await expect(page.getByRole("heading", { name: /tu carrito/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: sampleCafe.name, level: 4 })).toBeVisible();
  await page.getByRole("button", { name: /cerrar carrito/i }).click();

  await page.getByRole("link", { name: /panel/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  const dashboardCartSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: /tu carrito/i }),
  });
  await expect(dashboardCartSection.getByText(sampleCafe.name)).toBeVisible();
  await expect(dashboardCartSection.getByText(/x 1/i)).toBeVisible();
});
