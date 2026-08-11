<template>
  <section class="chapter" :id="id">
    <div class="chapter__inner">
      <div class="chapter__prose">
        <div class="chapter__meta">
          <span class="chapter__label">{{ label }}</span>
          <div class="chapter__rule" />
        </div>
        <h2 class="chapter__title">{{ title }}</h2>
        <div class="prose-block">
          <slot name="prose" />
        </div>
      </div>
      <div class="chapter__lab">
        <slot name="lab" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  title: string
}>()
</script>

<style lang="scss" scoped>
.chapter {
  padding: clamp(4.5rem, 7vw, 7.5rem) clamp(1.5rem, 8vw, 9rem);
  border-top: 1px solid var(--border);

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 5rem);
    align-items: start;
    max-width: 1160px;
    margin: 0 auto;

    @media (max-width: 780px) {
      grid-template-columns: 1fr;
    }
  }

  &:nth-of-type(odd) &__inner {
    /* prose left, lab right - default */
  }

  &:nth-of-type(even) &__inner {
    direction: rtl;

    > * {
      direction: ltr;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1.25rem;
  }

  &__label {
    font-family: var(--ff-ui);
    font-size: 0.68rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--accent);
    white-space: nowrap;
  }

  &__rule {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  &__title {
    font-size: clamp(1.5rem, 2.8vw, 2.2rem);
    font-weight: 400;
    line-height: 1.2;
    text-wrap: balance;
    margin-bottom: 1.3rem;
    letter-spacing: -0.01em;
  }
}
</style>
