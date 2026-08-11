<template>
  <div class="trig-vis">
    <div class="ctrl-bar">
      <button class="btn-toggle" @click="activeFn = 'sin'" :class="{ active: activeFn === 'sin' }">
        y = sin(x)
      </button>
      <button class="btn-toggle" @click="activeFn = 'cos'" :class="{ active: activeFn === 'cos' }">
        y = cos(x)
      </button>
    </div>

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
        <!-- PI grid lines -->
        <line
          v-for="gx in piGridLines"
          :key="`gx${gx}`"
          :x1="ms(gx, 0)[0]" y1="0"
          :x2="ms(gx, 0)[0]" :y2="VBH"
        />
        <!-- Y grid lines -->
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

      <!-- PI Labels -->
      <text :x="ms(Math.PI/2, 0)[0]" :y="ms(0,0)[1] + 16" class="pi-lbl">π/2</text>
      <text :x="ms(Math.PI, 0)[0]" :y="ms(0,0)[1] + 16" class="pi-lbl">π</text>
      <text :x="ms(Math.PI * 1.5, 0)[0]" :y="ms(0,0)[1] + 16" class="pi-lbl">3π/2</text>
      <text :x="ms(Math.PI * 2, 0)[0]" :y="ms(0,0)[1] + 16" class="pi-lbl">2π</text>

      <!-- The Curves -->
      <path :d="curveBase" class="fn-curve fn-curve--base" />
      <path :d="curveDeriv" class="fn-curve fn-curve--deriv" />

      <!-- Drop line linking the points -->
      <line
        :x1="ptBase[0]" :y1="ptBase[1]"
        :x2="ptDeriv[0]" :y2="ptDeriv[1]"
        class="drop-line"
      />
      
      <!-- Base Point Tangent line -->
      <clipPath id="trig-tangent-clip">
        <rect x="0" y="0" :width="VBW" :height="VBH" />
      </clipPath>
      <line
        :x1="tan.x1" :y1="tan.y1"
        :x2="tan.x2" :y2="tan.y2"
        class="tangent-line"
        clip-path="url(#trig-tangent-clip)"
      />

      <!-- Points -->
      <!-- Base curve point -->
      <circle :cx="ptBase[0]" :cy="ptBase[1]" r="5.5" class="pt-outer pt-outer--base" />
      <circle :cx="ptBase[0]" :cy="ptBase[1]" r="2.5" class="pt-inner" />
      
      <!-- Deriv curve point -->
      <circle :cx="ptDeriv[0]" :cy="ptDeriv[1]" r="5.5" class="pt-outer pt-outer--deriv" />
      <circle :cx="ptDeriv[0]" :cy="ptDeriv[1]" r="2.5" class="pt-inner" />
    </svg>

    <div class="readout">
      <div class="r-row">
        <span class="r-title"><span class="math-var">y</span> = {{ activeFn === 'sin' ? 'sin(x)' : 'cos(x)' }}</span>
        <span class="r-val" style="color: var(--warm)">{{ valBase.toFixed(2) }}</span>
      </div>
      <div class="r-row">
        <span class="r-title"><span class="math-var">dy/dx</span> = {{ activeFn === 'sin' ? 'cos(x)' : '-sin(x)' }}</span>
        <span class="r-val" style="color: var(--accent)">{{ valDeriv.toFixed(2) }}</span>
      </div>
    </div>
    
    <div class="desc">
      Notice how the <span style="color: var(--accent); font-weight: 600;">derivative curve</span> crosses zero exactly when the <span style="color: var(--warm); font-weight: 600;">base curve</span> hits a peak or valley (where its slope is flat)!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 450
const VBH = 260
const MAP: CoordMap = { xMin: -0.5, xMax: 7, yMin: -1.5, yMax: 1.5, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(Math.PI / 4)
const activeFn = ref<'sin' | 'cos'>('sin')

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const fBase = (x: number) => activeFn.value === 'sin' ? Math.sin(x) : Math.cos(x)
const fDeriv = (x: number) => activeFn.value === 'sin' ? Math.cos(x) : -Math.sin(x)

const curveBase = computed(() => fnPath(fBase, MAP, 0.1))
const curveDeriv = computed(() => fnPath(fDeriv, MAP, 0.1))

const valBase = computed(() => fBase(curX.value))
const valDeriv = computed(() => fDeriv(curX.value))

const ptBase = computed(() => ms(curX.value, valBase.value))
const ptDeriv = computed(() => ms(curX.value, valDeriv.value))

const tan = computed(() => {
  const x0 = curX.value
  const y0 = valBase.value
  const m = valDeriv.value
  
  const p1_x = x0 - 1.5
  const p1_y = y0 - m * 1.5
  
  const p2_x = x0 + 1.5
  const p2_y = y0 + m * 1.5
  
  const [sx1, sy1] = ms(p1_x, p1_y)
  const [sx2, sy2] = ms(p2_x, p2_y)
  
  return { x1: sx1, y1: sy1, x2: sx2, y2: sy2 }
})

const piGridLines = [Math.PI/2, Math.PI, Math.PI * 1.5, Math.PI * 2]
const yGridLines = [-1, 0, 1]

function updateX(svgX: number) {
  const [mx] = svgToMath(svgX, 0, MAP)
  curX.value = clamp(mx, 0, Math.PI * 2)
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
.trig-vis {
  display: flex;
  flex-direction: column;
}

.ctrl-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-toggle {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--ff-mono);
  font-size: 0.9rem;
  padding: 0.5em 1.2em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover { background: var(--surface-hi); }
  
  &.active {
    background: var(--text);
    color: #141920;
    border-color: var(--text);
    font-weight: 600;
  }
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
  
  .pi-lbl {
    font-family: var(--ff-mono);
    font-size: 11px;
    fill: var(--text-muted);
    text-anchor: middle;
  }

  .fn-curve {
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    
    &--base { stroke: color-mix(in srgb, var(--warm) 70%, white); }
    &--deriv { stroke: color-mix(in srgb, var(--accent) 70%, white); stroke-dasharray: 4 4; opacity: 0.9; }
  }

  .tangent-line {
    stroke: var(--text);
    stroke-width: 1.5;
  }
  
  .drop-line {
    stroke: var(--text-muted);
    stroke-width: 1;
    stroke-dasharray: 2 2;
    opacity: 0.5;
  }
  
  .pt-outer {
    &--base { fill: var(--warm); }
    &--deriv { fill: var(--accent); }
  }
  
  .pt-inner { fill: var(--surface-hi); }
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
    font-size: 0.95rem;
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
