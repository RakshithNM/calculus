<template>
  <div class="growing-rectangle">
    <svg
      :viewBox="`0 0 ${VBW} ${VBH}`"
      class="rect-svg"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Growing rectangle visualisation"
    >
      <!-- Dimension line: u (width) -->
      <line :x1="OX" :y1="OY - 14" :x2="OX + uPx" :y2="OY - 14" class="dim-line" />
      <line :x1="OX" :y1="OY - 18" :x2="OX" :y2="OY - 10" class="dim-tick" />
      <line :x1="OX + uPx" :y1="OY - 18" :x2="OX + uPx" :y2="OY - 10" class="dim-tick" />
      <text :x="OX + uPx / 2" :y="OY - 20" class="dim-text">u = 4</text>

      <!-- Dimension line: du -->
      <line v-if="duPx > 4" :x1="OX + uPx" :y1="OY - 14" :x2="OX + uPx + duPx" :y2="OY - 14" class="dim-line dim-line--dx" />
      <line v-if="duPx > 4" :x1="OX + uPx + duPx" :y1="OY - 18" :x2="OX + uPx + duPx" :y2="OY - 10" class="dim-tick dim-tick--dx" />
      <text v-if="duPx > 4" :x="OX + uPx + duPx / 2" :y="OY - 20" class="dim-text dim-text--dx">du</text>

      <!-- Dimension line: v (height) -->
      <line :x1="OX - 14" :y1="OY" :x2="OX - 14" :y2="OY + vPx" class="dim-line" />
      <line :x1="OX - 18" :y1="OY" :x2="OX - 10" :y2="OY" class="dim-tick" />
      <line :x1="OX - 18" :y1="OY + vPx" :x2="OX - 10" :y2="OY + vPx" class="dim-tick" />
      <text :x="OX - 20" :y="OY + vPx / 2" class="dim-text" transform-origin="center" :transform="`rotate(-90, ${OX - 20}, ${OY + vPx / 2})`">v = 2.5</text>

      <!-- Dimension line: dv -->
      <line v-if="dvPx > 4" :x1="OX - 14" :y1="OY + vPx" :x2="OX - 14" :y2="OY + vPx + dvPx" class="dim-line dim-line--dx" />
      <line v-if="dvPx > 4" :x1="OX - 18" :y1="OY + vPx + dvPx" :x2="OX - 10" :y2="OY + vPx + dvPx" class="dim-tick dim-tick--dx" />
      <text v-if="dvPx > 4" :x="OX - 20" :y="OY + vPx + dvPx / 2" class="dim-text dim-text--dx" transform-origin="center" :transform="`rotate(-90, ${OX - 20}, ${OY + vPx + dvPx / 2})`">dv</text>

      <!-- Base rectangle: uv -->
      <rect :x="OX" :y="OY" :width="uPx" :height="vPx" class="rect-base" />
      <text :x="OX + uPx / 2" :y="OY + vPx / 2 + 6" class="rect-label">uv = 10</text>

      <!-- Right strip: v · du -->
      <rect :x="OX + uPx" :y="OY" :width="duPx" :height="vPx" class="rect-strip" />
      <text
        v-if="duPx >= 28"
        :x="OX + uPx + duPx / 2"
        :y="OY + vPx / 2 + 6"
        class="strip-label"
        transform-origin="center"
        :transform="`rotate(-90, ${OX + uPx + duPx / 2}, ${OY + vPx / 2 + 6})`"
      >v·du</text>

      <!-- Bottom strip: u · dv -->
      <rect :x="OX" :y="OY + vPx" :width="uPx" :height="dvPx" class="rect-strip" />
      <text
        v-if="dvPx >= 18"
        :x="OX + uPx / 2"
        :y="OY + vPx + dvPx / 2 + 5"
        class="strip-label"
      >u·dv</text>

      <!-- Corner: du · dv -->
      <rect :x="OX + uPx" :y="OY + vPx" :width="duPx" :height="dvPx" class="rect-corner" />
      <text
        v-if="duPx >= 22 && dvPx >= 18"
        :x="OX + uPx + duPx / 2"
        :y="OY + vPx + dvPx / 2 + 5"
        class="corner-label"
      >du·dv</text>
    </svg>

    <!-- Formula unfolding -->
    <div class="formula-steps">
      <div class="formula-line">
        <span class="f-comment">New area &nbsp;=&nbsp;</span>
        <span class="f-base">(u + du)(v + dv)</span>
      </div>
      <div class="formula-line">
        <span class="f-comment">Expanded &nbsp;=&nbsp;</span>
        <span class="f-base">uv</span>
        <span class="f-eq"> + </span>
        <span class="f-strip">v·du + u·dv</span>
        <span class="f-eq"> + </span>
        <span class="f-corner" :class="{ fading: du < 0.3 || dv < 0.3 }">du·dv</span>
      </div>
      <div class="formula-line formula-line--values">
        <span class="f-comment">In numbers &nbsp;=&nbsp;</span>
        <span class="f-base">{{ (U_BASE * V_BASE).toFixed(1) }}</span>
        <span class="f-eq"> + </span>
        <span class="f-strip">{{ (V_BASE * du + U_BASE * dv).toFixed(2) }}</span>
        <span class="f-eq"> + </span>
        <span class="f-corner" :class="{ fading: du < 0.3 || dv < 0.3 }">{{ (du * dv).toFixed(3) }}</span>
      </div>
      <div class="formula-line formula-line--insight" :class="{ active: du < 0.4 && dv < 0.4 }">
        <span class="f-comment">As du, dv → 0: &nbsp;</span>
        <span class="f-corner fading">du·dv</span>
        <span class="f-eq"> vanishes, leaving </span>
        <span class="f-strip">v·du + u·dv</span>
      </div>
    </div>

    <!-- Sliders -->
    <div class="sliders-container">
      <div class="ctrl-row">
        <span class="ctrl-lbl">du =</span>
        <input type="range" v-model.number="du" :min="0.04" :max="1.5" :step="0.02" />
        <span class="ctrl-out">{{ du.toFixed(2) }}</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-lbl">dv =</span>
        <input type="range" v-model.number="dv" :min="0.04" :max="1.2" :step="0.02" />
        <span class="ctrl-out">{{ dv.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Negligibility readout -->
    <div class="neg-readout">
      <span class="neg-label">du·dv is </span>
      <span class="neg-val" :class="negClass">{{ negPct }}%</span>
      <span class="neg-label"> of the strips' area</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const VBW = 260
const VBH = 200
const SCALE = 32   // px per unit
const U_BASE = 4
const V_BASE = 2.5
const OX = 36     // origin x
const OY = 36     // origin y

const du = ref(1.0)
const dv = ref(0.8)

const uPx  = computed(() => U_BASE * SCALE)
const vPx  = computed(() => V_BASE * SCALE)
const duPx = computed(() => Math.max(2, du.value * SCALE))
const dvPx = computed(() => Math.max(2, dv.value * SCALE))

const dudv = computed(() => du.value * dv.value)
const strips = computed(() => V_BASE * du.value + U_BASE * dv.value)

const negPct = computed(() => {
  return strips.value > 0 ? ((dudv.value / strips.value) * 100).toFixed(1) : '0'
})

const negClass = computed(() => {
  const p = parseFloat(negPct.value)
  if (p < 2)  return 'neg--tiny'
  if (p < 8) return 'neg--small'
  return 'neg--large'
})
</script>

<style lang="scss" scoped>
.rect-svg {
  width: 100%;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);
  margin-bottom: 1rem;
}

/* Rectangles */
.rect-base {
  fill: var(--surface);
  stroke: var(--text-muted);
  stroke-width: 1;
}

.rect-strip {
  fill: var(--warm);
  opacity: 0.35;
  stroke: var(--warm);
  stroke-width: 0.8;
}

.rect-corner {
  fill: var(--accent);
  opacity: 0.45;
  stroke: var(--accent);
  stroke-width: 0.8;
}

/* Dimension lines */
.dim-line  { stroke: var(--text-muted); stroke-width: 0.8; opacity: 0.5; }
.dim-tick  { stroke: var(--text-muted); stroke-width: 0.8; opacity: 0.5; }
.dim-line--dx  { stroke: var(--warm); opacity: 0.7; }
.dim-tick--dx  { stroke: var(--warm); opacity: 0.7; }

/* Text labels */
.dim-text {
  font-family: var(--ff-mono);
  font-size: 10px;
  fill: var(--text-muted);
  text-anchor: middle;
  dominant-baseline: auto;
}

.dim-text--dx { fill: var(--warm); }

.rect-label {
  font-family: var(--ff-mono);
  font-size: 12px;
  fill: var(--text-muted);
  text-anchor: middle;
  dominant-baseline: middle;
}

.strip-label {
  font-family: var(--ff-mono);
  font-size: 10px;
  fill: var(--warm);
  text-anchor: middle;
  dominant-baseline: middle;
}

.corner-label {
  font-family: var(--ff-mono);
  font-size: 9px;
  fill: var(--accent);
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Formula */
.formula-steps {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-family: var(--ff-mono);
  font-size: 0.8rem;
}

.formula-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.1rem;
  padding: 0.35rem 0.6rem;
  background: var(--surface-hi);
  border-radius: 5px;

  &--insight {
    opacity: 0.4;
    transition: opacity 0.4s;

    &.active {
      opacity: 1;
      background: color-mix(in srgb, var(--accent) 8%, var(--surface-hi));
    }
  }
}

.f-comment { color: var(--text-muted); font-style: italic; }
.f-eq      { color: var(--text-muted); }
.f-base    { color: var(--text); }
.f-strip   { color: var(--warm); font-weight: 600; }
.f-corner  {
  color: var(--accent);
  font-weight: 600;
  transition: opacity 0.4s;

  &.fading { opacity: 0.3; }
}

/* Controls */
.sliders-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
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
  min-width: 3rem;
}

.ctrl-out {
  font-family: var(--ff-mono);
  font-size: 0.82rem;
  color: var(--warm);
  min-width: 3.5ch;
  text-align: right;
}

/* Negligibility readout */
.neg-readout {
  font-family: var(--ff-ui);
  font-size: 0.78rem;
  color: var(--text-muted);
}

.neg-val {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s;

  &.neg--tiny  { color: #6db96d; }
  &.neg--small { color: var(--warm); }
  &.neg--large { color: var(--accent); }
}
</style>
