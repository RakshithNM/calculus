<template>
  <footer class="footer">
    <p>
      Based on <em><a href="https://calculusmadeeasy.org/" target="_blank" rel="noopener noreferrer">Calculus Made Easy</a></em> by Silvanus P. Thompson (1910).<br />
      Thompson's prose is in the public domain. Interactive visualisations built for this page.
    </p>
    <p class="credits">
      Built by <a href="https://rakshithnettar.com" target="_blank" rel="noopener noreferrer">Rakshith Bellare</a>
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
  a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--text);
      text-decoration: underline;
    }
  }

  .credits {
    margin-top: 1rem;
    font-size: 0.8rem;
  }
}
</style>
