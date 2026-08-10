<template>
  <nav class="nav">
    <span class="nav__brand">Calculus Made Easy</span>
    <ul class="nav__links">
      <li v-for="link in links" :key="link.href">
        <a :href="link.href" :class="{ active: activeId === link.id }">{{ link.label }}</a>
      </li>
    </ul>
    <button class="nav__theme" @click="toggle" aria-label="Toggle theme">◐</button>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { toggle } = useTheme()

const links = [
  { href: '#hero',           id: 'hero',           label: 'Prologue' },
  { href: '#smallness',      id: 'smallness',      label: 'Smallness' },
  { href: '#rate-of-change', id: 'rate-of-change', label: 'Rate of Change' },
  { href: '#power-rule',     id: 'power-rule',     label: 'Power Rule' },
  { href: '#slopes',         id: 'slopes',         label: 'Slopes' },
  { href: '#max-min',        id: 'max-min',         label: 'Max & Min' },
  { href: '#integration',    id: 'integration',    label: 'Integration' },
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
  document.querySelectorAll('section[id]').forEach((s) => observer!.observe(s))
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
  padding: 0 clamp(1.25rem, 5vw, 3.5rem);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);

  &__brand {
    font-family: var(--ff-ui);
    font-size: 0.72rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  &__links {
    display: flex;
    gap: 0.1rem;
    list-style: none;
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;

    @media (max-width: 960px) {
      display: none;
    }

    a {
      font-family: var(--ff-ui);
      font-size: 0.68rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--text-muted);
      text-decoration: none;
      padding: 0.35em 0.55em;
      border-radius: 5px;
      white-space: nowrap;
      transition: color 0.2s, background 0.2s;

      &:hover,
      &.active {
        color: var(--accent);
        background: rgba(69, 201, 190, 0.09);
      }
    }
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
</style>
