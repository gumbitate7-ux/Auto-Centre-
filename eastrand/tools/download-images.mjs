// Downloads every Unsplash demo photo into assets/img/ and points site.config.js at the
// local copies, so the site no longer depends on Unsplash at runtime.
//   node tools/download-images.mjs
// Then run `node build.mjs`. To use the workshop's own photos instead, overwrite the
// files in assets/img/ (same names) and rebuild.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import cfg from "../site.config.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imgDir = join(root, "assets/img");
await mkdir(imgDir, { recursive: true });

const done = new Map();
for (const [key, entry] of Object.entries(cfg.images)) {
  if (!entry.unsplash) continue;
  const file = `${key}.jpg`;
  const res = await fetch(`https://unsplash.com/photos/${entry.unsplash}/download?force=true&w=2000`);
  if (!res.ok) { console.warn(`Skipped ${key}: HTTP ${res.status}`); continue; }
  await writeFile(join(imgDir, file), Buffer.from(await res.arrayBuffer()));
  done.set(key, `assets/img/${file}`);
  console.log(`Saved ${file}`);
}

const configPath = join(root, "site.config.js");
let src = await readFile(configPath, "utf8");
for (const [key, path] of done) {
  src = src.replace(new RegExp(`(\\n\\s*${key}:\\s*\\{\\s*)unsplash:\\s*"[^"]+"`), `$1src: "${path}"`);
}
await writeFile(configPath, src);
console.log(`\nUpdated site.config.js for ${done.size} images. Now run: node build.mjs`);
