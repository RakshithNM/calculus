<template>
  <div class="partial-vis">
    <div class="ctrl-toggles">
      <button class="btn-toggle" @click="activeMode = 'r'" :class="{ active: activeMode === 'r' }">
        Vary Radius (<span class="math-var">dr</span>)
      </button>
      <button class="btn-toggle" @click="activeMode = 'h'" :class="{ active: activeMode === 'h' }">
        Vary Height (<span class="math-var">dh</span>)
      </button>
    </div>

    <svg
      viewBox="0 0 520 300"
      class="cylinder-view"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Base Cylinder -->
      <g class="cyl-base">
        <!-- Body -->
        <path :d="cylBodyBase" class="cyl-body" />
        <!-- Top Face -->
        <ellipse :cx="cx" :cy="topYBase" :rx="rxBase" :ry="ryBase" class="cyl-top" />
        <!-- Bottom Edge -->
        <path :d="cylBottomEdgeBase" class="cyl-edge" />
      </g>

      <!-- Variation: Vary Height (Slice on top) -->
      <g v-if="activeMode === 'h'" class="cyl-variation cyl-variation--h">
        <!-- Body of slice -->
        <path :d="sliceBody" class="var-body" />
        <!-- Top Face of slice -->
        <ellipse :cx="cx" :cy="topYVar" :rx="rxBase" :ry="ryBase" class="var-top" />
        <!-- Label for slice -->
        <line :x1="cx + rxBase + 10" :y1="topYVar + dh/2" :x2="cx + rxBase + 50" :y2="topYVar - 20" class="var-pointer" />
        <text :x="cx + rxBase + 55" :y="topYVar - 22" class="var-label">
          dV = (πr²)·dh
        </text>
        <text :x="cx + rxBase + 55" :y="topYVar - 6" class="var-sublabel">
          Base Area × dh
        </text>
      </g>

      <!-- Variation: Vary Radius (Shell around) -->
      <g v-if="activeMode === 'r'" class="cyl-variation cyl-variation--r">
        <!-- Body of shell (left and right parts to not obscure the center completely, or just semi-transparent) -->
        <path :d="shellBody" class="var-body" />
        <!-- Top Face of shell -->
        <path :d="shellTop" class="var-top" />
        <!-- Label for shell -->
        <line :x1="cx + rxVar" :y1="topYBase + h/2" :x2="cx + rxVar + 40" :y2="topYBase + h/2 + 20" class="var-pointer" />
        <text :x="cx + rxVar + 45" :y="topYBase + h/2 + 24" class="var-label">
          dV = (2πrh)·dr
        </text>
        <text :x="cx + rxVar + 45" :y="topYBase + h/2 + 40" class="var-sublabel">
          Circumference × h × dr
        </text>
      </g>

      <!-- Dimensions -->
      <!-- Height marker -->
      <line :x1="cx - rxVar - 20" :y1="topYBase" :x2="cx - rxVar - 20" :y2="bottomY" class="dim-line" />
      <line :x1="cx - rxVar - 25" :y1="topYBase" :x2="cx - rxVar - 15" :y2="topYBase" class="dim-tick" />
      <line :x1="cx - rxVar - 25" :y1="bottomY" :x2="cx - rxVar - 15" :y2="bottomY" class="dim-tick" />
      <text :x="cx - rxVar - 30" :y="topYBase + h/2 + 4" class="dim-text" text-anchor="end">h</text>

      <!-- Radius marker -->
      <line :x1="cx" :y1="bottomY" :x2="cx + rxBase" :y2="bottomY" class="dim-line" />
      <circle :cx="cx" :cy="bottomY" r="2" class="dim-dot" />
      <line :x1="cx + rxBase" :y1="bottomY - 5" :x2="cx + rxBase" :y2="bottomY + 5" class="dim-tick" />
      <text :x="cx + rxBase/2" :y="bottomY - 8" class="dim-text" text-anchor="middle">r</text>
    </svg>

    <div class="controls">
      <div class="ctrl-row">
        <span class="ctrl-lbl">Radius (<span class="math-var">r</span>)</span>
        <input type="range" v-model.number="baseR" min="20" max="80" step="1" />
      </div>
      <div class="ctrl-row">
        <span class="ctrl-lbl">Height (<span class="math-var">h</span>)</span>
        <input type="range" v-model.number="baseH" min="50" max="150" step="1" />
      </div>
    </div>
    
    <div class="readout">
      <div class="r-row" :class="{ 'active': activeMode === 'r' }">
        <span class="r-title">Partial wrt <span class="math-var">r</span> (treat <span class="math-var">h</span> as const)</span>
        <span class="r-val">∂V/∂r = 2πrh</span>
      </div>
      <div class="r-row" :class="{ 'active': activeMode === 'h' }">
        <span class="r-title">Partial wrt <span class="math-var">h</span> (treat <span class="math-var">r</span> as const)</span>
        <span class="r-val">∂V/∂h = πr²</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeMode = ref<'r' | 'h'>('r')

const baseR = ref(50)
const baseH = ref(100)

const cx = 220
const bottomY = 220

const dr = 12
const dh = 20

// Perspective squash factor
const squash = 0.35

// Base Cylinder calcs
const r = computed(() => baseR.value)
const h = computed(() => baseH.value)

const rxBase = computed(() => r.value)
const ryBase = computed(() => r.value * squash)
const topYBase = computed(() => bottomY - h.value)

const cylBodyBase = computed(() => {
  return `
    M ${cx - rxBase.value} ${topYBase.value} 
    L ${cx - rxBase.value} ${bottomY}
    A ${rxBase.value} ${ryBase.value} 0 0 0 ${cx + rxBase.value} ${bottomY}
    L ${cx + rxBase.value} ${topYBase.value}
    Z
  `
})
const cylBottomEdgeBase = computed(() => {
  return `
    M ${cx - rxBase.value} ${bottomY}
    A ${rxBase.value} ${ryBase.value} 0 0 0 ${cx + rxBase.value} ${bottomY}
  `
})

// Variation H (Slice on top)
const topYVar = computed(() => topYBase.value - dh)

const sliceBody = computed(() => {
  return `
    M ${cx - rxBase.value} ${topYVar.value} 
    L ${cx - rxBase.value} ${topYBase.value}
    A ${rxBase.value} ${ryBase.value} 0 0 0 ${cx + rxBase.value} ${topYBase.value}
    L ${cx + rxBase.value} ${topYVar.value}
    A ${rxBase.value} ${ryBase.value} 0 0 1 ${cx - rxBase.value} ${topYVar.value}
    Z
  `
})

// Variation R (Shell around)
const rxVar = computed(() => r.value + dr)
const ryVar = computed(() => (r.value + dr) * squash)

const shellBody = computed(() => {
  // Draw the larger body, but exclude the inner body (creates a donut shape but from the side)
  // Easiest is just to draw the outer body and let it overlap, but use semi-transparency
  return `
    M ${cx - rxVar.value} ${topYBase.value} 
    L ${cx - rxVar.value} ${bottomY}
    A ${rxVar.value} ${ryVar.value} 0 0 0 ${cx + rxVar.value} ${bottomY}
    L ${cx + rxVar.value} ${topYBase.value}
    A ${rxVar.value} ${ryVar.value} 0 0 1 ${cx - rxVar.value} ${topYBase.value}
    Z
  `
})

const shellTop = computed(() => {
  // A donut shape for the top face
  return `
    M ${cx - rxVar.value} ${topYBase.value}
    A ${rxVar.value} ${ryVar.value} 0 1 0 ${cx + rxVar.value} ${topYBase.value}
    A ${rxVar.value} ${ryVar.value} 0 1 0 ${cx - rxVar.value} ${topYBase.value}
    Z
    M ${cx - rxBase.value} ${topYBase.value}
    A ${rxBase.value} ${ryBase.value} 0 1 1 ${cx + rxBase.value} ${topYBase.value}
    A ${rxBase.value} ${ryBase.value} 0 1 1 ${cx - rxBase.value} ${topYBase.value}
    Z
  `
})
</script>

<style lang="scss" scoped>
.partial-vis {
  display: flex;
  flex-direction: column;
}

.ctrl-toggles {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-toggle {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  padding: 0.5em 1.2em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover { background: var(--surface-hi); }
  
  &.active {
    background: var(--text);
    color: var(--bg);
    border-color: var(--text);
    font-weight: 600;
  }
}

.cylinder-view {
  width: 100%;
  max-width: 550px;
  margin: 0 auto 1rem;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);
  overflow: hidden;
}

/* Base Cylinder */
.cyl-body {
  fill: color-mix(in srgb, var(--surface) 80%, white);
  stroke: var(--text-muted);
  stroke-width: 1.5;
}

.cyl-top {
  fill: color-mix(in srgb, var(--surface) 90%, white);
  stroke: var(--text-muted);
  stroke-width: 1.5;
}

.cyl-edge {
  fill: none;
  stroke: var(--text-muted);
  stroke-width: 1.5;
}

/* Variations */
.var-body {
  fill: color-mix(in srgb, var(--accent) 25%, transparent);
  stroke: var(--accent);
  stroke-width: 1.5;
}

.var-top {
  fill: color-mix(in srgb, var(--accent) 35%, transparent);
  stroke: var(--accent);
  stroke-width: 1.5;
  fill-rule: evenodd;
}

.cyl-variation--r .var-body, 
.cyl-variation--r .var-top {
  stroke: var(--warm);
  fill: color-mix(in srgb, var(--warm) 25%, transparent);
}

.cyl-variation--r .var-top {
  fill: color-mix(in srgb, var(--warm) 35%, transparent);
}

.var-pointer {
  stroke: var(--text);
  stroke-width: 1.5;
  stroke-dasharray: 2 2;
}

.var-label {
  font-family: var(--ff-mono);
  font-size: 13px;
  font-weight: 600;
  fill: var(--text);
}

.var-sublabel {
  font-family: var(--ff-ui);
  font-size: 11px;
  fill: var(--text-muted);
}

.cyl-variation--r .var-label { fill: var(--warm); }
.cyl-variation--h .var-label { fill: var(--accent); }

/* Dimensions */
.dim-line, .dim-tick {
  stroke: var(--text-dim);
  stroke-width: 1.5;
}

.dim-dot {
  fill: var(--text-dim);
}

.dim-text {
  font-family: var(--ff-mono);
  font-style: italic;
  font-size: 14px;
  fill: var(--text-muted);
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
}

/* Readout */
.readout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-hi);
  padding: 1rem 1.5rem;
  border-radius: 6px;
}

.r-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.3;
  transition: opacity 0.3s;
  
  &.active {
    opacity: 1;
  }
  
  .r-title {
    font-family: var(--ff-ui);
    font-size: 0.95rem;
    color: var(--text-muted);
  }
  
  .r-val {
    font-family: var(--ff-mono);
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  &:first-child.active .r-val { color: var(--warm); }
  &:last-child.active .r-val { color: var(--accent); }
}

.math-var {
  font-family: var(--ff-mono);
  font-style: italic;
}
</style>
