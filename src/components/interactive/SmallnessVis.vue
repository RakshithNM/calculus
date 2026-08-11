<template>
  <div class="smallness">
    <!-- Dot grid: shows smallness visually -->
    <div class="smallness__dots" aria-hidden="true">
      <div
        v-for="i in dotCount"
        :key="i"
        class="smallness__dot"
        :style="{ width: dotSize + 'px', height: dotSize + 'px' }"
      />
    </div>

    <p class="smallness__desc">
      <span class="dx">dx</span> =
      <span class="smallness__val">{{ displayVal }}</span>
      &nbsp;·&nbsp;
      <span class="smallness__context">{{ contextLabel }}</span>
    </p>

    <p class="smallness__desc smallness__desc--second">
      <span class="hi">dx²</span> =
      <span class="smallness__val">{{ displayValSquared }}</span>
      &nbsp;·&nbsp;
      <span class="smallness__context">{{ contextLabelSquared }}</span>
    </p>

    <div class="smallness__ctrl">
      <span class="ctrl-lbl">dx</span>
      <input type="range" v-model.number="sliderVal" min="0" max="99" />
      <span class="ctrl-out">{{ displayVal }}</span>
    </div>

    <div class="smallness__readout">
      <span class="r-item">
        Is it zero?
        <em :class="{ warn: sliderVal > 90 }">{{ sliderVal > 90 ? 'Almost…' : 'No' }}</em>
      </span>
      <span class="r-item">
        Does it matter?
        <em>Yes</em>
      </span>
      <span class="r-item">
        Can we divide by it?
        <em>Yes</em>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const sliderVal = ref(40)

const dotCount = computed(() => Math.max(1, Math.round((1 - sliderVal.value / 99) * 20)))
const dotSize  = computed(() => Math.max(3, (1 - sliderVal.value / 99) * 36))

const exponent = computed(() => -(sliderVal.value / 99) * 9)

const displayVal = computed(() => {
  const v = sliderVal.value
  if (v < 10) return '1'
  if (v < 22) return (Math.pow(10, exponent.value)).toFixed(2)
  const exp = Math.round(v / 99 * 9)
  return `10⁻${exp}`
})

const contextLabel = computed(() => {
  const v = sliderVal.value
  if (v < 33) return 'smaller than a grain of sand'
  if (v < 66) return 'smaller than a wavelength of light'
  return 'smaller than a proton - yet not zero'
})

const displayValSquared = computed(() => {
  const v = sliderVal.value
  if (v < 10) return '1'
  if (v < 22) return (Math.pow(10, exponent.value * 2)).toFixed(4)
  const exp = Math.round(v / 99 * 9) * 2
  return `10⁻${exp}`
})

const contextLabelSquared = computed(() => {
  const v = sliderVal.value
  if (v < 33) return 'smaller than a speck of dust'
  if (v < 66) return 'smaller than an atom'
  return 'practically nothing'
})
</script>

<style lang="scss" scoped>
.smallness {
  &__dots {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
    min-height: 52px;
    margin-bottom: 1rem;
  }

  &__dot {
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.72;
    flex-shrink: 0;
    transition: width 0.25s ease, height 0.25s ease;
  }

  &__desc {
    font-family: var(--ff-ui);
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 0.2rem;

    &--second {
      margin-bottom: 1.1rem;
      opacity: 0.8;
      .hi { color: var(--accent); font-weight: 600; font-family: var(--ff-mono); }
    }
  }

  &__val {
    color: var(--accent);
    font-weight: 600;
    font-family: var(--ff-mono);
  }

  &__context {
    font-style: italic;
  }

  &__ctrl {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1rem;
  }

  &__readout {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    font-family: var(--ff-ui);
    font-size: 0.78rem;
    color: var(--text-muted);
  }
}

.ctrl-lbl {
  font-family: var(--ff-mono);
  font-size: 0.82rem;
  color: var(--warm);
  font-style: italic;
  min-width: 1.5rem;
}

.ctrl-out {
  font-family: var(--ff-mono);
  font-size: 0.82rem;
  color: var(--warm);
  min-width: 5ch;
  text-align: right;
}

.r-item {
  em {
    color: var(--accent);
    font-style: normal;
    font-weight: 600;
    margin-left: 0.3em;

    &.warn {
      color: var(--warm);
    }
  }
}
</style>
