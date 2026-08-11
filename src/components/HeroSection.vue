<template>
  <section class="hero" id="hero">
    <!-- Animated parabola background -->
    <svg
      class="hero__bg"
      :viewBox="`0 0 ${VBW} ${VBH}`"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
    >
      <!-- Static parabola -->
      <path :d="curvePath" class="hero__curve" />
      <!-- Tangent line -->
      <clipPath id="hero-clip">
        <rect x="0" y="0" :width="VBW" :height="VBH" />
      </clipPath>
      <line
        :x1="tangentPts.x1" :y1="tangentPts.y1"
        :x2="tangentPts.x2" :y2="tangentPts.y2"
        class="hero__tangent"
        clip-path="url(#hero-clip)"
      />
      <!-- Animated dot -->
      <circle :cx="dotPos[0]" :cy="dotPos[1]" r="7" class="hero__dot-glow" />
      <circle :cx="dotPos[0]" :cy="dotPos[1]" r="4" class="hero__dot" />
    </svg>

    <div class="hero__content">
      <p class="hero__eyebrow">Silvanus P. Thompson &nbsp;·&nbsp; 1910</p>
      <h1 class="hero__title">Calculus,<br /><em>made easy.</em></h1>
      <p class="hero__sub">
        "Considering how many fools can calculate, it is surprising that it should be thought
        either a difficult or a tedious task for any other fool to learn how to master
        the same tricks."
      </p>
      <div class="hero__cta">
        <a href="#terrors" class="btn btn--primary">Begin reading</a>
      </div>
    </div>

    <a href="#terrors" class="hero__scroll" aria-label="Scroll down">
      <span>scroll</span>
      <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M6 1v16M1 12l5 5 5-5" />
      </svg>
    </a>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { mathToSVG, fnPath, type CoordMap } from '@/composables/useSVGMath'

const VBW = 480
const VBH = 340
const MAP: CoordMap = { xMin: -3.2, xMax: 3.2, yMin: -0.8, yMax: 11, vbWidth: VBW, vbHeight: VBH }

const heroT = ref(0)
let rafId = 0

function tick() {
  heroT.value += 0.006
  rafId = requestAnimationFrame(tick)
}

onMounted(() => { rafId = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(rafId))

const curvePath = computed(() => fnPath((x) => x * x, MAP))

const animX = computed(() => {
  // oscillate -2.5 → 2.5 → -2.5 using a sine wave
  return Math.sin(heroT.value) * 2.5
})

const dotPos = computed(() => mathToSVG(animX.value, animX.value ** 2, MAP))

const tangentPts = computed(() => {
  const x = animX.value
  const slope = 2 * x
  const b = x * x - slope * x
  const [x1, y1] = mathToSVG(MAP.xMin, slope * MAP.xMin + b, MAP)
  const [x2, y2] = mathToSVG(MAP.xMax, slope * MAP.xMax + b, MAP)
  return { x1, y1, x2, y2 }
})
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(7rem, 10vw, 11rem) clamp(1.5rem, 8vw, 9rem) clamp(5rem, 7vw, 7rem);
  overflow: hidden;

  &__bg {
    position: absolute;
    right: -2%;
    top: 0;
    bottom: 0;
    width: 55%;
    opacity: 0.28;
    pointer-events: none;
  }

  &__curve {
    fill: none;
    stroke: var(--warm);
    stroke-width: 2;
  }

  &__tangent {
    stroke: var(--accent);
    stroke-width: 1.2;
    stroke-dasharray: 6 4;
  }

  &__dot-glow {
    fill: var(--accent);
    opacity: 0.2;
  }

  &__dot {
    fill: var(--accent);
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  &__eyebrow {
    font-family: var(--ff-ui);
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1.75rem;
  }

  &__title {
    font-size: clamp(2.8rem, 7vw, 5.8rem);
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.02em;
    text-wrap: balance;
    max-width: 14ch;
    margin-bottom: 1.5rem;

    em {
      font-style: italic;
      color: var(--accent);
    }
  }

  &__sub {
    font-size: clamp(1rem, 1.6vw, 1.15rem);
    color: var(--text-muted);
    max-width: 50ch;
    margin-bottom: 2.75rem;
    line-height: 1.7;
    font-style: italic;
  }

  &__cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  &__scroll {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--ff-ui);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    text-decoration: none;
    animation: bob 2.4s ease-in-out infinite;

    @media (max-width: 640px) {
      display: none;
    }
  }
}

@keyframes bob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(7px); }
}
</style>
