// Builds the static site from site.config.js and the components.
//   node build.mjs
// Output:
//   dist/index.html + dist/assets/   (for hosting)
//   dist/eastrand-demo.html          (single file you can open or send as-is)
import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import cfg from "./site.config.js";
import Page from "./components/Page.js";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");
const css = await readFile(join(root, "src/styles.css"), "utf8");
const js = await readFile(join(root, "src/main.js"), "utf8");

await mkdir(join(dist, "assets"), { recursive: true });
await writeFile(join(dist, "assets/styles.css"), css);
await writeFile(join(dist, "assets/main.js"), js);
if (existsSync(join(root, "assets/img"))) await cp(join(root, "assets/img"), join(dist, "assets/img"), { recursive: true });

await writeFile(join(dist, "index.html"), Page(cfg, { css, js, inline: false }));

// The single-file demo can't reference assets/, so local images are embedded.
const mime = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };
const inlineCfg = structuredClone(cfg);
for (const entry of Object.values(inlineCfg.images)) {
  if (!entry.src || /^(https?:|data:)/.test(entry.src)) continue;
  const ext = entry.src.split(".").pop().toLowerCase();
  entry.src = `data:${mime[ext] || "application/octet-stream"};base64,${(await readFile(join(root, entry.src))).toString("base64")}`;
}
await writeFile(join(dist, "eastern-auto-body-demo.html"), Page(inlineCfg, { css, js, inline: true }));
console.log("Built dist/index.html and dist/eastern-auto-body-demo.html");
