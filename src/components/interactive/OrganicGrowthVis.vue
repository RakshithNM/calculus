<template>
  <div class="organic-growth-vis">
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

      <!-- The Curve y = e^x -->
      <path :d="curvePath" class="fn-curve" />

      <!-- Height Line -->
      <line
        :x1="pt[0]" :y1="ms(0,0)[1]"
        :x2="pt[0]" :y2="pt[1]"
        class="height-line"
      />
      <text :x="pt[0] - 8" :y="pt[1] + (ms(0,0)[1] - pt[1])/2" class="lbl lbl--height" transform="rotate(-90, pt[0]-8, pt[1] + (ms(0,0)[1] - pt[1])/2)">
        Height = {{ val.toFixed(2) }}
      </text>

      <!-- Tangent & Slope Triangle -->
      <clipPath id="og-tangent-clip">
        <rect x="0" y="0" :width="VBW" :height="VBH" />
      </clipPath>
      
      <!-- dx = 1 -->
      <line
        :x1="pt[0]" :y1="ms(0,0)[1]"
        :x2="ms(curX + 1, 0)[0]" :y2="ms(0,0)[1]"
        class="triangle-line dx-line"
      />
      <text :x="pt[0] + (ms(curX + 1, 0)[0] - pt[0])/2" :y="ms(0,0)[1] + 16" class="lbl lbl--dx">
        dx = 1
      </text>
      
      <!-- dy = slope -->
      <line
        :x1="ms(curX + 1, 0)[0]" :y1="ms(0,0)[1]"
        :x2="ms(curX + 1, 0)[0]" :y2="ms(0, 0)[1] - (ms(0,0)[1] - ms(0, val)[1])"
        class="triangle-line dy-line"
      />
      <text :x="ms(curX + 1, 0)[0] + 8" :y="ms(0,0)[1] - (ms(0,0)[1] - ms(0, val)[1])/2" class="lbl lbl--dy">
        dy = {{ val.toFixed(2) }}
      </text>
      
      <!-- Tangent hypotenuse -->
      <line
        :x1="tan.x1" :y1="tan.y1"
        :x2="tan.x2" :y2="tan.y2"
        class="tangent-line"
        clip-path="url(#og-tangent-clip)"
      />

      <!-- Point on curve -->
      <circle :cx="pt[0]" :cy="pt[1]" r="7" class="pt-glow" />
      <circle :cx="pt[0]" :cy="pt[1]" r="4.5" class="pt-outer" />
      <circle :cx="pt[0]" :cy="pt[1]" r="2" class="pt-inner" />
    </svg>

    <div class="readout">
      <div class="r-col r-col--height">
        <span class="r-title">Height (<span class="math-var">y</span>)</span>
        <span class="r-val">{{ val.toFixed(2) }}</span>
      </div>
      <div class="r-col r-col--eq">
        <span>=</span>
      </div>
      <div class="r-col r-col--slope">
        <span class="r-title">Slope (<span class="math-var">dy/dx</span>)</span>
        <span class="r-val">{{ val.toFixed(2) }}</span>
      </div>
    </div>
    
    <div class="desc">
      For <span class="math-var">y = e^x</span>, the steepness of the curve at any point is exactly equal to its height. It is the law of organic growth.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 450
const VBH = 300
// We need to show y up to ~8 to show e^2
const MAP: CoordMap = { xMin: -2.5, xMax: 2.5, yMin: -1, yMax: 8.5, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(0.5)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const fY = (x: number) => Math.exp(x)

const curvePath = computed(() => fnPath(fY, MAP))

const pt = computed(() => ms(curX.value, fY(curX.value)))
const val = computed(() => fY(curX.value))

const tan = computed(() => {
  const x0 = curX.value
  const y0 = fY(x0)
  const m = y0 // dy/dx = y
  
  const p1_x = x0 - 3
  const p1_y = y0 - m * 3
  
  const p2_x = x0 + 3
  const p2_y = y0 + m * 3
  
  const [sx1, sy1] = ms(p1_x, p1_y)
  const [sx2, sy2] = ms(p2_x, p2_y)
  
  return { x1: sx1, y1: sy1, x2: sx2, y2: sy2 }
})

const xGridLines = [-2, -1, 1, 2]
const yGridLines = [1, 2, 3, 4, 5, 6, 7, 8]

function updateX(svgX: number) {
  const [mx] = svgToMath(svgX, 0, MAP)
  curX.value = clamp(mx, -2.2, 1.8) // limit so triangle fits
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
.organic-growth-vis {
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
    stroke: var(--text);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .height-line {
    stroke: var(--warm);
    stroke-width: 2;
    stroke-dasharray: 4 4;
  }
  
  .triangle-line {
    stroke-width: 2;
    &.dx-line { stroke: var(--text-muted); }
    &.dy-line { stroke: var(--accent); }
  }
  
  .tangent-line {
    stroke: var(--accent);
    stroke-width: 1.5;
    opacity: 0.5;
  }
  
  .lbl {
    font-family: var(--ff-mono);
    font-size: 11px;
    font-weight: 600;
    text-anchor: middle;
    
    &--height { fill: var(--warm); text-anchor: middle; }
    &--dx { fill: var(--text-muted); }
    &--dy { fill: var(--accent); text-anchor: start; alignment-baseline: middle; }
  }

  .pt-glow   { fill: var(--accent); opacity: 0.15; }
  .pt-outer  { fill: var(--accent); }
  .pt-inner  { fill: var(--surface-hi); }
}

.readout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  background: var(--surface-hi);
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.r-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  
  &--eq {
    font-family: var(--ff-mono);
    font-size: 1.5rem;
    color: var(--text-muted);
  }
  
  .r-title {
    font-family: var(--ff-ui);
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  
  .r-val {
    font-family: var(--ff-mono);
    font-size: 1.5rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  
  &--height .r-val { color: var(--warm); }
  &--slope .r-val { color: var(--accent); }
}

.desc {
  text-align: center;
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.math-var {
  font-family: var(--ff-mono);
  font-style: italic;
  color: var(--text);
}
</style>
