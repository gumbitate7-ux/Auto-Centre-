/**
 * Builds responsive images for the site.
 *
 *   npm run images            # process new/changed images only
 *   npm run images -- --force # rebuild everything
 *
 * Put high-resolution source photos (JPG/PNG/WebP, ideally 2400px+ on the
 * long edge) in assets/images/. Each file becomes:
 *   public/images/<name>-<width>.avif|webp   (several widths)
 * and an entry in src/data/images.generated.json (size + blur placeholder)
 * that the <Picture> component reads. To replace a concept image with a
 * real photo, give the photo the same file name and re-run the script.
 */
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'assets/images')
const OUT = path.join(root, 'public/images')
const MANIFEST = path.join(root, 'src/data/images.generated.json')
const WIDTHS = [480, 640, 960, 1280, 1920, 2400]
const FORMATS = {
  avif: (img) => img.avif({ quality: 52, effort: 5, chromaSubsampling: '4:2:0' }),
  webp: (img) => img.webp({ quality: 78, effort: 5 }),
}
const force = process.argv.includes('--force')

const isNewer = async (out, src) => {
  if (!existsSync(out)) return false
  const [o, s] = await Promise.all([fs.stat(out), fs.stat(src)])
  return o.mtimeMs >= s.mtimeMs
}

await fs.mkdir(OUT, { recursive: true })
const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f)).sort()
const manifest = {}
let written = 0

for (const file of files) {
  const src = path.join(SRC, file)
  const name = path.parse(file).name
  const meta = await sharp(src).metadata()
  const maxWidth = Math.min(meta.width, WIDTHS[WIDTHS.length - 1])
  const widths = [...new Set([...WIDTHS.filter((w) => w < maxWidth), maxWidth])]

  for (const width of widths) {
    for (const [format, encode] of Object.entries(FORMATS)) {
      const out = path.join(OUT, `${name}-${width}.${format}`)
      if (!force && (await isNewer(out, src))) continue
      await encode(sharp(src).resize({ width, withoutEnlargement: true })).toFile(out)
      written++
    }
  }

  const lqip = await sharp(src).resize({ width: 24 }).webp({ quality: 40 }).toBuffer()
  manifest[name] = {
    width: maxWidth,
    height: Math.round((meta.height / meta.width) * maxWidth),
    widths,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  }
  console.log(`✓ ${name} (${widths.join(', ')})`)
}

await fs.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\n${files.length} images, ${written} files written → public/images, manifest updated.`)
