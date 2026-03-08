import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectLoginScreen(page: Page) {
  await expect(
    page.getByRole("heading", { name: /Entra para continuar a construir/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Retoma o teu bootcamp/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/Usa email e password para aceder ao progresso/i),
  ).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /^Entrar$/i })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Registar agora/i }),
  ).toBeVisible();
}

async function expectProtectedRedirect(page: Page) {
  await page.waitForURL(/\/login\/?$/i, { timeout: 15000 });
  await expectLoginScreen(page);
}

test("home page loads the Portuguese learning workspace", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Prophet Lite/i })).toBeVisible();
  await expect(page.getByText(/builder com criterio de produto/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Comecar Dia 00/i })).toBeVisible();
  await expect(page.getByText(/Continuar aprendizagem/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /^Entrar$/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Retomar aula/i })).toBeVisible();
});

test("missions require login before opening the workspace", async ({ page }) => {
  await page.goto("/missions/01/");

  await expectProtectedRedirect(page);
});

test("portfolio page redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/portfolio/");

  await expectProtectedRedirect(page);
});

test("admin page redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/admin/");

  await expectProtectedRedirect(page);
  await expect(page.getByText(/Painel de Administracao/i)).not.toBeVisible();
});

test("login page has correct Portuguese form fields", async ({ page }) => {
  await page.goto("/login/");

  await expectLoginScreen(page);
});

test("all 11 mission pages are statically accessible", async ({ page }) => {
  const slugs = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

  for (const slug of slugs) {
    await page.goto(`/missions/${slug}/`);
    await expectProtectedRedirect(page);
  }
});

test("resources page loads without authentication", async ({ page }) => {
  await page.goto("/resources/");

  await expect(
    page.getByRole("heading", {
      name: /Ficheiros, referencias e datasets prontos para continuar localmente/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/Esta pagina substitui a dependencia da app antiga/i),
  ).toBeVisible();
});

test("404 page renders correctly for unknown routes", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/");

  await expect(page.getByText(/Mission not found/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Back home/i })).toBeVisible();
  expect([200, 404]).toContain(response?.status() ?? 200);
});
