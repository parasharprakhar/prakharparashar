import { test, expect } from "@playwright/test";

const sections = [
  { label: "About", anchor: "about" },
  { label: "Skills", anchor: "skills" },
  { label: "Experience", anchor: "experience" },
  { label: "Projects", anchor: "projects" },
  { label: "Analytics", anchor: "analytics" },
  { label: "Certifications", anchor: "certifications" },
  { label: "Awards", anchor: "awards" },
  { label: "Recruiter", anchor: "recruiter" },
  { label: "Feedback", anchor: "feedback" },
  { label: "Contact", anchor: "contact" },
];

test.describe("Portfolio routing and navigation", () => {
  test("homepage renders after refresh on supported entry paths", async ({ page }) => {
    const basePath = new URL(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080/").pathname.replace(/\/$/, "");
    const paths = ["/", "/index", "/index.html"];
    if (!basePath.includes("/prakharparashar")) paths.push("/prakharparashar/");

    for (const path of paths) {
      await page.goto(path);
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toContainText(/Prakhar/i);
      await expect(page.getByText(/404|page not found/i)).toHaveCount(0);
    }
  });

  test("desktop navigation tabs scroll to every profile section", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop navigation is covered by desktop projects only.");

    await page.goto("/");
    for (const section of sections) {
      await page.getByRole("link", { name: section.label }).first().click();
      await expect(page.locator(`#${section.anchor}`)).toBeInViewport({ ratio: 0.15 });
    }
  });

  test("mobile navigation menu opens and reaches key sections", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile navigation is covered by mobile projects only.");

    await page.goto("/");
    for (const section of [sections[0], sections[1], sections[3], sections[9]]) {
      await page.getByRole("button", { name: /open navigation menu/i }).click();
      await page.locator("#mobile-nav-menu").getByRole("link", { name: section.label }).click();
      await expect(page.locator(`#${section.anchor}`)).toBeInViewport({ ratio: 0.15 });
    }
  });
});