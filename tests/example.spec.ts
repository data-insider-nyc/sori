import { test, expect } from "@playwright/test";

test.describe("community core smoke", () => {
  test("community list loads and filtering query params work", async ({
    page,
  }) => {
    await page.goto("/community");

    await expect(page.getByRole("heading", { name: "커뮤니티" })).toBeVisible();
    await expect(page.getByPlaceholder("게시글 검색...")).toBeVisible();

    await page.getByRole("button", { name: "NYC Metro" }).click();
    await expect(page).toHaveURL(/region=nyc/);

    await page.getByRole("button", { name: "부동산" }).click();
    await expect(page).toHaveURL(/category=(housing|realestate)/);
  });

  test("guest user write paths redirect to login", async ({ page }) => {
    await page.goto("/community/new");
    await expect(page).toHaveURL(/auth\/login/);
  });
});
