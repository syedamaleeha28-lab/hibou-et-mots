/**
 * Generate optimized favicon assets from public/favicon-source.svg
 * Usage: node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import pngToIco from "png-to-ico"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const publicDir = join(root, "public")
const svg = readFileSync(join(publicDir, "favicon-source.svg"))

const pngTargets = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
]

async function renderPng(size) {
  return sharp(svg, { density: Math.max(96, size * 4) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer()
}

async function main() {
  const rendered = new Map()

  for (const { name, size } of pngTargets) {
    const buffer = await renderPng(size)
    const path = join(publicDir, name)
    writeFileSync(path, buffer)
    rendered.set(size, buffer)
    console.log(`${name}: ${buffer.length} bytes`)
  }

  const iconSvgPath = join(publicDir, "icon.svg")
  writeFileSync(iconSvgPath, svg)
  console.log(`icon.svg: ${svg.length} bytes`)

  const icoSizes = [16, 32, 48]
  const icoBuffers = await Promise.all(
    icoSizes.map(async (size) => {
      if (rendered.has(size)) return rendered.get(size)
      return renderPng(size)
    }),
  )
  const ico = await pngToIco(icoBuffers)
  const icoPath = join(publicDir, "favicon.ico")
  writeFileSync(icoPath, ico)
  console.log(`favicon.ico: ${ico.length} bytes (${icoSizes.join(", ")}px)`)

  if (ico.length > 100 * 1024) {
    throw new Error(`favicon.ico exceeds 100 KB (${ico.length} bytes)`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
