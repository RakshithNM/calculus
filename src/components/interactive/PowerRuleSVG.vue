<template>
  <div class="power-rule">
    <svg
      :viewBox="`0 0 ${VBW} ${VBH}`"
      class="graph"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Grid -->
      <g class="grid">
        <line
          v-for="gx in xGridLines" :key="`gx${gx}`"
          :x1="ms(gx, 0)[0]" y1="0"
          :x2="ms(gx, 0)[0]" :y2="VBH"
        />
        <line
          v-for="gy in yGridLines" :key="`gy${gy}`"
          x1="0" :y1="ms(0, gy)[1]"
          :x2="VBW" :y2="ms(0, gy)[1]"
        />
      </g>

      <!-- Axes -->
      <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" :y2="VBH" class="axis" />
      <line x1="0" :y1="ms(0,0)[1]" :x2="VBW" :y2="ms(0,0)[1]" class="axis" />

      <!-- f(x) = x^n -->
      <path :d="fnCurvePath" class="fn-curve" />

      <!-- f'(x) = n·x^(n-1) -->
      <path :d="derivPath" class="deriv-curve" />

      <!-- Legend chips -->
      <rect x="10" y="8" width="100" height="18" rx="3" class="legend-bg" />
      <text x="18" y="21" class="legend-text warm">f(x) = x{{ supN }}</text>

      <rect x="10" y="30" width="130" height="18" rx="3" class="legend-bg" />
      <text x="18" y="43" class="legend-text accent">f′(x) = {{ derivLabel }}</text>
    </svg>

    <div class="controls">
      <div class="ctrl-row">
        <span class="ctrl-lbl">n =</span>
        <input type="range" v-model.number="n" min="1" max="5" step="1" />
        <span class="ctrl-out">{{ n }}</span>
      </div>
    </div>

    <div class="formula-box">
      <span class="f-orig">{{ origLabel }}</span>
      &nbsp;&nbsp;⟶&nbsp;&nbsp;
      <span class="f-deriv">{{ derivFormula }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, type CoordMap } from '@/composables/useSVGMath'

const VBW = 400
const VBH = 220
const MAP: CoordMap = { xMin: -2.6, xMax: 2.6, yMin: -1, yMax: 12, vbWidth: VBW, vbHeight: VBH }

const n = ref(2)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const fnCurvePath   = computed(() => fnPath((x) => Math.pow(x, n.value), MAP))
const derivPath     = computed(() => fnPath((x) => n.value * Math.pow(x, n.value - 1), MAP))

const supMap: Record<number, string> = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵' }
const supN = computed(() => supMap[n.value])

const origMap: Record<number, string> = {
  1: 'y = x',
  2: 'y = x²',
  3: 'y = x³',
  4: 'y = x⁴',
  5: 'y = x⁵',
}
const derivMap: Record<number, string> = {
  1: 'dy/dx = 1',
  2: 'dy/dx = 2x',
  3: 'dy/dx = 3x²',
  4: 'dy/dx = 4x³',
  5: 'dy/dx = 5x⁴',
}
const derivLegendMap: Record<number, string> = {
  1: '1',
  2: '2x',
  3: '3x²',
  4: '4x³',
  5: '5x⁴',
}

const origLabel   = computed(() => origMap[n.value])
const derivFormula= computed(() => derivMap[n.value])
const derivLabel  = computed(() => derivLegendMap[n.value])

const xGridLines = [-2, -1, 0, 1, 2]
const yGridLines = [0, 2, 4, 6, 8, 10]
</script>

<style lang="scss" scoped>
.graph {
  width: 100%;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);

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
    transition: d 0.35s ease;
  }

  .deriv-curve {
    fill: none;
    stroke: var(--accent);
    stroke-width: 1.5;
    stroke-dasharray: 6 4;
    stroke-linecap: round;
    transition: d 0.35s ease;
  }

  .legend-bg {
    fill: var(--surface);
    opacity: 0.7;
  }

  .legend-text {
    font-family: var(--ff-mono);
    font-size: 11px;
    pointer-events: none;

    &.warm   { fill: var(--warm); }
    &.accent { fill: var(--accent); }
  }
}

.controls {
  margin-top: 1rem;
}

.ctrl-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.ctrl-lbl {
  font-family: var(--ff-mono);
  font-size: 0.82rem;
  color: var(--warm);
  font-style: italic;
  min-width: 2rem;
}

.ctrl-out {
  font-family: var(--ff-mono);
  font-size: 0.82rem;
  color: var(--warm);
  min-width: 1.5ch;
}

.formula-box {
  margin-top: 1rem;
  background: var(--surface-hi);
  border-radius: 7px;
  padding: 0.9rem 1.1rem;
  font-family: var(--ff-prose);
  font-size: 1rem;
  text-align: center;

  .f-orig  { color: var(--text-muted); }
  .f-deriv { color: var(--accent); font-weight: 400; }
}
</style>
