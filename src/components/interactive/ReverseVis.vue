<template>
  <div class="reverse-vis">
    <div class="graphs-container">
      
      <!-- Top Graph: The Derivative (y = 2x) -->
      <div class="graph-box">
        <div class="graph-title">The Derivative: <span class="math-var">y = 2x</span></div>
        <svg viewBox="0 0 300 200" class="graph-svg">
          <g class="grid">
            <line v-for="gx in 6" :key="`gxt${gx}`" :x1="ms(gx, 0)[0]" y1="0" :x2="ms(gx, 0)[0]" y2="200" />
            <line v-for="gy in 12" :key="`gyt${gy}`" x1="0" :y1="ms(0, gy)[1]" x2="300" :y2="ms(0, gy)[1]" />
          </g>
          <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" y2="200" class="axis" />
          <line x1="0" :y1="ms(0,0)[1]" x2="300" :y2="ms(0,0)[1]" class="axis" />
          
          <!-- Area Under Curve -->
          <polygon :points="areaPoints" class="integral-area" />
          
          <!-- Curve -->
          <line :x1="ms(0,0)[0]" :y1="ms(0,0)[1]" :x2="ms(5, 10)[0]" :y2="ms(5, 10)[1]" class="fn-curve deriv-curve" />
          
          <!-- Current point -->
          <line :x1="pt1[0]" :y1="ms(0,0)[1]" :x2="pt1[0]" :y2="pt1[1]" class="val-line val-line--deriv" />
          <circle :cx="pt1[0]" :cy="pt1[1]" r="4" class="pt-deriv" />
          
          <!-- Labels -->
          <text :x="150" :y="180" class="area-lbl">Area = {{ area.toFixed(2) }}</text>
        </svg>
        <div class="r-row">
          <span class="r-lbl">Current Height:</span>
          <span class="r-val" style="color: var(--accent)">{{ (2 * curX).toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- Bottom Graph: The Integral (y = x^2) -->
      <div class="graph-box">
        <div class="graph-title">The Integral: <span class="math-var">y = x²</span></div>
        <svg viewBox="0 0 300 200" class="graph-svg">
          <g class="grid">
            <line v-for="gx in 6" :key="`gxb${gx}`" :x1="ms(gx, 0)[0]" y1="0" :x2="ms(gx, 0)[0]" y2="200" />
            <line v-for="gy in 6" :key="`gyb${gy}`" x1="0" :y1="ms2(0, gy*4)[1]" x2="300" :y2="ms2(0, gy*4)[1]" />
          </g>
          <line :x1="ms2(0,0)[0]" y1="0" :x2="ms2(0,0)[0]" y2="200" class="axis" />
          <line x1="0" :y1="ms2(0,0)[1]" x2="300" :y2="ms2(0,0)[1]" class="axis" />
          
          <!-- Curve -->
          <path :d="curve2" class="fn-curve int-curve" />
          
          <!-- Tangent (Slope) -->
          <clipPath id="rev-tangent-clip">
            <rect x="0" y="0" width="300" height="200" />
          </clipPath>
          <line
            :x1="tan.x1" :y1="tan.y1"
            :x2="tan.x2" :y2="tan.y2"
            class="tangent-line"
            clip-path="url(#rev-tangent-clip)"
          />
          
          <!-- Current point -->
          <line :x1="pt2[0]" :y1="ms2(0,0)[1]" :x2="pt2[0]" :y2="pt2[1]" class="val-line val-line--int" />
          <circle :cx="pt2[0]" :cy="pt2[1]" r="4" class="pt-int" />
          
          <!-- Labels -->
          <text :x="pt2[0] - 8" :y="pt2[1] + (ms2(0,0)[1] - pt2[1])/2" class="height-lbl" transform="rotate(-90)" :style="{ transformOrigin: `${pt2[0] - 8}px ${pt2[1] + (ms2(0,0)[1] - pt2[1])/2}px` }">
            Height = {{ area.toFixed(2) }}
          </text>
        </svg>
        <div class="r-row">
          <span class="r-lbl">Current Slope:</span>
          <span class="r-val" style="color: var(--accent)">{{ (2 * curX).toFixed(2) }}</span>
        </div>
      </div>
      
    </div>
    
    <div class="ctrl-bar">
      <span class="ctrl-lbl"><span class="math-var">x</span> =</span>
      <input type="range" v-model.number="curX" min="0" max="4.8" step="0.05" />
      <span class="ctrl-out">{{ curX.toFixed(2) }}</span>
    </div>
    
    <div class="conclusion">
      The <strong>Area</strong> of the top graph becomes the <strong>Height</strong> of the bottom graph.
      <br>
      The <strong>Height</strong> of the top graph becomes the <strong>Slope</strong> of the bottom graph.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, type CoordMap } from '@/composables/useSVGMath'

// Map 1: 2x
const MAP1: CoordMap = { xMin: -0.5, xMax: 5.5, yMin: -1, yMax: 11, vbWidth: 300, vbHeight: 200 }
// Map 2: x^2
const MAP2: CoordMap = { xMin: -0.5, xMax: 5.5, yMin: -2, yMax: 28, vbWidth: 300, vbHeight: 200 }

const curX = ref(2.5)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP1)
const ms2 = (mx: number, my: number) => mathToSVG(mx, my, MAP2)

const pt1 = computed(() => ms(curX.value, 2 * curX.value))
const pt2 = computed(() => ms2(curX.value, curX.value ** 2))
const area = computed(() => curX.value ** 2)

const areaPoints = computed(() => {
  const p0 = ms(0, 0)
  const px = ms(curX.value, 0)
  const py = ms(curX.value, 2 * curX.value)
  return `${p0[0]},${p0[1]} ${px[0]},${px[1]} ${py[0]},${py[1]}`
})

const curve2 = computed(() => fnPath((x) => x ** 2, MAP2, 0.1))

const tan = computed(() => {
  const x0 = curX.value
  const y0 = x0 ** 2
  const m = 2 * x0
  
  const p1_x = x0 - 2
  const p1_y = y0 - m * 2
  
  const p2_x = x0 + 2
  const p2_y = y0 + m * 2
  
  const [sx1, sy1] = ms2(p1_x, p1_y)
  const [sx2, sy2] = ms2(p2_x, p2_y)
  
  return { x1: sx1, y1: sy1, x2: sx2, y2: sy2 }
})
</script>

<style lang="scss" scoped>
.reverse-vis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.graphs-container {
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.graph-box {
  flex: 1;
  background: var(--surface-hi);
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.graph-title {
  font-family: var(--ff-ui);
  font-size: 0.95rem;
  color: var(--text);
  font-weight: 600;
  text-align: center;
}

.graph-svg {
  width: 100%;
  background: var(--surface);
  border-radius: 4px;
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
  stroke-width: 2.5;
  stroke-linecap: round;
  
  &.deriv-curve { stroke: var(--accent); }
  &.int-curve { stroke: var(--warm); }
}

.integral-area {
  fill: var(--warm);
  fill-opacity: 0.2;
}

.val-line {
  stroke-width: 2;
  stroke-dasharray: 3 3;
  
  &--deriv { stroke: var(--accent); opacity: 0.5; }
  &--int { stroke: var(--warm); }
}

.tangent-line {
  stroke: var(--accent);
  stroke-width: 2;
}

.pt-deriv { fill: var(--accent); }
.pt-int { fill: var(--warm); }

.area-lbl, .height-lbl {
  font-family: var(--ff-mono);
  font-size: 11px;
  font-weight: 600;
  fill: var(--warm);
}

.area-lbl { text-anchor: middle; }
.height-lbl { text-anchor: middle; }

.r-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--surface);
  border-radius: 4px;
  
  .r-lbl { font-family: var(--ff-ui); font-size: 0.85rem; color: var(--text-muted); }
  .r-val { font-family: var(--ff-mono); font-weight: 600; font-variant-numeric: tabular-nums; }
}

.ctrl-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--surface-hi);
  padding: 1rem 1.5rem;
  border-radius: 6px;
  
  input { flex: 1; }
  
  .ctrl-lbl, .ctrl-out { font-family: var(--ff-mono); color: var(--text); }
  .ctrl-out { min-width: 3ch; text-align: right; }
}

.math-var { font-family: var(--ff-mono); font-style: italic; }

.conclusion {
  text-align: center;
  font-family: var(--ff-ui);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  
  strong { color: var(--text); }
}
</style>
