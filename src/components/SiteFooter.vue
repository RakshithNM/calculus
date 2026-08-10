<template>
  <footer class="footer">
    <p>
      Based on <em>Calculus Made Easy</em> by Silvanus P. Thompson (1910).<br />
      Thompson's prose is in the public domain. Interactive visualisations built for this page.
    </p>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  padding: clamp(3rem, 5vw, 5rem) clamp(1.5rem, 8vw, 9rem);
  border-top: 1px solid var(--border);
  text-align: center;

  p {
    font-family: var(--ff-ui);
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.7;
  }

  em {
    font-style: italic;
  }
}
</style>
