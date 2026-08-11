<template>
  <div>
    <!-- The Top Navigation Bar -->
    <nav class="nav">
      <div class="nav__left">
        <button class="nav__menu-btn" @click="toggleMenu" aria-label="Toggle Table of Contents">
          <svg v-if="!menuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <span class="nav__brand">Calculus Made Easy</span>
      </div>
      
      <button class="nav__theme" @click="toggle" aria-label="Toggle theme">◐</button>
    </nav>

    <!-- Slide-out Backdrop -->
    <div 
      class="menu-backdrop" 
      :class="{ 'menu-backdrop--open': menuOpen }"
      @click="closeMenu"
    ></div>

    <!-- Slide-out Menu Panel -->
    <div class="menu-panel" :class="{ 'menu-panel--open': menuOpen }">
      <div class="menu-header">
        <h2 class="menu-title">Table of Contents</h2>
      </div>
      <ul class="menu-links">
        <li v-for="link in links" :key="link.id">
          <a 
            :href="link.href" 
            class="menu-link"
            :class="{ 'menu-link--active': activeId === link.id }"
            @click="closeMenu"
          >
            <span class="menu-link-num">{{ link.num }}</span>
            <span class="menu-link-label">{{ link.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { toggle } = useTheme()

const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

const links = [
  { href: '#hero',           id: 'hero',           num: 'Prologue', label: 'Calculus Made Easy' },
  { href: '#terrors',        id: 'terrors',        num: 'I', label: 'To Deliver You From The Preliminary Terrors' },
  { href: '#smallness',      id: 'smallness',      num: 'II', label: 'On Different Degrees of Smallness' },
  { href: '#rate-of-change', id: 'rate-of-change', num: 'III', label: 'How Fast Does It Grow?' },
  { href: '#power-rule',     id: 'power-rule',     num: 'IV', label: 'The Simplest Cases: The Power Rule' },
  { href: '#constants',      id: 'constants',      num: 'V', label: 'Next Stage. What to do with Constants' },
  { href: '#product-rule',   id: 'product-rule',   num: 'VI', label: 'Sums, Differences, Products, and Quotients' },
  { href: '#successive',     id: 'successive',     num: 'VII', label: 'Successive Differentiation' },
  { href: '#time-varies',    id: 'time-varies',    num: 'VIII', label: 'When Time Varies' },
  { href: '#useful-dodge',   id: 'useful-dodge',   num: 'IX', label: 'Introducing a Useful Dodge' },
  { href: '#slopes',         id: 'slopes',         num: 'X', label: 'Geometrical Meaning of Differentiation' },
  { href: '#max-min',        id: 'max-min',        num: 'XI', label: 'Maxima and Minima' },
  { href: '#curvature',      id: 'curvature',      num: 'XII', label: 'Curvature of Curves' },
  { href: '#other-dodges',   id: 'other-dodges',   num: 'XIII', label: 'Other Useful Dodges' },
  { href: '#organic-growth', id: 'organic-growth', num: 'XIV', label: 'On True Compound Interest and the Law of Organic Growth' },
  { href: '#die-away',       id: 'die-away',       num: 'XIV pt II', label: 'The Die-away Curve' },
  { href: '#trig',           id: 'trig',           num: 'XV', label: 'How to Deal with Sines and Cosines' },
  { href: '#partial',        id: 'partial',        num: 'XVI', label: 'Partial Differentiation' },
  { href: '#integration',    id: 'integration',    num: 'XVII', label: 'Integration: Adding Up Little Bits' },
  { href: '#reverse',        id: 'reverse',        num: 'XVIII', label: 'Integrating as the Reverse of Differentiating' },
  { href: '#area',           id: 'area',           num: 'XIX', label: 'On Finding Areas by Integrating' },
  { href: '#dodges',         id: 'dodges',         num: 'XX', label: 'Dodges, Pitfalls, and Triumphs' },
  { href: '#solutions',      id: 'solutions',      num: 'XXI', label: 'Finding Some Solutions' },
  { href: '#epilogue',       id: 'epilogue',       num: 'Epilogue', label: 'Epilogue and Apologue' },
]

const activeId = ref('hero')

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activeId.value = e.target.id
      })
    },
    { rootMargin: '-35% 0px -60% 0px' },
  )
  document.querySelectorAll('section[id], header[id]').forEach((s) => observer!.observe(s))
})

onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(1rem, 5vw, 3.5rem);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);

  &__left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  &__menu-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    margin-left: -0.5rem;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
    
    &:hover {
      color: var(--text);
      background: var(--surface-hi);
    }
  }

  &__brand {
    font-family: var(--ff-ui);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text);
  }

  &__theme {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.85rem;
    padding: 0.3em 0.65em;
    border-radius: 5px;
    cursor: pointer;
    font-family: var(--ff-ui);
    transition: color 0.2s, border-color 0.2s;

    &:hover {
      color: var(--text);
      border-color: var(--text-muted);
    }
  }
}

/* Slide-out Menu styles */
.menu-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  
  &--open {
    opacity: 1;
    pointer-events: auto;
  }
}

.menu-panel {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 85vw;
  max-width: 380px;
  background: var(--surface);
  z-index: 210;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 4px 0 24px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  
  &--open {
    transform: translateX(0);
  }
}

.menu-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}

.menu-title {
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.menu-links {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-link {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s;
  
  &:hover {
    background: var(--surface-hi);
  }
  
  &--active {
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    
    .menu-link-num { color: var(--accent); }
    .menu-link-label { color: var(--text); font-weight: 500; }
  }
}

.menu-link-num {
  font-family: var(--ff-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  width: 4.5rem;
  flex-shrink: 0;
}

.menu-link-label {
  font-family: var(--ff-prose);
  font-size: 1rem;
  color: var(--text-dim);
  line-height: 1.3;
}
</style>
