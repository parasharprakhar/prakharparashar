import { test, expect } from "@playwright/test";
import { existsSync, statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * End-to-end coverage for the "Download CV" CTA in the hero section.
 * Runs against both the desktop and mobile Playwright projects defined
 * in playwright.config.ts, so a single spec verifies parity across
 * form factors.
 */

const CV_FILENAME = "Prakhar_Parashar_CV.docx";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

test.describe("Hero — Download CV", () => {
  test.beforeAll(() => {
    // Sanity: the asset the link points at must exist on disk.
    // Skip (rather than crash) when the CV asset is missing so CI surfaces a
    // clean signal instead of an opaque ENOENT.
    const onDisk = resolve(process.cwd(), "public", CV_FILENAME);
    test.skip(!existsSync(onDisk), `Missing public/${CV_FILENAME} — skipping CV download checks`);
    expect(statSync(onDisk).size).toBeGreaterThan(1000);
  });

  test("link is visible with correct attributes", async ({ page }) => {
    await page.goto("./");
    const link = page.getByRole("link", { name: /download cv/i });
    await expect(link).toBeVisible();

    const href = await link.getAttribute("href");
    expect(href).toMatch(new RegExp(`${CV_FILENAME}$`));

    // `download` attribute ensures the browser saves rather than navigates.
    await expect(link).toHaveAttribute("download", /Prakhar_Parashar_CV\.docx/);
  });

  test("clicking the link downloads the current CV file", async ({ page, baseURL }) => {
    await page.goto("./");
    const link = page.getByRole("link", { name: /download cv/i });

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      link.click(),
    ]);

    expect(download.suggestedFilename()).toBe(CV_FILENAME);

    const path = await download.path();
    expect(path).toBeTruthy();

    const bytes = readFileSync(path!);
    // .docx files are ZIP archives — first two bytes are "PK".
    expect(bytes.subarray(0, 2).toString("utf8")).toBe("PK");

    // Cross-check: the same file is reachable directly and served with the
    // correct content-type by the dev server.
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    const direct = await page.request.get(new URL(href!, baseURL!).toString());
    expect(direct.status()).toBe(200);
    const ctype = direct.headers()["content-type"] ?? "";
    expect(
      ctype === "" || ctype.includes(DOCX_MIME) || ctype.includes("octet-stream"),
      `unexpected content-type: ${ctype}`,
    ).toBe(true);

    const remoteBytes = await direct.body();
    expect(remoteBytes.length).toBe(bytes.length);
  });
});
