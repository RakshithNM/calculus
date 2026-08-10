<template>
  <div class="riemann-sum">
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

      <!-- Riemann rectangles -->
      <rect
        v-for="r in rects"
        :key="r.i"
        :x="r.x" :y="r.y"
        :width="r.w" :height="r.h"
        class="riemann-rect"
      />
      <!-- Rect outlines separate for crisp edges -->
      <rect
        v-for="r in rects"
        :key="`s${r.i}`"
        :x="r.x" :y="r.y"
        :width="r.w" :height="r.h"
        class="riemann-stroke"
      />

      <!-- Curve on top -->
      <path :d="curvePath" class="fn-curve" />

      <!-- Integration limits marks -->
      <line :x1="ms(0, 0)[0]" :y1="ms(0,0)[1]" :x2="ms(0,0)[0]" :y2="ms(0,0)[1] + 8" class="limit-tick" />
      <line :x1="ms(2, 0)[0]" :y1="ms(2,0)[1]" :x2="ms(2,0)[0]" :y2="ms(2,0)[1] + 8" class="limit-tick" />
      <text :x="ms(0,0)[0] - 2" :y="ms(0,0)[1] + 18" class="limit-label">0</text>
      <text :x="ms(2,0)[0] - 2" :y="ms(2,0)[1] + 18" class="limit-label">2</text>
    </svg>

    <div class="controls">
      <div class="ctrl-row">
        <span class="ctrl-lbl">n =</span>
        <input type="range" v-model.number="n" min="1" max="120" />
        <span class="ctrl-out">{{ n }}</span>
      </div>
    </div>

    <div class="readout">
      <span class="r-item">
        Approx. area = <em>{{ approxArea.toFixed(4) }}</em>
      </span>
      <span class="r-item">
        Exact (8/3) = <em style="color:var(--text-muted);font-weight:400">2.6667</em>
      </span>
      <span class="r-item">
        Error = <em :class="{ small: approxArea > 2.6 }">{{ error.toFixed(4) }}</em>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, type CoordMap } from '@/composables/useSVGMath'

const VBW = 400
const VBH = 210
const MAP: CoordMap = { xMin: -0.15, xMax: 2.4, yMin: -0.2, yMax: 4.6, vbWidth: VBW, vbHeight: VBH }

const n = ref(6)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const f = (x: number) => x * x

const curvePath = computed(() => fnPath(f, MAP))

interface Rect { i: number; x: number; y: number; w: number; h: number }

const rects = computed<Rect[]>(() => {
  const a = 0, b = 2
  const dx = (b - a) / n.value
  const [, y0] = ms(0, 0)
  const out: Rect[] = []

  for (let i = 0; i < n.value; i++) {
    const xi   = a + i * dx
    const xmid = xi + dx / 2
    const yi   = f(xmid)

    const [rx]  = ms(xi, 0)
    const [rx2] = ms(xi + dx, 0)
    const [, ry] = ms(0, yi)
    const rectH = y0 - ry

    out.push({ i, x: rx, y: ry, w: rx2 - rx, h: rectH })
  }
  return out
})

const approxArea = computed(() => {
  const a = 0, b = 2
  const dx = (b - a) / n.value
  let total = 0
  for (let i = 0; i < n.value; i++) {
    const xmid = a + i * dx + dx / 2
    total += f(xmid) * dx
  }
  return total
})

const error = computed(() => Math.abs(approxArea.value - 8 / 3))

const xGridLines = [0, 1, 2]
const yGridLines = [0, 1, 2, 3, 4]
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

  .riemann-rect {
    fill: var(--accent);
    opacity: 0.18;
  }

  .riemann-stroke {
    fill: none;
    stroke: var(--accent);
    stroke-width: 0.8;
    opacity: 0.55;
  }

  .fn-curve {
    fill: none;
    stroke: var(--warm);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .limit-tick {
    stroke: var(--text-muted);
    stroke-width: 1;
    opacity: 0.5;
  }

  .limit-label {
    font-family: var(--ff-mono);
    font-size: 11px;
    fill: var(--text-muted);
    text-anchor: middle;
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
  min-width: 3ch;
  text-align: right;
}

.readout {
  margin-top: 1rem;
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  font-family: var(--ff-ui);
  font-size: 0.78rem;
  color: var(--text-muted);
}

.r-item {
  em {
    color: var(--accent);
    font-style: normal;
    font-weight: 600;
    font-variant-numeric: tabular-nums;

    &.small {
      color: #6db96d;
    }
  }
}
</style>
