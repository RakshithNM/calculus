<template>
  <div class="useful-dodge-vis">
    <div class="simulation-area">
      <!-- Gears Visualization -->
      <svg viewBox="0 0 400 180" class="gears-view">
        <!-- Connecting Belts -->
        <path d="M 70 60 L 200 75 L 200 105 L 70 120 Z" class="belt" />
        <path d="M 200 60 L 330 75 L 330 105 L 200 120 Z" class="belt" />

        <!-- Wheel X -->
        <g :transform="`translate(70, 90) rotate(${rotX})`">
          <circle cx="0" cy="0" r="40" class="wheel wheel--x" />
          <circle cx="0" cy="0" r="34" class="wheel-inner" />
          <line x1="0" y1="-34" x2="0" y2="34" class="spoke" />
          <line x1="-34" y1="0" x2="34" y2="0" class="spoke" />
          <circle cx="0" cy="-25" r="4" class="marker marker--x" />
        </g>
        <text x="70" y="155" class="wheel-label wheel-label--x">Variable x</text>
        <text x="70" y="170" class="speed-label">Speed: 1x</text>

        <!-- Wheel U -->
        <g :transform="`translate(200, 90) rotate(${rotU})`">
          <circle cx="0" cy="0" r="40" class="wheel wheel--u" />
          <circle cx="0" cy="0" r="34" class="wheel-inner" />
          <line x1="0" y1="-34" x2="0" y2="34" class="spoke" />
          <line x1="-34" y1="0" x2="34" y2="0" class="spoke" />
          <circle cx="0" cy="-25" r="4" class="marker marker--u" />
        </g>
        <text x="200" y="155" class="wheel-label wheel-label--u">Variable u</text>
        <text x="200" y="170" class="speed-label">Speed: {{ du_dx.toFixed(1) }}x</text>

        <!-- Wheel Y -->
        <g :transform="`translate(330, 90) rotate(${rotY})`">
          <circle cx="0" cy="0" r="40" class="wheel wheel--y" />
          <circle cx="0" cy="0" r="34" class="wheel-inner" />
          <line x1="0" y1="-34" x2="0" y2="34" class="spoke" />
          <line x1="-34" y1="0" x2="34" y2="0" class="spoke" />
          <circle cx="0" cy="-25" r="4" class="marker marker--y" />
        </g>
        <text x="330" y="155" class="wheel-label wheel-label--y">Variable y</text>
        <text x="330" y="170" class="speed-label speed-label--highlight">Speed: {{ dy_dx.toFixed(1) }}x</text>

        <!-- Multipliers -->
        <text x="135" y="65" class="multiplier-text">× {{ du_dx.toFixed(1) }}</text>
        <text x="265" y="65" class="multiplier-text">× {{ dy_du.toFixed(1) }}</text>
      </svg>
    </div>

    <!-- Sliders -->
    <div class="controls-area">
      <div class="ctrl-row">
        <span class="ctrl-lbl">Ratio <span class="math-var">du/dx</span> =</span>
        <input type="range" v-model.number="du_dx" min="0.5" max="3" step="0.1" />
        <span class="ctrl-out">{{ du_dx.toFixed(1) }}</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-lbl">Ratio <span class="math-var">dy/du</span> =</span>
        <input type="range" v-model.number="dy_du" min="0.5" max="3" step="0.1" />
        <span class="ctrl-out">{{ dy_du.toFixed(1) }}</span>
      </div>
    </div>

    <!-- Readout -->
    <div class="formula-readout">
      <div class="f-row">
        <span class="math-var highlight">dy/dx</span> 
        <span class="f-eq">=</span> 
        <span class="math-var">dy/du</span> 
        <span class="f-eq">×</span> 
        <span class="math-var">du/dx</span>
      </div>
      <div class="f-row f-row--numbers">
        <span class="val highlight">{{ dy_dx.toFixed(2) }}</span> 
        <span class="f-eq">=</span> 
        <span class="val">{{ dy_du.toFixed(1) }}</span> 
        <span class="f-eq">×</span> 
        <span class="val">{{ du_dx.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const du_dx = ref(2.0)
const dy_du = ref(1.5)

const dy_dx = computed(() => du_dx.value * dy_du.value)

// Animation state
const rotX = ref(0)
const rotU = ref(0)
const rotY = ref(0)

const baseSpeed = 40 // degrees per second

let animFrame: number
let lastTime = 0

function loop(time: number) {
  if (!lastTime) lastTime = time
  const dt = (time - lastTime) / 1000
  lastTime = time

  rotX.value = (rotX.value + baseSpeed * dt) % 360
  rotU.value = (rotU.value + baseSpeed * du_dx.value * dt) % 360
  rotY.value = (rotY.value + baseSpeed * dy_dx.value * dt) % 360

  animFrame = requestAnimationFrame(loop)
}

onMounted(() => {
  animFrame = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})
</script>

<style lang="scss" scoped>
.useful-dodge-vis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.simulation-area {
  background: var(--surface-hi);
  padding: 1.5rem 1rem;
  border-radius: 6px;
  display: flex;
  justify-content: center;
}

.gears-view {
  width: 100%;
  max-width: 500px;
  height: auto;
}

/* Belts */
.belt {
  fill: transparent;
  stroke: var(--text-dim);
  stroke-width: 4;
  stroke-linejoin: round;
  opacity: 0.4;
}

/* Wheels */
.wheel {
  stroke-width: 4;
  fill: var(--surface);
  &--x { stroke: var(--text-muted); }
  &--u { stroke: var(--warm); }
  &--y { stroke: var(--accent); }
}

.wheel-inner {
  fill: var(--surface-hi);
  stroke: none;
}

.spoke {
  stroke: var(--border);
  stroke-width: 3;
}

.marker {
  &--x { fill: var(--text-muted); }
  &--u { fill: var(--warm); }
  &--y { fill: var(--accent); }
}

.wheel-label {
  font-family: var(--ff-ui);
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  fill: var(--text);
  
  &--x { fill: var(--text-muted); }
  &--u { fill: var(--warm); }
  &--y { fill: var(--accent); }
}

.speed-label {
  font-family: var(--ff-mono);
  font-size: 11px;
  text-anchor: middle;
  fill: var(--text-muted);
  
  &--highlight {
    fill: var(--accent);
    font-weight: 600;
  }
}

.multiplier-text {
  font-family: var(--ff-mono);
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  fill: var(--text);
  background: var(--surface-hi);
}

/* Controls */
.controls-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ctrl-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ctrl-lbl {
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  color: var(--text-muted);
  min-width: 7rem;
}

.ctrl-out {
  font-family: var(--ff-mono);
  font-size: 0.9rem;
  color: var(--text);
  min-width: 3ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

input[type='range'] {
  flex: 1;
}

.math-var {
  font-family: var(--ff-mono);
  font-style: italic;
  &.highlight { color: var(--accent); font-weight: 600; }
}

/* Formula */
.formula-readout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--ff-mono);
  font-size: 0.95rem;
  background: var(--surface-hi);
  padding: 1rem;
  border-radius: 6px;
  align-items: center;
}

.f-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  
  &--numbers {
    opacity: 0.8;
  }
}

.f-eq {
  color: var(--text-muted);
}

.val {
  color: var(--text);
  font-variant-numeric: tabular-nums;
  &.highlight { color: var(--accent); font-weight: 600; }
}
</style>
