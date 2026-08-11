<template>
  <div class="curvature-vis">
    <svg
      ref="svgEl"
      :viewBox="`0 0 ${VBW} ${VBH}`"
      class="graph"
      preserveAspectRatio="xMidYMid meet"
      @mousemove="onMouseMove"
      @touchmove.prevent="onTouchMove"
    >
      <!-- Grid -->
      <g class="grid">
        <line
          v-for="gx in xGridLines"
          :key="`gx${gx}`"
          :x1="ms(gx, 0)[0]" y1="0"
          :x2="ms(gx, 0)[0]" :y2="VBH"
        />
        <line
          v-for="gy in yGridLines"
          :key="`gy${gy}`"
          x1="0" :y1="ms(0, gy)[1]"
          :x2="VBW" :y2="ms(0, gy)[1]"
        />
      </g>

      <!-- Axes -->
      <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" :y2="VBH" class="axis" />
      <line x1="0" :y1="ms(0,0)[1]" :x2="VBW" :y2="ms(0,0)[1]" class="axis" />

      <!-- The Curve -->
      <path :d="curvePath" class="fn-curve" />

      <!-- Osculating Circle (clipped to SVG so it doesn't blow out when R is huge) -->
      <clipPath id="circle-clip">
        <rect x="0" y="0" :width="VBW" :height="VBH" />
      </clipPath>
      
      <g clip-path="url(#circle-clip)">
        <circle 
          v-if="Math.abs(y2) > 0.05"
          :cx="cxSVG" 
          :cy="cySVG" 
          :r="rSVG" 
          class="osculating-circle" 
        />
        <line
          v-if="Math.abs(y2) > 0.05"
          :x1="pt[0]" :y1="pt[1]"
          :x2="cxSVG" :y2="cySVG"
          class="radius-line"
        />
        <circle 
          v-if="Math.abs(y2) > 0.05"
          :cx="cxSVG" 
          :cy="cySVG" 
          r="3" 
          class="circle-center" 
        />
      </g>
      
      <line
        v-if="Math.abs(y2) <= 0.05"
        :x1="tan.x1" :y1="tan.y1"
        :x2="tan.x2" :y2="tan.y2"
        class="tangent-line"
        clip-path="url(#circle-clip)"
      />

      <!-- Point on curve -->
      <circle :cx="pt[0]" :cy="pt[1]" r="7" class="pt-glow" :class="{ 'inflection': Math.abs(y2) <= 0.05 }" />
      <circle :cx="pt[0]" :cy="pt[1]" r="4.5" class="pt-outer" :class="{ 'inflection': Math.abs(y2) <= 0.05 }" />
      <circle :cx="pt[0]" :cy="pt[1]" r="2" class="pt-inner" />
    </svg>

    <div class="readout">
      <div class="readout-row">
        <span class="r-item">d²y/dx² = <em>{{ y2.toFixed(2) }}</em></span>
        <span class="r-item r-item--status" :class="statusClass">{{ statusText }}</span>
      </div>
      <div class="r-desc">
        When d²y/dx² is {{ y2 > 0 ? 'positive' : y2 < 0 ? 'negative' : 'zero' }}, 
        the curve is {{ y2 > 0 ? 'bending upwards (concave up)' : y2 < 0 ? 'bending downwards (concave down)' : 'perfectly straight (inflection point)' }}.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 400
const VBH = 260
const MAP: CoordMap = { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.5, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(1.5)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

// f(x) = 0.3 * x^3 - 1.5 * x
const fY  = (x: number) => 0.3 * x ** 3 - 1.5 * x
const fDy = (x: number) => 0.9 * x ** 2 - 1.5
const fD2y = (x: number) => 1.8 * x

const curvePath = computed(() => fnPath(fY, MAP))
const pt        = computed(() => ms(curX.value, fY(curX.value)))

const y1 = computed(() => fDy(curX.value))
const y2 = computed(() => fD2y(curX.value))

// Osculating circle calculations
const radius = computed(() => {
  if (Math.abs(y2.value) < 0.001) return 99999;
  return Math.pow(1 + Math.pow(y1.value, 2), 1.5) / Math.abs(y2.value)
})

const cx = computed(() => {
  if (Math.abs(y2.value) < 0.001) return curX.value;
  return curX.value - (y1.value * (1 + Math.pow(y1.value, 2))) / y2.value
})

const cy = computed(() => {
  if (Math.abs(y2.value) < 0.001) return fY(curX.value);
  return fY(curX.value) + (1 + Math.pow(y1.value, 2)) / y2.value
})

const cxSVG = computed(() => ms(cx.value, cy.value)[0])
const cySVG = computed(() => ms(cx.value, cy.value)[1])

// We need to convert math radius to SVG radius
// SVG radius = math_radius * (VBW / (xMax - xMin))
const rSVG = computed(() => radius.value * (VBW / (MAP.xMax - MAP.xMin)))

// Fallback tangent line for when curvature is zero
const tan = computed(() => {
  const slope = y1.value
  const b = fY(curX.value) - slope * curX.value
  const [x1, ty1] = ms(MAP.xMin, slope * MAP.xMin + b)
  const [x2, ty2] = ms(MAP.xMax, slope * MAP.xMax + b)
  return { x1, y1: ty1, x2, y2: ty2 }
})

const statusText = computed(() => {
  if (Math.abs(y2.value) <= 0.05) return "Inflection Point"
  return y2.value > 0 ? "Concave Up ∪" : "Concave Down ∩"
})

const statusClass = computed(() => {
  if (Math.abs(y2.value) <= 0.05) return "status--zero"
  return y2.value > 0 ? "status--pos" : "status--neg"
})

const xGridLines = [-3, -2, -1, 1, 2, 3]
const yGridLines = [-3, -2, -1, 1, 2, 3]

function updateX(svgX: number) {
  const [mx] = svgToMath(svgX, 0, MAP)
  curX.value = clamp(mx, -3.2, 3.2)
}

function onMouseMove(e: MouseEvent) {
  if (!svgEl.value) return
  const [sx] = screenToSVG(e, svgEl.value, VBW, VBH)
  updateX(sx)
}

function onTouchMove(e: TouchEvent) {
  if (!svgEl.value) return
  const [sx] = screenToSVG(e, svgEl.value, VBW, VBH)
  updateX(sx)
}
</script>

<style lang="scss" scoped>
.curvature-vis {
  display: flex;
  flex-direction: column;
}

.graph {
  width: 100%;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);
  cursor: crosshair;
  touch-action: none;
  margin-bottom: 1rem;

  .grid line {
    stroke: var(--text-dim);
    stroke-width: 0.5;
    opacity: 0.6;
  }

  .axis {
    stroke: var(--text-muted);
    stroke-width: 0.8;
    opacity: 0.35;
  }

  .fn-curve {
    fill: none;
    stroke: var(--warm);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  .osculating-circle {
    fill: var(--accent);
    fill-opacity: 0.08;
    stroke: var(--accent);
    stroke-width: 1.5;
    stroke-dasharray: 4 4;
  }

  .radius-line {
    stroke: var(--accent);
    stroke-width: 1;
    opacity: 0.5;
  }

  .circle-center {
    fill: var(--accent);
    opacity: 0.8;
  }
  
  .tangent-line {
    stroke: var(--text);
    stroke-width: 1.5;
    stroke-dasharray: 5 4;
  }

  .pt-glow   { fill: var(--warm); opacity: 0.15; transition: fill 0.2s; }
  .pt-outer  { fill: var(--warm); transition: fill 0.2s; }
  .pt-inner  { fill: var(--surface-hi); }
  
  .inflection {
    fill: var(--text);
  }
}

.readout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-hi);
  padding: 1rem;
  border-radius: 6px;
}

.readout-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--ff-ui);
  font-size: 0.95rem;
  color: var(--text-muted);

  em {
    color: var(--accent);
    font-style: normal;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}

.r-item--status {
  font-family: var(--ff-mono);
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  
  &.status--pos { background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); }
  &.status--neg { background: color-mix(in srgb, var(--warm) 15%, transparent); color: var(--warm); }
  &.status--zero { background: color-mix(in srgb, var(--text) 15%, transparent); color: var(--text); }
}

.r-desc {
  font-family: var(--ff-ui);
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
  opacity: 0.8;
}
</style>
