import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const indexFile = join(distDir, "index.html");
const fallbackFile = join(distDir, "404.html");

if (existsSync(indexFile)) {
  copyFileSync(indexFile, fallbackFile);
  console.log("Created dist/404.html SPA fallback for GitHub Pages refresh support.");
}