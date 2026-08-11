<template>
  <div class="definite-integral-vis">
    <svg
      viewBox="0 0 450 260"
      class="graph-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Grid -->
      <g class="grid">
        <line v-for="gx in 6" :key="`gxd${gx}`" :x1="ms(gx, 0)[0]" y1="0" :x2="ms(gx, 0)[0]" y2="260" />
        <line v-for="gy in 6" :key="`gyd${gy}`" x1="0" :y1="ms(0, gy*5)[1]" x2="450" :y2="ms(0, gy*5)[1]" />
      </g>
      
      <!-- Axes -->
      <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" y2="260" class="axis" />
      <line x1="0" :y1="ms(0,0)[1]" x2="450" :y2="ms(0,0)[1]" class="axis" />
      
      <!-- Filled Area -->
      <polygon :points="areaPoints" class="integral-area" />
      
      <!-- Boundaries a and b -->
      <line :x1="ms(boundA, 0)[0]" :y1="ms(boundA, 0)[1]" :x2="ms(boundA, boundA**2)[0]" :y2="ms(boundA, boundA**2)[1]" class="bound-line" />
      <line :x1="ms(boundB, 0)[0]" :y1="ms(boundB, 0)[1]" :x2="ms(boundB, boundB**2)[0]" :y2="ms(boundB, boundB**2)[1]" class="bound-line" />
      
      <text :x="ms(boundA, 0)[0]" :y="ms(0,0)[1] + 16" class="bound-lbl">a</text>
      <text :x="ms(boundB, 0)[0]" :y="ms(0,0)[1] + 16" class="bound-lbl">b</text>

      <!-- The Curve y = x^2 -->
      <path :d="curvePath" class="fn-curve" />
      
    </svg>

    <div class="controls">
      <div class="ctrl-row">
        <span class="ctrl-lbl">Lower bound (<span class="math-var">a</span>)</span>
        <input type="range" v-model.number="boundA" max="5" min="0" step="0.1" @input="ensureOrder('A')" />
        <span class="ctrl-out">{{ boundA.toFixed(1) }}</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-lbl">Upper bound (<span class="math-var">b</span>)</span>
        <input type="range" v-model.number="boundB" min="0" max="5" step="0.1" @input="ensureOrder('B')" />
        <span class="ctrl-out">{{ boundB.toFixed(1) }}</span>
      </div>
    </div>
    
    <div class="math-readout">
      <div class="eq-line">
        <span class="hi">∫</span><sub class="bound">{{ boundA.toFixed(1) }}</sub><sup class="bound">{{ boundB.toFixed(1) }}</sup> 
        <span class="math-var">x² dx</span> = 
        <span class="bracket">[</span> <span class="math-var">x³ / 3</span> <span class="bracket">]</span><sub class="bound">{{ boundA.toFixed(1) }}</sub><sup class="bound">{{ boundB.toFixed(1) }}</sup>
      </div>
      <div class="eq-line eq-line--sub">
        = ({{ boundB.toFixed(1) }}³ / 3) - ({{ boundA.toFixed(1) }}³ / 3)
      </div>
      <div class="eq-line eq-line--result">
        = <span style="color: var(--warm)">{{ area.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, type CoordMap } from '@/composables/useSVGMath'

const MAP: CoordMap = { xMin: -0.5, xMax: 5.5, yMin: -2, yMax: 28, vbWidth: 450, vbHeight: 260 }

const boundA = ref(1.0)
const boundB = ref(4.0)

function ensureOrder(changed: 'A' | 'B') {
  if (boundA.value >= boundB.value) {
    if (changed === 'A') {
      boundB.value = Math.min(5, boundA.value + 0.1)
      if (boundB.value <= boundA.value) boundA.value = boundB.value - 0.1
    } else {
      boundA.value = Math.max(0, boundB.value - 0.1)
      if (boundA.value >= boundB.value) boundB.value = boundA.value + 0.1
    }
  }
}

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const curvePath = computed(() => fnPath((x) => x ** 2, MAP, 0.1))

const areaPoints = computed(() => {
  let pts = ''
  // Bottom-left corner
  const pStart = ms(boundA.value, 0)
  pts += `${pStart[0]},${pStart[1]} `
  
  // Curve points
  for (let x = boundA.value; x <= boundB.value; x += 0.1) {
    const p = ms(x, x ** 2)
    pts += `${p[0]},${p[1]} `
  }
  // Ensure we hit the exact B bound
  const pTopRight = ms(boundB.value, boundB.value ** 2)
  pts += `${pTopRight[0]},${pTopRight[1]} `
  
  // Bottom-right corner
  const pEnd = ms(boundB.value, 0)
  pts += `${pEnd[0]},${pEnd[1]}`
  
  return pts
})

const area = computed(() => {
  return (boundB.value ** 3) / 3 - (boundA.value ** 3) / 3
})
</script>

<style lang="scss" scoped>
.definite-integral-vis {
  display: flex;
  flex-direction: column;
}

.graph-svg {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 1rem;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);
  overflow: hidden;
}

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
}

.integral-area {
  fill: var(--warm);
  fill-opacity: 0.25;
}

.bound-line {
  stroke: var(--warm);
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
}

.bound-lbl {
  font-family: var(--ff-mono);
  font-size: 13px;
  font-weight: 600;
  fill: var(--warm);
  text-anchor: middle;
}

/* Controls */
.controls {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 500px) {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.ctrl-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.ctrl-lbl {
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.ctrl-out {
  font-family: var(--ff-mono);
  color: var(--text);
  min-width: 3ch;
  text-align: right;
}

/* Readout */
.math-readout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-hi);
  padding: 1.25rem;
  border-radius: 6px;
  font-family: var(--ff-mono);
  font-size: 1.1rem;
}

.eq-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  &--sub {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
  }
  
  &--result {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }
}

.bracket {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--text-muted);
}

.bound {
  font-size: 0.75rem;
  color: var(--accent);
  margin-left: 2px;
}

.math-var {
  font-style: italic;
}
</style>
