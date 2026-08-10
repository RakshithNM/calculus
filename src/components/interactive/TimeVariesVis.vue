<template>
  <div class="time-varies-vis">
    <div class="simulation-area">
      <!-- 2D Canvas/SVG showing the ball -->
      <svg viewBox="0 0 100 200" class="physics-view">
        <line x1="10" y1="180" x2="90" y2="180" class="ground" />
        
        <!-- Velocity vector -->
        <line 
          v-if="Math.abs(vel) > 1"
          :x1="50" :y1="180 - yVis"
          :x2="50" :y2="180 - yVis - vel * 1.2"
          class="vel-vector"
          marker-end="url(#arrowhead)"
        />
        
        <circle :cx="50" :cy="180 - yVis" r="6" class="ball" />
        
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="var(--accent)" />
          </marker>
        </defs>
      </svg>
      
      <!-- Readouts/Bars -->
      <div class="meters">
        <div class="meter-group">
          <span class="m-label">Height <span class="math-var">y</span></span>
          <div class="m-bar-container">
            <div class="m-bar m-bar--pos" :style="{ width: `${yPos}%` }"></div>
          </div>
          <span class="m-val">{{ yPos.toFixed(1) }} m</span>
        </div>
        
        <div class="meter-group">
          <span class="m-label">Velocity <span class="math-var">dy/dt</span></span>
          <div class="m-bar-container m-bar-container--centered">
            <div 
              class="m-bar" 
              :class="vel >= 0 ? 'm-bar--vel-pos' : 'm-bar--vel-neg'" 
              :style="{ width: `${Math.abs(vel) * 1.25}%`, left: vel >= 0 ? '50%' : `calc(50% - ${Math.abs(vel) * 1.25}%)` }"
            ></div>
            <div class="center-line"></div>
          </div>
          <span class="m-val">{{ vel.toFixed(1) }} m/s</span>
        </div>
        
        <div class="meter-group">
          <span class="m-label">Accel. <span class="math-var">d²y/dt²</span></span>
          <div class="m-bar-container m-bar-container--centered">
            <div class="m-bar m-bar--accel" :style="{ width: `${Math.abs(accel) * 3}%`, left: `calc(50% - ${Math.abs(accel) * 3}%)` }"></div>
            <div class="center-line"></div>
          </div>
          <span class="m-val">{{ accel.toFixed(1) }} m/s²</span>
        </div>
      </div>
    </div>
    
    <!-- Time slider -->
    <div class="ctrl-row">
      <button class="btn-play" @click="togglePlay" :class="{ playing: isPlaying }">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <span class="ctrl-lbl">Time <span class="math-var">t</span> =</span>
      <input type="range" v-model.number="t" min="0" :max="tMax" step="0.05" @input="stopPlay" />
      <span class="ctrl-out">{{ t.toFixed(2) }} s</span>
    </div>
    
    <div class="formula-readout">
      <div class="f-row"><span class="math-var">y</span> = 40t - 4.9t²</div>
      <div class="f-row"><span class="math-var">dy/dt</span> = 40 - 9.8t</div>
      <div class="f-row"><span class="math-var">d²y/dt²</span> = -9.8</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const t = ref(0)
const v0 = 40
const g = -9.8
const tMax = 8.16 // Time when it hits the ground

const yPos = computed(() => Math.max(0, v0 * t.value + 0.5 * g * t.value * t.value))
const vel = computed(() => v0 + g * t.value)
const accel = computed(() => g)

// Scale down the yPos for SVG so it fits in 200px (max height is ~81.6m)
const yVis = computed(() => yPos.value * 1.8)

// Play controls
const isPlaying = ref(false)
let animFrame: number

function stopPlay() {
  isPlaying.value = false
  cancelAnimationFrame(animFrame)
}

function togglePlay() {
  if (isPlaying.value) {
    stopPlay()
  } else {
    isPlaying.value = true
    if (t.value >= tMax) t.value = 0
    let lastTime = performance.now()
    
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000
      lastTime = time
      t.value = Math.min(tMax, t.value + dt * 1.5) // 1.5x real speed for better feel
      
      if (t.value < tMax && isPlaying.value) {
        animFrame = requestAnimationFrame(loop)
      } else {
        isPlaying.value = false
      }
    }
    animFrame = requestAnimationFrame(loop)
  }
}

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})
</script>

<style lang="scss" scoped>
.time-varies-vis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.simulation-area {
  display: flex;
  gap: 2rem;
  align-items: center;
  background: var(--surface-hi);
  padding: 1.5rem;
  border-radius: 6px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.physics-view {
  width: 120px;
  height: 240px;
  background: var(--surface);
  border-radius: 4px;
  flex-shrink: 0;
  
  @media (max-width: 600px) {
    width: 100%;
    height: 160px;
  }
}

.ground {
  stroke: var(--text-dim);
  stroke-width: 2;
}

.ball {
  fill: var(--text);
}

.vel-vector {
  stroke: var(--accent);
  stroke-width: 2;
}

/* Meters */
.meters {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.meter-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.m-label {
  font-family: var(--ff-ui);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.m-bar-container {
  height: 8px;
  background: var(--surface);
  border-radius: 4px;
  position: relative;
  
  &--centered {
    .center-line {
      position: absolute;
      left: 50%;
      top: -2px;
      bottom: -2px;
      width: 1px;
      background: var(--text-dim);
      opacity: 0.5;
    }
  }
}

.m-bar {
  height: 100%;
  border-radius: 4px;
  position: absolute;
  top: 0;
  transition: width 0.1s linear, left 0.1s linear;
  
  &--pos { background: var(--text); left: 0; }
  &--vel-pos { background: var(--accent); }
  &--vel-neg { background: var(--warm); }
  &--accel { background: #b18ceb; } /* Same purple as Chapter 7 */
}

.m-val {
  font-family: var(--ff-mono);
  font-size: 0.85rem;
  color: var(--text);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Controls */
.ctrl-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-play {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 0.4em 1em;
  border-radius: 4px;
  font-family: var(--ff-ui);
  font-weight: 600;
  cursor: pointer;
  width: 5rem;
  transition: all 0.2s;
  
  &:hover {
    background: color-mix(in srgb, var(--accent) 15%, transparent);
  }
  
  &.playing {
    background: var(--accent);
    color: #141920;
  }
}

.ctrl-lbl {
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  color: var(--text-muted);
}

.ctrl-out {
  font-family: var(--ff-mono);
  font-size: 0.9rem;
  color: var(--text);
  min-width: 4ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

input[type='range'] {
  flex: 1;
}

.math-var {
  font-family: var(--ff-mono);
  font-style: italic;
  color: var(--warm);
}

.formula-readout {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-family: var(--ff-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  background: var(--surface-hi);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  
  .f-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
}
</style>
