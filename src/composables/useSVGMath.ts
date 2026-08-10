export interface CoordMap {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  vbWidth: number
  vbHeight: number
}

/** Math → SVG pixel coordinates. SVG y-axis is inverted vs math. */
export function mathToSVG(mx: number, my: number, m: CoordMap): [number, number] {
  const sx = ((mx - m.xMin) / (m.xMax - m.xMin)) * m.vbWidth
  const sy = m.vbHeight - ((my - m.yMin) / (m.yMax - m.yMin)) * m.vbHeight
  return [+sx.toFixed(3), +sy.toFixed(3)]
}

/** SVG pixel → math coordinates. */
export function svgToMath(sx: number, sy: number, m: CoordMap): [number, number] {
  const mx = m.xMin + (sx / m.vbWidth) * (m.xMax - m.xMin)
  const my = m.yMin + ((m.vbHeight - sy) / m.vbHeight) * (m.yMax - m.yMin)
  return [mx, my]
}

/** Build an SVG path string for fn(x) over the map's x range. */
export function fnPath(fn: (x: number) => number, m: CoordMap, steps = 300): string {
  let d = ''
  let lastGood = false
  const pad = 1.5 // allow slight overflow for smooth curve edges

  for (let i = 0; i <= steps; i++) {
    const mx = m.xMin + (i / steps) * (m.xMax - m.xMin)
    const my = fn(mx)

    if (!isFinite(my) || my < m.yMin - pad || my > m.yMax + pad) {
      lastGood = false
      continue
    }

    const [sx, sy] = mathToSVG(mx, my, m)
    if (!lastGood) {
      d += `M${sx},${sy} `
    } else {
      d += `L${sx},${sy} `
    }
    lastGood = true
  }

  return d.trim()
}

/** Convert a browser pointer event's position to SVG viewBox coordinates. */
export function screenToSVG(
  e: MouseEvent | TouchEvent,
  svgEl: SVGSVGElement,
  vbWidth: number,
  vbHeight: number,
): [number, number] {
  const rect = svgEl.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
  return [
    ((clientX - rect.left) / rect.width) * vbWidth,
    ((clientY - rect.top) / rect.height) * vbHeight,
  ]
}

/** Clamp a value between min and max. */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}
