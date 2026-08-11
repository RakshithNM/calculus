<template>
  <div class="diff-eq-vis">
    <div class="ctrl-bar">
      <button 
        v-for="eq in equations" 
        :key="eq.id"
        class="btn-toggle" 
        :class="{ active: activeEqId === eq.id }"
        @click="selectEq(eq.id)"
      >
        <span class="math-var">dy/dx</span> = {{ eq.label }}
      </button>
    </div>

    <svg
      ref="svgEl"
      viewBox="0 0 400 400"
      class="graph-svg"
      preserveAspectRatio="xMidYMid meet"
      @mousedown="onMouseDown"
    >
      <!-- Axes -->
      <line :x1="ms(0,-5)[0]" :y1="ms(0,-5)[1]" :x2="ms(0,5)[0]" :y2="ms(0,5)[1]" class="axis" />
      <line :x1="ms(-5,0)[0]" :y1="ms(-5,0)[1]" :x2="ms(5,0)[0]" :y2="ms(5,0)[1]" class="axis" />
      
      <!-- Slope Field -->
      <g class="slope-field">
        <line
          v-for="(seg, i) in slopeSegments"
          :key="`s${i}`"
          :x1="seg.x1" :y1="seg.y1" :x2="seg.x2" :y2="seg.y2"
          class="slope-line"
        />
      </g>
      
      <!-- Solution Curves -->
      <g class="solution-curves">
        <path
          v-for="(path, i) in solutionPaths"
          :key="`p${i}`"
          :d="path.d"
          class="sol-path"
        />
        <!-- Initial condition dots -->
        <circle
          v-for="(pt, i) in initialConditions"
          :key="`pt${i}`"
          :cx="ms(pt.x, pt.y)[0]"
          :cy="ms(pt.x, pt.y)[1]"
          r="4"
          class="sol-dot"
        />
      </g>

      <!-- Click hint -->
      <text v-if="initialConditions.length === 0" x="200" y="380" class="click-hint">
        Click anywhere to drop a solution curve!
      </text>
    </svg>

    <div class="readout">
      <div class="r-row">
        <span>Differential Equation:</span>
        <span style="color: var(--warm); font-weight: 600;">
          <span class="math-var">dy/dx</span> = {{ activeEq.label }}
        </span>
      </div>
      <div class="r-row r-sub">
        <span style="color: var(--text-muted)">General Solution:</span>
        <span style="color: var(--accent); font-weight: 600;">{{ activeEq.solutionLabel }}</span>
      </div>
    </div>
    <div class="desc">
      A <strong>Slope Field</strong> shows what the derivative is at every point in space. By picking an initial starting point and just following the slopes, you trace out the solution to the differential equation!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mathToSVG, svgToMath, screenToSVG, type CoordMap } from '@/composables/useSVGMath'

const MAP: CoordMap = { xMin: -5, xMax: 5, yMin: -5, yMax: 5, vbWidth: 400, vbHeight: 400 }
const ms = (mx: number, my: number) => mathToSVG(mx, my, MAP)

const svgEl = ref<SVGSVGElement | null>(null)

type Equation = {
  id: string
  label: string
  solutionLabel: string
  fn: (x: number, y: number) => number
}

const equations: Equation[] = [
  { id: 'exp', label: 'y', solutionLabel: 'y = C·e^x', fn: (x, y) => y },
  { id: 'sin', label: 'sin(x)', solutionLabel: 'y = -cos(x) + C', fn: (x, y) => Math.sin(x) },
  { id: 'circle', label: '-x / y', solutionLabel: 'x² + y² = C', fn: (x, y) => -x / (y === 0 ? 0.001 : y) }
]

const activeEqId = ref('exp')
const activeEq = computed(() => equations.find(e => e.id === activeEqId.value)!)

const initialConditions = ref<{x: number, y: number}[]>([])

function selectEq(id: string) {
  activeEqId.value = id
  initialConditions.value = [] // Clear previous curves when switching equations
}

// Generate the slope field
const slopeSegments = computed(() => {
  const segments = []
  const step = 0.5
  const lineLen = 0.15 // length in math units
  
  for (let x = -5; x <= 5; x += step) {
    for (let y = -5; y <= 5; y += step) {
      let slope = activeEq.value.fn(x, y)
      // Clamp slope for drawing stability
      if (slope > 20) slope = 20
      if (slope < -20) slope = -20
      
      const angle = Math.atan(slope)
      const dx = Math.cos(angle) * lineLen
      const dy = Math.sin(angle) * lineLen
      
      const p1 = ms(x - dx, y - dy)
      const p2 = ms(x + dx, y + dy)
      
      segments.push({ x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] })
    }
  }
  return segments
})

// Generate solution curves using Euler's method
const solutionPaths = computed(() => {
  return initialConditions.value.map(startPt => {
    let ptsFwd = []
    let ptsBack = []
    const stepSize = 0.05
    const maxSteps = 200
    
    // Forward
    let currX = startPt.x
    let currY = startPt.y
    for (let i = 0; i < maxSteps; i++) {
      if (currX > 5 || currY > 10 || currY < -10) break
      ptsFwd.push(ms(currX, currY))
      const slope = activeEq.value.fn(currX, currY)
      currX += stepSize
      currY += slope * stepSize
    }
    
    // Backward
    currX = startPt.x
    currY = startPt.y
    for (let i = 0; i < maxSteps; i++) {
      if (currX < -5 || currY > 10 || currY < -10) break
      ptsBack.unshift(ms(currX, currY)) // add to front
      const slope = activeEq.value.fn(currX, currY)
      currX -= stepSize
      currY -= slope * stepSize
    }
    
    const allPts = [...ptsBack, ...ptsFwd]
    if (allPts.length === 0) return { d: '' }
    
    let d = `M ${allPts[0][0]} ${allPts[0][1]}`
    for (let i = 1; i < allPts.length; i++) {
      d += ` L ${allPts[i][0]} ${allPts[i][1]}`
    }
    
    return { d }
  })
})

function onMouseDown(e: MouseEvent) {
  if (!svgEl.value) return
  const [sx, sy] = screenToSVG(e, svgEl.value, 400, 400)
  const [mx, my] = svgToMath(sx, sy, MAP)
  initialConditions.value.push({ x: mx, y: my })
}
</script>

<style lang="scss" scoped>
.diff-eq-vis {
  display: flex;
  flex-direction: column;
}

.ctrl-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-toggle {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--ff-mono);
  font-size: 0.85rem;
  padding: 0.4em 1em;
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

.graph-svg {
  width: 100%;
  max-width: 450px;
  margin: 0 auto 1rem;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);
  cursor: crosshair;
}

.axis {
  stroke: var(--text-muted);
  stroke-width: 1;
  opacity: 0.35;
}

.slope-line {
  stroke: var(--text-muted);
  stroke-width: 1.5;
  stroke-linecap: round;
  opacity: 0.6;
}

.sol-path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sol-dot {
  fill: var(--warm);
}

.click-hint {
  font-family: var(--ff-ui);
  font-size: 13px;
  fill: var(--warm);
  text-anchor: middle;
  opacity: 0.8;
  pointer-events: none;
}

/* Readout */
.readout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-hi);
  padding: 1rem 1.5rem;
  border-radius: 6px;
  font-family: var(--ff-ui);
  margin-bottom: 1rem;
}

.r-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  
  &.r-sub {
    font-size: 0.95rem;
  }
}

.math-var { font-family: var(--ff-mono); font-style: italic; }

.desc {
  text-align: center;
  font-family: var(--ff-ui);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
