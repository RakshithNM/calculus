<template>
  <div class="die-away-vis">
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

      <!-- The Curve y = e^-x -->
      <path :d="curvePath" class="fn-curve" />

      <!-- Height Line -->
      <line
        :x1="pt[0]" :y1="ms(0,0)[1]"
        :x2="pt[0]" :y2="pt[1]"
        class="height-line"
      />
      
      <!-- Tangent line that always hits x_0 + 1 -->
      <line
        :x1="pt[0]" :y1="pt[1]"
        :x2="ms(curX + 1, 0)[0]" :y2="ms(0,0)[1]"
        class="tangent-line"
      />
      
      <!-- Subtangent base (dx = 1) -->
      <line
        :x1="pt[0]" :y1="ms(0,0)[1]"
        :x2="ms(curX + 1, 0)[0]" :y2="ms(0,0)[1]"
        class="base-line"
      />
      
      <!-- Labels -->
      <text :x="pt[0] - 8" :y="pt[1] + (ms(0,0)[1] - pt[1])/2" class="lbl lbl--height" :transform="`rotate(-90, ${pt[0]-8}, ${pt[1] + (ms(0,0)[1] - pt[1])/2})`">
        y = {{ val.toFixed(2) }}
      </text>
      
      <text :x="pt[0] + (ms(curX + 1, 0)[0] - pt[0])/2" :y="ms(0,0)[1] + 16" class="lbl lbl--base">
        dx = 1
      </text>
      
      <text :x="pt[0] + (ms(curX + 1, 0)[0] - pt[0])/2 + 10" :y="pt[1] + (ms(0,0)[1] - pt[1])/2 - 10" class="lbl lbl--tangent">
        Slope = -{{ val.toFixed(2) }}
      </text>

      <!-- Point on curve and X-axis intercept -->
      <circle :cx="pt[0]" :cy="pt[1]" r="5" class="pt-curve" />
      <circle :cx="ms(curX + 1, 0)[0]" :cy="ms(0,0)[1]" r="5" class="pt-intercept" />
      
      <!-- Connective dashed line to show x+1 explicitly if needed -->
      <!-- We already have the base-line doing this -->
    </svg>

    <div class="readout">
      <div class="r-row">
        <span class="r-title">Current Height (<span class="math-var">y</span>)</span>
        <span class="r-val" style="color: var(--warm)">{{ val.toFixed(3) }}</span>
      </div>
      <div class="r-row">
        <span class="r-title">Current Slope (<span class="math-var">dy/dx</span>)</span>
        <span class="r-val" style="color: var(--accent)">-{{ val.toFixed(3) }}</span>
      </div>
    </div>
    
    <div class="desc">
      Because <span class="math-var">dy/dx = -y</span>, the tangent line of <span class="math-var">y = e^{-x}</span> will <strong>always</strong> hit the x-axis exactly 1 unit ahead of your current position. Try it!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 450
const VBH = 260
const MAP: CoordMap = { xMin: -0.5, xMax: 4.5, yMin: -0.2, yMax: 2.2, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(0.5)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const fY = (x: number) => Math.exp(-x)

const curvePath = computed(() => {
  // Let's draw it from -0.5 to 5
  let path = ''
  for (let x = -0.5; x <= 5; x += 0.1) {
    const y = fY(x)
    const [sx, sy] = ms(x, y)
    if (x === -0.5) path += `M ${sx} ${sy}`
    else path += ` L ${sx} ${sy}`
  }
  return path
})

const pt = computed(() => ms(curX.value, fY(curX.value)))
const val = computed(() => fY(curX.value))

const xGridLines = [0, 1, 2, 3, 4]
const yGridLines = [0, 0.5, 1, 1.5, 2]

function updateX(svgX: number) {
  const [mx] = svgToMath(svgX, 0, MAP)
  curX.value = clamp(mx, -0.2, 3.2) // keep x_intercept (x+1) within view
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
.die-away-vis {
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
  
  .tangent-line {
    stroke: var(--accent);
    stroke-width: 2;
  }
  
  .base-line {
    stroke: var(--text-muted);
    stroke-width: 2;
    stroke-dasharray: 4 4;
  }
  
  .lbl {
    font-family: var(--ff-mono);
    font-size: 11px;
    font-weight: 600;
    
    &--height { fill: var(--warm); text-anchor: middle; }
    &--base { fill: var(--text-muted); text-anchor: middle; }
    &--tangent { fill: var(--accent); text-anchor: start; }
  }

  .pt-curve { fill: var(--warm); }
  .pt-intercept { fill: var(--accent); }
}

.readout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-hi);
  padding: 1rem 1.5rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.r-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .r-title {
    font-family: var(--ff-ui);
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  
  .r-val {
    font-family: var(--ff-mono);
    font-size: 1.1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}

.desc {
  text-align: center;
  font-family: var(--ff-ui);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.math-var {
  font-family: var(--ff-mono);
  font-style: italic;
  color: var(--text);
}
</style>
