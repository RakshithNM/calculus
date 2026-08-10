<template>
  <div class="lab">
    <div class="lab__head">
      <span class="lab__label">{{ label }}</span>
      <div class="lab__dot" />
    </div>
    <div class="lab__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<style lang="scss" scoped>
.lab {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;

  &__head {
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__label {
    font-family: var(--ff-ui);
    font-size: 0.68rem;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2.6s ease-in-out infinite;
  }

  &__body {
    padding: 1.25rem;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 0.9; }
}
</style>
