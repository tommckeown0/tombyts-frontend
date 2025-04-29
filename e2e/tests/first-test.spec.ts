import { test } from "@playwright/test";

const username = process.env.USER1 ?? "";
const password = process.env.PASSWORD1 ?? "";

test("has title", async ({ page }) => {
	await page.goto("");
	await page.locator("data-testid=login-button").click();
	await page.waitForSelector("data-testid=login-title");
	await page.locator("data-testid=username-input").fill(username);
	await page.locator("data-testid=password-input").fill(password);
	await page.locator("data-testid=login-submit-button").click();
	await page.waitForSelector("data-testid=movie-link-0");
	await page.locator("data-testid=movie-link-0").click();

	await page.waitForTimeout(5000);
	// Expect a title "to contain" a substring.
	// await expect(page).toHaveTitle(/Playwright/);
});
