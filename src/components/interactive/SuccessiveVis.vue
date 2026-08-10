<template>
  <div class="successive-vis">
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
      <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" :y2="VBH" class="axis axis--main" />
      <line x1="0" :y1="ms(0,0)[1]" :x2="VBW" :y2="ms(0,0)[1]" class="axis axis--main" />

      <!-- Curves -->
      <!-- f(x) -->
      <path :d="curveY" class="fn-curve fn-curve--y" :class="{ inactive: activeCurve !== 'all' && activeCurve !== 'y' }" />
      <!-- f'(x) -->
      <path :d="curveDy" class="fn-curve fn-curve--dy" :class="{ inactive: activeCurve !== 'all' && activeCurve !== 'dy' }" />
      <!-- f''(x) -->
      <path :d="curveD2y" class="fn-curve fn-curve--d2y" :class="{ inactive: activeCurve !== 'all' && activeCurve !== 'd2y' }" />

      <!-- Drop line to x-axis -->
      <line
        :x1="ms(curX, 0)[0]" :y1="0"
        :x2="ms(curX, 0)[0]" :y2="VBH"
        class="drop-line"
      />

      <!-- Points on curves -->
      <circle :cx="ptY[0]" :cy="ptY[1]" r="4.5" class="pt-outer pt-outer--y" :class="{ inactive: activeCurve !== 'all' && activeCurve !== 'y' }" />
      <circle :cx="ptDy[0]" :cy="ptDy[1]" r="4.5" class="pt-outer pt-outer--dy" :class="{ inactive: activeCurve !== 'all' && activeCurve !== 'dy' }" />
      <circle :cx="ptD2y[0]" :cy="ptD2y[1]" r="4.5" class="pt-outer pt-outer--d2y" :class="{ inactive: activeCurve !== 'all' && activeCurve !== 'd2y' }" />
    </svg>

    <!-- Controls -->
    <div class="ctrl-toggles">
      <button class="toggle-btn toggle-btn--y" :class="{ active: activeCurve === 'y' }" @click="activeCurve = 'y'">y</button>
      <button class="toggle-btn toggle-btn--dy" :class="{ active: activeCurve === 'dy' }" @click="activeCurve = 'dy'">dy/dx</button>
      <button class="toggle-btn toggle-btn--d2y" :class="{ active: activeCurve === 'd2y' }" @click="activeCurve = 'd2y'">d²y/dx²</button>
      <button class="toggle-btn toggle-btn--all" :class="{ active: activeCurve === 'all' }" @click="activeCurve = 'all'">Show All</button>
    </div>

    <!-- Readout -->
    <div class="readout">
      <div class="r-row r-row--y" :class="{ active: activeCurve === 'all' || activeCurve === 'y' }">
        <span class="r-lbl">y = 0.2x³ - 2x</span>
        <span class="r-val">{{ vals.y.toFixed(2) }}</span>
      </div>
      <div class="r-row r-row--dy" :class="{ active: activeCurve === 'all' || activeCurve === 'dy' }">
        <span class="r-lbl">dy/dx = 0.6x² - 2</span>
        <span class="r-val">{{ vals.dy.toFixed(2) }}</span>
      </div>
      <div class="r-row r-row--d2y" :class="{ active: activeCurve === 'all' || activeCurve === 'd2y' }">
        <span class="r-lbl">d²y/dx² = 1.2x</span>
        <span class="r-val">{{ vals.d2y.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 400
const VBH = 260
// Adjust map to fit y = 0.2x^3 - 2x and its derivatives nicely
const MAP: CoordMap = { xMin: -4.5, xMax: 4.5, yMin: -5, yMax: 5, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(1.5)
const activeCurve = ref('all')

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const fY   = (x: number) => 0.2 * x ** 3 - 2 * x
const fDy  = (x: number) => 0.6 * x ** 2 - 2
const fD2y = (x: number) => 1.2 * x

const curveY   = computed(() => fnPath(fY, MAP))
const curveDy  = computed(() => fnPath(fDy, MAP))
const curveD2y = computed(() => fnPath(fD2y, MAP))

const ptY   = computed(() => ms(curX.value, fY(curX.value)))
const ptDy  = computed(() => ms(curX.value, fDy(curX.value)))
const ptD2y = computed(() => ms(curX.value, fD2y(curX.value)))

const vals = computed(() => ({
  y: fY(curX.value),
  dy: fDy(curX.value),
  d2y: fD2y(curX.value)
}))

const xGridLines = [-4, -3, -2, -1, 1, 2, 3, 4]
const yGridLines = [-4, -3, -2, -1, 1, 2, 3, 4]

function updateX(svgX: number) {
  const [mx] = svgToMath(svgX, 0, MAP)
  curX.value = clamp(mx, MAP.xMin, MAP.xMax)
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
.successive-vis {
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
    &--main { stroke-width: 1.2; opacity: 0.7; }
  }

  .fn-curve {
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: opacity 0.3s;

    &.inactive { opacity: 0.1; }

    &--y   { stroke: var(--warm); }
    &--dy  { stroke: var(--accent); }
    &--d2y { stroke: #b18ceb; /* A purple/lilac for the third curve */ }
  }

  .drop-line {
    stroke: var(--text-muted);
    stroke-width: 0.75;
    stroke-dasharray: 3 4;
    opacity: 0.4;
  }

  .pt-outer {
    transition: opacity 0.3s;
    &.inactive { opacity: 0; }
    
    &--y   { fill: var(--warm); }
    &--dy  { fill: var(--accent); }
    &--d2y { fill: #b18ceb; }
  }
}

.ctrl-toggles {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.toggle-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--ff-ui);
  font-size: 0.75rem;
  padding: 0.4em 0.8em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: var(--surface-hi); }
  
  &.active {
    font-weight: 600;
  }

  &--y.active   { background: var(--warm); color: #141920; border-color: var(--warm); }
  &--dy.active  { background: var(--accent); color: #141920; border-color: var(--accent); }
  &--d2y.active { background: #b18ceb; color: #141920; border-color: #b18ceb; }
  &--all.active { background: var(--text); color: #141920; border-color: var(--text); }
}

.readout {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: var(--ff-mono);
  font-size: 0.85rem;
  background: var(--surface-hi);
  padding: 0.75rem;
  border-radius: 6px;
}

.r-row {
  display: flex;
  justify-content: space-between;
  opacity: 0.3;
  transition: opacity 0.3s;

  &.active { opacity: 1; }

  &--y   { color: var(--warm); }
  &--dy  { color: var(--accent); }
  &--d2y { color: #b18ceb; }
}

.r-lbl { font-style: italic; }
.r-val { font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
