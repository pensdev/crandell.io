import { expect, test } from "@playwright/test";

test("home loads and shows simulation results", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Illustrative fiscal/,
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await expect(page.getByText("Running simulation…")).not.toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("Receipts (10-yr", { exact: false })).toBeVisible();
});
