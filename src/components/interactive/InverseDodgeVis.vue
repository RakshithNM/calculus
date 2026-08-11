<template>
  <div class="inverse-dodge-vis">
    <div class="ctrl-bar">
      <button class="btn-flip" @click="toggleFlip" :class="{ flipped: isFlipped }">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
        Swap Axes (Invert)
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
        <line
          v-for="gx in 6"
          :key="`gx${gx}`"
          :x1="ms(gx, 0)[0]" y1="0"
          :x2="ms(gx, 0)[0]" :y2="VBH"
        />
        <line
          v-for="gy in 8"
          :key="`gy${gy}`"
          x1="0" :y1="ms(0, gy)[1]"
          :x2="VBW" :y2="ms(0, gy)[1]"
        />
      </g>

      <!-- Axes -->
      <line :x1="ms(0,0)[0]" y1="0" :x2="ms(0,0)[0]" :y2="VBH" class="axis" />
      <line x1="0" :y1="ms(0,0)[1]" :x2="VBW" :y2="ms(0,0)[1]" class="axis" />

      <!-- Axis Labels -->
      <text :x="ms(6, 0)[0] - 15" :y="ms(0, 0)[1] + 15" class="axis-label">{{ isFlipped ? 'y-axis' : 'x-axis' }}</text>
      <text :x="ms(0, 0)[0] + 5" :y="ms(0, 8)[1] + 15" class="axis-label">{{ isFlipped ? 'x-axis' : 'y-axis' }}</text>

      <!-- The Curve -->
      <path :d="curvePath" class="fn-curve" :class="{ 'curve-flipped': isFlipped }" />

      <!-- Tangent line -->
      <clipPath id="inv-tangent-clip">
        <rect x="0" y="0" :width="VBW" :height="VBH" />
      </clipPath>
      <line
        :x1="tan.x1" :y1="tan.y1"
        :x2="tan.x2" :y2="tan.y2"
        class="tangent-line"
        clip-path="url(#inv-tangent-clip)"
      />

      <!-- Slope Triangle -->
      <path :d="trianglePath" class="slope-triangle" />
      
      <!-- Triangle Labels -->
      <text :x="triLabelX.cx" :y="triLabelX.cy" class="tri-label tri-label--dx">{{ isFlipped ? 'dy' : 'dx' }} = 1</text>
      <text :x="triLabelY.cx" :y="triLabelY.cy" class="tri-label tri-label--dy">{{ isFlipped ? 'dx' : 'dy' }} = {{ (isFlipped ? 1/slope : slope).toFixed(2) }}</text>

      <!-- Point on curve -->
      <circle :cx="ptSVG[0]" :cy="ptSVG[1]" r="7" class="pt-glow" />
      <circle :cx="ptSVG[0]" :cy="ptSVG[1]" r="4.5" class="pt-outer" />
      <circle :cx="ptSVG[0]" :cy="ptSVG[1]" r="2" class="pt-inner" />
    </svg>

    <div class="readout" :class="{ 'is-flipped': isFlipped }">
      <div class="readout-box readout-box--standard">
        <div class="r-title">Standard View</div>
        <div class="r-val"><span class="math-var">dy/dx</span> = {{ slope.toFixed(2) }}</div>
      </div>
      <div class="readout-box readout-box--inverse">
        <div class="r-title">Inverted View</div>
        <div class="r-val"><span class="math-var">dx/dy</span> = {{ (1/slope).toFixed(2) }}</div>
      </div>
    </div>
    
    <div class="conclusion">
      <span class="math-var">dy/dx</span> = <span class="math-var">1 / (dx/dy)</span> 
      <br/>
      <span class="c-val">{{ slope.toFixed(2) }} = 1 / {{ (1/slope).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, fnPath, svgToMath, screenToSVG, clamp, type CoordMap } from '@/composables/useSVGMath'

const VBW = 400
const VBH = 260
const MAP: CoordMap = { xMin: -0.5, xMax: 6.5, yMin: -0.5, yMax: 8.5, vbWidth: VBW, vbHeight: VBH }

const svgEl = ref<SVGSVGElement | null>(null)
const curX  = ref(2.0)
const isFlipped = ref(false)

const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

// f(x) = 0.5 * x^2 + 1
const fY  = (x: number) => 0.5 * x ** 2 + 1
const fDy = (x: number) => x

const slope = computed(() => fDy(curX.value))

// When flipped, we swap x and y coordinates for plotting
const mapCoords = (x: number, y: number) => {
  if (isFlipped.value) return [y, x]
  return [x, y]
}

const curvePath = computed(() => {
  let path = ''
  for (let x = 0; x <= 6; x += 0.1) {
    const y = fY(x)
    const [px, py] = mapCoords(x, y)
    const [sx, sy] = ms(px, py)
    if (x === 0) path += `M ${sx} ${sy}`
    else path += ` L ${sx} ${sy}`
  }
  return path
})

const ptSVG = computed(() => {
  const [px, py] = mapCoords(curX.value, fY(curX.value))
  return ms(px, py)
})

const tan = computed(() => {
  const x0 = curX.value
  const y0 = fY(x0)
  const m = slope.value
  
  // Tangent line equation: y - y0 = m(x - x0)
  // Two points on the tangent line:
  const p1_x = x0 - 4
  const p1_y = y0 - m * 4
  
  const p2_x = x0 + 4
  const p2_y = y0 + m * 4
  
  const [px1, py1] = mapCoords(p1_x, p1_y)
  const [px2, py2] = mapCoords(p2_x, p2_y)
  
  const [sx1, sy1] = ms(px1, py1)
  const [sx2, sy2] = ms(px2, py2)
  
  return { x1: sx1, y1: sy1, x2: sx2, y2: sy2 }
})

// Triangle showing dx=1 and dy=slope (or swapped)
const trianglePath = computed(() => {
  const x0 = curX.value
  const y0 = fY(x0)
  
  const x1 = x0 + 1
  const y1 = y0
  
  const x2 = x0 + 1
  const y2 = y0 + slope.value
  
  const [px0, py0] = mapCoords(x0, y0)
  const [px1, py1] = mapCoords(x1, y1)
  const [px2, py2] = mapCoords(x2, y2)
  
  const [sx0, sy0] = ms(px0, py0)
  const [sx1, sy1] = ms(px1, py1)
  const [sx2, sy2] = ms(px2, py2)
  
  return `M ${sx0} ${sy0} L ${sx1} ${sy1} L ${sx2} ${sy2} Z`
})

const triLabelX = computed(() => {
  const x0 = curX.value
  const y0 = fY(x0)
  const [px, py] = mapCoords(x0 + 0.5, y0 - 0.2)
  const [sx, sy] = ms(px, py)
  return { cx: sx, cy: sy }
})

const triLabelY = computed(() => {
  const x0 = curX.value
  const y0 = fY(x0)
  const [px, py] = mapCoords(x0 + 1.1, y0 + slope.value / 2)
  const [sx, sy] = ms(px, py)
  return { cx: sx, cy: sy }
})

function toggleFlip() {
  isFlipped.value = !isFlipped.value
}

function updateX(svgX: number, svgY: number) {
  const [mx, my] = svgToMath(svgX, svgY, MAP)
  if (isFlipped.value) {
    // We dragged on the y-axis (which is now horizontal)
    // We need to find the corresponding x for this y
    // y = 0.5 * x^2 + 1  =>  x = sqrt((y - 1) * 2)
    if (mx >= 1) {
      curX.value = clamp(Math.sqrt((mx - 1) * 2), 0.1, 3.8)
    }
  } else {
    curX.value = clamp(mx, 0.1, 3.8)
  }
}

function onMouseMove(e: MouseEvent) {
  if (!svgEl.value) return
  if (e.buttons !== 1) return // only on drag for this one to prevent erratic jumping, or just hover? Hover is fine.
  const [sx, sy] = screenToSVG(e, svgEl.value, VBW, VBH)
  updateX(sx, sy)
}

function onTouchMove(e: TouchEvent) {
  if (!svgEl.value) return
  const [sx, sy] = screenToSVG(e, svgEl.value, VBW, VBH)
  updateX(sx, sy)
}
</script>

<style lang="scss" scoped>
.inverse-dodge-vis {
  display: flex;
  flex-direction: column;
}

.ctrl-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
}

.btn-flip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--ff-ui);
  font-size: 0.8rem;
  padding: 0.5em 1em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  svg {
    transition: transform 0.4s ease;
  }
  
  &:hover { background: var(--surface-hi); color: var(--text); }
  
  &.flipped {
    background: var(--accent);
    color: #141920;
    border-color: var(--accent);
    
    svg {
      transform: rotate(180deg);
    }
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
  
  .axis-label {
    fill: var(--text-muted);
    font-family: var(--ff-ui);
    font-size: 11px;
    font-weight: 600;
  }

  .fn-curve {
    fill: none;
    stroke: var(--warm);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: d 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.curve-flipped {
      stroke: var(--accent);
    }
  }

  .tangent-line {
    stroke: var(--text);
    stroke-width: 1.5;
    stroke-dasharray: 5 4;
    transition: x1 0.4s, y1 0.4s, x2 0.4s, y2 0.4s;
  }
  
  .slope-triangle {
    fill: var(--accent);
    fill-opacity: 0.15;
    stroke: var(--accent);
    stroke-width: 1.5;
    stroke-dasharray: 2 2;
    transition: d 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .tri-label {
    font-family: var(--ff-mono);
    font-size: 11px;
    fill: var(--text);
    text-anchor: middle;
    transition: x 0.4s, y 0.4s;
    
    &--dx { fill: var(--warm); }
    &--dy { fill: var(--accent); }
  }

  .pt-glow   { fill: var(--text); opacity: 0.15; transition: cx 0.4s, cy 0.4s; }
  .pt-outer  { fill: var(--text); transition: cx 0.4s, cy 0.4s; }
  .pt-inner  { fill: var(--surface-hi); transition: cx 0.4s, cy 0.4s; }
}

.readout {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
}

.readout-box {
  flex: 1;
  background: var(--surface-hi);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all 0.3s;
  
  .r-title {
    font-family: var(--ff-ui);
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
  }
  
  .r-val {
    font-family: var(--ff-mono);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
}

.readout:not(.is-flipped) .readout-box--standard {
  border-color: var(--warm);
  background: color-mix(in srgb, var(--warm) 8%, var(--surface-hi));
}

.readout.is-flipped .readout-box--inverse {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, var(--surface-hi));
}

.math-var {
  font-family: var(--ff-mono);
  font-style: italic;
}

.conclusion {
  text-align: center;
  font-family: var(--ff-mono);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  
  .c-val {
    color: var(--text);
    font-weight: 600;
  }
}
</style>
