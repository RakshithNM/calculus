<template>
  <div class="constants-vis">
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

      <!-- Parabola -->
      <path :d="curvePath" class="fn-curve" />

      <!-- Tangent line clipped -->
      <clipPath id="const-tangent-clip">
        <rect x="0" y="0" :width="VBW" :height="VBH" />
      </clipPath>
      <line
        :x1="tan.x1" :y1="tan.y1"
        :x2="tan.x2" :y2="tan.y2"
        class="tangent-line"
        clip-path="url(#const-tangent-clip)"
      />

      <!-- Drop line to x-axis -->
      <line
        :x1="pt[0]" :y1="pt[1]"
        :x2="pt[0]" :y2="ms(curX, 0)[1]"
        class="drop-line"
      />

      <!-- Point on curve -->
      <circle :cx="pt[0]" :cy="pt[1]" r="7" class="pt-glow" />
      <circle :cx="pt[0]" :cy="pt[1]" r="4.5" class="pt-outer" />
      <circle :cx="pt[0]" :cy="pt[1]" r="2" class="pt-inner" />

      <!-- Slope label near point -->
      <text
        :x="pt[0] + 10"
        :y="pt[1] - 10"
        class="slope-label"
      >slope = {{ (2 * curX).toFixed(2) }}</text>
    </svg>

    <div class="ctrl-row">
      <span class="ctrl-lbl">c =</span>
      <input type="range" v-model.number="cVal" min="-2" max="6" step="0.1" />
      <span class="ctrl-out">{{ cVal > 0 ? '+' : '' }}{{ cVal.toFixed(1) }}</span>
    </div>

    <div class="readout">
      <span class="r-item">y = x² {{ cVal >= 0 ? '+' : '-' }} {{ Math.abs(cVal).toFixed(1) }}</span>
      <span class="r-item">slope = 2x + <em>0</em> = <em>{{ (2 * curX).toFixed(2) }}</em></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 400
const VBH = 230
const MAP: CoordMap = { xMin: -3, xMax: 3, yMin: -3, yMax: 12, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(1.2)
const cVal  = ref(2.0)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const curvePath = computed(() => fnPath((x) => x * x + cVal.value, MAP))
const pt        = computed(() => ms(curX.value, curX.value ** 2 + cVal.value))

const tan = computed(() => {
  const x = curX.value
  const slope = 2 * x // slope does not depend on c!
  const b = (x * x + cVal.value) - slope * x
  const [x1, y1] = ms(MAP.xMin, slope * MAP.xMin + b)
  const [x2, y2] = ms(MAP.xMax, slope * MAP.xMax + b)
  return { x1, y1, x2, y2 }
})

const xGridLines = [-3, -2, -1, 1, 2, 3]
const yGridLines = [-2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

function updateX(svgX: number) {
  const [mx] = svgToMath(svgX, 0, MAP)
  curX.value = clamp(mx, -2.92, 2.92)
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
.constants-vis {
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

  .tangent-line {
    stroke: var(--accent);
    stroke-width: 1.5;
    stroke-dasharray: 5 4;
  }

  .drop-line {
    stroke: var(--accent);
    stroke-width: 0.75;
    stroke-dasharray: 3 4;
    opacity: 0.3;
  }

  .pt-glow   { fill: var(--accent); opacity: 0.15; }
  .pt-outer  { fill: var(--accent); }
  .pt-inner  { fill: var(--surface-hi); }

  .slope-label {
    font-family: var(--ff-ui);
    font-size: 12px;
    fill: var(--accent);
    pointer-events: none;
  }
}

.ctrl-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 0.5rem;
}

.ctrl-lbl {
  font-family: var(--ff-mono);
  font-size: 0.9rem;
  color: var(--warm);
  font-style: italic;
  min-width: 2rem;
}

.ctrl-out {
  font-family: var(--ff-mono);
  font-size: 0.9rem;
  color: var(--warm);
  min-width: 4ch;
}

.readout {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  font-family: var(--ff-ui);
  font-size: 0.85rem;
  color: var(--text-muted);

  em {
    color: var(--accent);
    font-style: normal;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}
</style>
