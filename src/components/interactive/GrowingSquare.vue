<template>
  <div class="growing-square">
    <svg
      :viewBox="`0 0 ${VBW} ${VBH}`"
      class="sq-svg"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Growing square visualisation"
    >
      <!-- Dimension line: x -->
      <line :x1="OX" :y1="OY - 14" :x2="OX + xPx" :y2="OY - 14" class="dim-line" />
      <line :x1="OX" :y1="OY - 18" :x2="OX" :y2="OY - 10" class="dim-tick" />
      <line :x1="OX + xPx" :y1="OY - 18" :x2="OX + xPx" :y2="OY - 10" class="dim-tick" />
      <text :x="OX + xPx / 2" :y="OY - 20" class="dim-text">x = 3</text>

      <!-- Dimension line: dx -->
      <line v-if="dxPx > 4" :x1="OX + xPx" :y1="OY - 14" :x2="OX + xPx + dxPx" :y2="OY - 14" class="dim-line dim-line--dx" />
      <line v-if="dxPx > 4" :x1="OX + xPx + dxPx" :y1="OY - 18" :x2="OX + xPx + dxPx" :y2="OY - 10" class="dim-tick dim-tick--dx" />
      <text v-if="dxPx > 4" :x="OX + xPx + dxPx / 2" :y="OY - 20" class="dim-text dim-text--dx">dx</text>

      <!-- Base square: x² -->
      <rect :x="OX" :y="OY" :width="xPx" :height="xPx" class="sq-base" />
      <text :x="OX + xPx / 2" :y="OY + xPx / 2 + 6" class="sq-label">x² = 9</text>

      <!-- Right strip: x · dx -->
      <rect :x="OX + xPx" :y="OY" :width="dxPx" :height="xPx" class="sq-strip" />
      <text
        v-if="dxPx >= 28"
        :x="OX + xPx + dxPx / 2"
        :y="OY + xPx / 2 + 6"
        class="strip-label"
        transform-origin="center"
        :transform="`rotate(-90, ${OX + xPx + dxPx / 2}, ${OY + xPx / 2 + 6})`"
      >x·dx</text>

      <!-- Bottom strip: x · dx -->
      <rect :x="OX" :y="OY + xPx" :width="xPx" :height="dxPx" class="sq-strip" />
      <text
        v-if="dxPx >= 18"
        :x="OX + xPx / 2"
        :y="OY + xPx + dxPx / 2 + 5"
        class="strip-label"
      >x·dx</text>

      <!-- Corner: dx² -->
      <rect :x="OX + xPx" :y="OY + xPx" :width="dxPx" :height="dxPx" class="sq-corner" />
      <text
        v-if="dxPx >= 22"
        :x="OX + xPx + dxPx / 2"
        :y="OY + xPx + dxPx / 2 + 5"
        class="corner-label"
      >dx²</text>
    </svg>

    <!-- Formula unfolding -->
    <div class="formula-steps">
      <div class="formula-line">
        <span class="f-comment">New area &nbsp;=&nbsp;</span>
        <span class="f-base">(x + dx)²</span>
        <span class="f-eq"> = </span>
        <span class="f-base">x²</span>
        <span class="f-eq"> + </span>
        <span class="f-strip">2x · dx</span>
        <span class="f-eq"> + </span>
        <span class="f-corner" :class="{ fading: dx < 0.25 }">dx²</span>
      </div>
      <div class="formula-line formula-line--values">
        <span class="f-comment">In numbers &nbsp;=&nbsp;</span>
        <span class="f-base">{{ xSq.toFixed(1) }}</span>
        <span class="f-eq"> + </span>
        <span class="f-strip">{{ twoXdx.toFixed(2) }}</span>
        <span class="f-eq"> + </span>
        <span class="f-corner" :class="{ fading: dx < 0.25 }">{{ dxSq.toFixed(3) }}</span>
      </div>
      <div class="formula-line formula-line--insight" :class="{ active: dx < 0.3 }">
        <span class="f-comment">As dx → 0: &nbsp;</span>
        <span class="f-corner fading">dx²</span>
        <span class="f-eq"> vanishes, so</span>
        <span class="f-eq"> dy/dx ≈ </span>
        <span class="f-strip">2x</span>
        <span class="f-eq"> = </span>
        <span class="f-strip">{{ (2 * X_BASE).toFixed(0) }}</span>
      </div>
    </div>

    <!-- Slider -->
    <div class="ctrl-row">
      <span class="ctrl-lbl">dx =</span>
      <input type="range" v-model.number="dx" :min="0.04" :max="1.5" :step="0.02" />
      <span class="ctrl-out">{{ dx.toFixed(2) }}</span>
    </div>

    <!-- Negligibility readout -->
    <div class="neg-readout">
      <span class="neg-label">dx² is </span>
      <span class="neg-val" :class="negClass">{{ negPct }}%</span>
      <span class="neg-label"> of the strips' area</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const VBW = 240
const VBH = 250
const SCALE = 42   // px per unit
const X_BASE = 3
const OX = 28     // origin x
const OY = 36     // origin y (below dimension labels)

const dx = ref(0.9)

const xPx  = computed(() => X_BASE * SCALE)
const dxPx = computed(() => Math.max(2, dx.value * SCALE))

const xSq    = computed(() => X_BASE ** 2)
const twoXdx = computed(() => 2 * X_BASE * dx.value)
const dxSq   = computed(() => dx.value ** 2)

const negPct = computed(() => {
  const strips = twoXdx.value
  return strips > 0 ? ((dxSq.value / strips) * 100).toFixed(1) : '0'
})

const negClass = computed(() => {
  const p = parseFloat(negPct.value)
  if (p < 2)  return 'neg--tiny'
  if (p < 10) return 'neg--small'
  return 'neg--large'
})
</script>

<style lang="scss" scoped>
.sq-svg {
  width: 100%;
  display: block;
  border-radius: 6px;
  background: var(--surface-hi);
  margin-bottom: 1rem;
}

/* Squares */
.sq-base {
  fill: var(--surface);
  stroke: var(--text-muted);
  stroke-width: 1;
}

.sq-strip {
  fill: var(--warm);
  opacity: 0.35;
  stroke: var(--warm);
  stroke-width: 0.8;
}

.sq-corner {
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

.sq-label {
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
.ctrl-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 0.75rem;
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
