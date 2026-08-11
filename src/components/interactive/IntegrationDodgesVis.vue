<template>
  <div class="integration-dodges-vis">
    <svg
      viewBox="0 0 400 300"
      class="graph-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Grid -->
      <g class="grid">
        <line v-for="gx in 5" :key="`gxd${gx}`" :x1="ms(gx, 0)[0]" y1="0" :x2="ms(gx, 0)[0]" y2="300" />
        <line v-for="gy in 5" :key="`gyd${gy}`" x1="0" :y1="ms(0, gy*4)[1]" x2="400" :y2="ms(0, gy*4)[1]" />
      </g>
      
      <!-- Axes -->
      <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" y2="300" class="axis" />
      <line x1="0" :y1="ms(0,0)[1]" x2="400" :y2="ms(0,0)[1]" class="axis" />
      
      <!-- Areas -->
      <!-- Area under curve (int v du) -->
      <polygon :points="areaUDVPoints" class="area-u-dv" />
      <!-- Area left of curve (int u dv) -->
      <polygon :points="areaVDUPoints" class="area-v-du" />
      
      <!-- The Curve v = u^2 -->
      <path :d="curvePath" class="fn-curve" />
      
      <!-- The Rectangle uv -->
      <rect 
        :x="ms(0,0)[0]" 
        :y="ms(uVal, vVal)[1]" 
        :width="ms(uVal, 0)[0] - ms(0,0)[0]" 
        :height="ms(0,0)[1] - ms(uVal, vVal)[1]" 
        class="uv-rect"
      />
      
      <!-- Labels -->
      <text :x="ms(uVal, 0)[0]" :y="ms(0,0)[1] + 16" class="lbl-u">u = {{ uVal.toFixed(1) }}</text>
      <text :x="ms(0,0)[0] - 8" :y="ms(uVal, vVal)[1] + 4" class="lbl-v" text-anchor="end">v = {{ vVal.toFixed(1) }}</text>

      <!-- Point (u,v) -->
      <circle :cx="ms(uVal, vVal)[0]" :cy="ms(uVal, vVal)[1]" r="5" class="pt-uv" />
      
    </svg>

    <div class="controls">
      <div class="ctrl-row">
        <span class="ctrl-lbl">Drag Point (<span class="math-var">u</span>)</span>
        <input type="range" v-model.number="uVal" min="0" max="4" step="0.1" />
      </div>
    </div>
    
    <div class="math-readout">
      <div class="r-row">
        <div class="r-title" style="color: var(--accent)">
          <span class="hi">∫</span><span class="math-var">u dv</span> (Teal Area)
        </div>
        <div class="r-val">{{ intUDv.toFixed(2) }}</div>
      </div>
      <div class="r-row">
        <div class="r-title" style="color: var(--warm)">
          <span class="hi">∫</span><span class="math-var">v du</span> (Amber Area)
        </div>
        <div class="r-val">{{ intVDu.toFixed(2) }}</div>
      </div>
      <div class="r-divider"></div>
      <div class="r-row r-total">
        <div class="r-title">
          <span class="math-var">u × v</span> (Total Rectangle)
        </div>
        <div class="r-val">{{ (uVal * vVal).toFixed(2) }}</div>
      </div>
      
      <div class="formula">
        Integration by Parts: 
        <br>
        <span style="color: var(--accent)">∫ u dv</span> = uv - <span style="color: var(--warm)">∫ v du</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, type CoordMap } from '@/composables/useSVGMath'

const MAP: CoordMap = { xMin: -0.5, xMax: 4.5, yMin: -2, yMax: 18, vbWidth: 400, vbHeight: 300 }

const uVal = ref(3.0)
const vVal = computed(() => uVal.value ** 2)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const curvePath = computed(() => fnPath((u) => u ** 2, MAP, 0.1))

const areaVDUPoints = computed(() => {
  // Amber area: under the curve (integral of v wrt u)
  let pts = ''
  const pStart = ms(0, 0)
  pts += `${pStart[0]},${pStart[1]} `
  
  for (let u = 0; u <= uVal.value; u += 0.1) {
    const p = ms(u, u ** 2)
    pts += `${p[0]},${p[1]} `
  }
  const pTopRight = ms(uVal.value, uVal.value ** 2)
  pts += `${pTopRight[0]},${pTopRight[1]} `
  
  const pBottomRight = ms(uVal.value, 0)
  pts += `${pBottomRight[0]},${pBottomRight[1]}`
  
  return pts
})

const areaUDVPoints = computed(() => {
  // Teal area: left of the curve (integral of u wrt v)
  let pts = ''
  const pStart = ms(0, 0)
  pts += `${pStart[0]},${pStart[1]} `
  
  // Go up the y-axis
  const pTopLeft = ms(0, vVal.value)
  pts += `${pTopLeft[0]},${pTopLeft[1]} `
  
  // Go right to the point
  const pTopRight = ms(uVal.value, vVal.value)
  pts += `${pTopRight[0]},${pTopRight[1]} `
  
  // Follow curve back to 0
  for (let u = uVal.value; u >= 0; u -= 0.1) {
    const p = ms(u, u ** 2)
    pts += `${p[0]},${p[1]} `
  }
  
  return pts
})

// Calculations for exact area readouts
const intVDu = computed(() => (uVal.value ** 3) / 3) // Integral of u^2 du
const intUDv = computed(() => (2/3) * (uVal.value ** 3)) // Integral of u dv where v = u^2 -> dv = 2u du -> int(2u^2 du)
</script>

<style lang="scss" scoped>
.integration-dodges-vis {
  display: flex;
  flex-direction: column;
}

.graph-svg {
  width: 100%;
  max-width: 450px;
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

.area-v-du {
  fill: var(--warm);
  fill-opacity: 0.3;
}

.area-u-dv {
  fill: var(--accent);
  fill-opacity: 0.3;
}

.uv-rect {
  fill: none;
  stroke: var(--text);
  stroke-width: 2;
  stroke-dasharray: 4 4;
}

.pt-uv {
  fill: var(--text);
}

.lbl-u, .lbl-v {
  font-family: var(--ff-mono);
  font-size: 13px;
  font-weight: 600;
  fill: var(--text);
}

.lbl-u { text-anchor: middle; }

/* Controls */
.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.ctrl-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

.ctrl-lbl {
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  color: var(--text-muted);
  white-space: nowrap;
}

input[type="range"] { flex: 1; }

/* Readout */
.math-readout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-hi);
  padding: 1.25rem 2rem;
  border-radius: 6px;
  font-family: var(--ff-mono);
}

.r-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.r-title {
  font-weight: 600;
}

.r-val {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.r-divider {
  height: 1px;
  background: var(--border);
  margin: 0.5rem 0;
}

.r-total {
  font-size: 1.25rem;
  color: var(--text);
}

.formula {
  margin-top: 1rem;
  text-align: center;
  font-family: var(--ff-ui);
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.5;
  font-weight: 500;
}

.math-var { font-style: italic; }
.hi { font-style: normal; }
</style>
