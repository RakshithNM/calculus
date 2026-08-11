<template>
  <div class="maxmin">
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
        <line v-for="gx in xGrid" :key="`gx${gx}`"
          :x1="ms(gx,0)[0]" y1="0" :x2="ms(gx,0)[0]" :y2="VBH" />
        <line v-for="gy in yGrid" :key="`gy${gy}`"
          x1="0" :y1="ms(0,gy)[1]" :x2="VBW" :y2="ms(0,gy)[1]" />
      </g>

      <!-- Axes -->
      <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" :y2="VBH" class="axis" />
      <line x1="0" :y1="ms(0,0)[1]" :x2="VBW" :y2="ms(0,0)[1]" class="axis" />

      <!-- Zero-slope markers: vertical dashed lines at x = ±1 -->
      <line :x1="ms(-1,0)[0]" y1="0" :x2="ms(-1,0)[0]" :y2="VBH" class="critical-line" />
      <line :x1="ms( 1,0)[0]" y1="0" :x2="ms( 1,0)[0]" :y2="VBH" class="critical-line" />

      <!-- Curve: f(x) = x³ − 3x -->
      <path :d="curvePath" class="fn-curve" />

      <!-- Tangent line (clipped) -->
      <clipPath id="mm-clip">
        <rect x="0" y="0" :width="VBW" :height="VBH" />
      </clipPath>
      <line
        :x1="tan.x1" :y1="tan.y1"
        :x2="tan.x2" :y2="tan.y2"
        class="tangent-line"
        clip-path="url(#mm-clip)"
      />

      <!-- Critical point dots (always visible) -->
      <circle :cx="ms(-1, f(-1))[0]" :cy="ms(-1, f(-1))[1]" r="6" class="crit-glow" />
      <circle :cx="ms(-1, f(-1))[0]" :cy="ms(-1, f(-1))[1]" r="4" class="crit-dot" />
      <circle :cx="ms( 1, f( 1))[0]" :cy="ms( 1, f( 1))[1]" r="6" class="crit-glow" />
      <circle :cx="ms( 1, f( 1))[0]" :cy="ms( 1, f( 1))[1]" r="4" class="crit-dot" />

      <!-- Labels for critical points -->
      <text :x="ms(-1, f(-1))[0] - 10" :y="ms(-1, f(-1))[1] - 12" class="crit-label crit-label--max">max</text>
      <text :x="ms( 1, f( 1))[0] + 6"  :y="ms( 1, f( 1))[1] + 18" class="crit-label crit-label--min">min</text>

      <!-- "slope = 0" annotation on x-axis at critical x -->
      <text :x="ms(-1,0)[0]" :y="ms(0,0)[1] - 6" class="zero-label">slope=0</text>
      <text :x="ms( 1,0)[0]" :y="ms(0,0)[1] - 6" class="zero-label">slope=0</text>

      <!-- Moving point on curve -->
      <circle :cx="pt[0]" :cy="pt[1]" r="6" class="pt-glow" />
      <circle :cx="pt[0]" :cy="pt[1]" r="4" class="pt-dot" />
    </svg>

    <!-- State readout -->
    <div class="readout">
      <span class="r-item">x = <em>{{ curX.toFixed(2) }}</em></span>
      <span class="r-item">y = <em>{{ f(curX).toFixed(2) }}</em></span>
      <span class="r-item">
        slope =
        <em :class="slopeClass">{{ df(curX).toFixed(2) }}</em>
        <span class="slope-state">{{ slopeState }}</span>
      </span>
    </div>

    <p class="formula-note">
      f(x) = x³ − 3x &nbsp;·&nbsp; f′(x) = 3x² − 3 &nbsp;·&nbsp;
      f′(x) = 0 at x = <span class="hi">±1</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 400
const VBH = 230
const MAP: CoordMap = { xMin: -2.4, xMax: 2.4, yMin: -3, yMax: 3, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(0.4)

const ms  = (mx: number, my: number) => mathToSVG(mx, my, MAP)
const f   = (x: number) => x ** 3 - 3 * x
const df  = (x: number) => 3 * x ** 2 - 3

const curvePath = computed(() => fnPath(f, MAP))
const pt        = computed(() => ms(curX.value, f(curX.value)))

const tan = computed(() => {
  const x = curX.value
  const slope = df(x)
  const b = f(x) - slope * x
  return {
    x1: ms(MAP.xMin, slope * MAP.xMin + b)[0],
    y1: ms(MAP.xMin, slope * MAP.xMin + b)[1],
    x2: ms(MAP.xMax, slope * MAP.xMax + b)[0],
    y2: ms(MAP.xMax, slope * MAP.xMax + b)[1],
  }
})

const slopeState = computed(() => {
  const s = df(curX.value)
  if (Math.abs(s) < 0.25) return ' - turning point!'
  return s > 0 ? ' ↑ rising' : ' ↓ falling'
})

const slopeClass = computed(() => {
  const s = df(curX.value)
  if (Math.abs(s) < 0.25) return 'slope--zero'
  return s > 0 ? 'slope--pos' : 'slope--neg'
})

const xGrid = [-2, -1, 0, 1, 2]
const yGrid = [-2, -1, 0, 1, 2]

function updateX(svgX: number) {
  const [mx] = svgToMath(svgX, 0, MAP)
  curX.value = clamp(mx, MAP.xMin + 0.05, MAP.xMax - 0.05)
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
.graph {
  width: 100%;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);
  cursor: crosshair;
  touch-action: none;

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

  .critical-line {
    stroke: var(--accent);
    stroke-width: 0.8;
    stroke-dasharray: 4 3;
    opacity: 0.4;
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

  .crit-glow { fill: var(--accent); opacity: 0.2; }
  .crit-dot  { fill: var(--accent); }

  .crit-label {
    font-family: var(--ff-ui);
    font-size: 10px;
    font-weight: 600;
    text-anchor: middle;
    pointer-events: none;

    &--max { fill: var(--accent); }
    &--min { fill: var(--accent); }
  }

  .zero-label {
    font-family: var(--ff-mono);
    font-size: 9px;
    fill: var(--accent);
    text-anchor: middle;
    opacity: 0.55;
  }

  .pt-glow { fill: var(--warm); opacity: 0.2; }
  .pt-dot  { fill: var(--warm); }
}

.readout {
  margin-top: 1rem;
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  font-family: var(--ff-ui);
  font-size: 0.78rem;
  color: var(--text-muted);

  em {
    font-style: normal;
    font-weight: 600;
    font-variant-numeric: tabular-nums;

    &.slope--pos  { color: var(--accent); }
    &.slope--neg  { color: var(--warm); }
    &.slope--zero { color: #6db96d; }
  }

  .slope-state {
    font-style: italic;
    margin-left: 0.2em;
  }
}

.formula-note {
  margin-top: 0.75rem;
  font-family: var(--ff-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
