<template>
  <ChapterLayout id="epilogue" label="Epilogue" title="Epilogue and Apologue">
    <template #prose>
      <div class="prose-block">
        <p>
          In his famous Epilogue, Silvanus P. Thompson confidently predicts that professional mathematicians will damn his book as "thoroughly bad" for several reasons.
        </p>
        <p>
          First and foremost, because it shows how ridiculously easy most calculus operations really are, giving away their closely guarded "trade secrets" and shattering the illusion of extreme difficulty.
        </p>
        <p>
          To the critics who complain that he failed to use rigid, formal mathematical proofs, Thompson argues a simple point of pragmatism: <em>"You don't forbid the use of a watch to every person who does not know how to make one."</em> Just as children learn to speak before they learn rigid syntax, beginners should learn to <em>use</em> calculus before drowning in its proofs.
        </p>
        <p>
          Finally, Thompson proudly pleads guilty to the accusation that he intentionally left out everything difficult. He wrote the book for "the legion of innocents" who had been deterred by the needlessly complicated way calculus is normally taught. His goal was to reveal its endearing simplicities and powerful methods without the irrelevant mathematical gymnastics.
        </p>
        <blockquote>
          "There are amongst young engineers a number on whose ears the adage that <em>what one fool can do, another can</em>, may fall with a familiar sound. They are earnestly requested not to give the author away, nor to tell the mathematicians what a fool he really is."
        </blockquote>
      </div>
    </template>
    <template #lab>
      <!-- We use the lab panel here just to hold a nice piece of closing typography or art -->
      <div class="epilogue-art">
        <div class="fool-quote">
          What one fool can do, another can.
        </div>
        <div class="author-sign">
          — Silvanus P. Thompson (1910)
        </div>
      </div>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
</script>

<style lang="scss" scoped>
.epilogue-art {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400px;
  padding: 2rem;
  background: var(--surface-hi);
  border-radius: 6px;
  text-align: center;
}

.fool-quote {
  font-family: var(--ff-prose);
  font-size: 2.5rem;
  font-style: italic;
  color: var(--accent);
  line-height: 1.3;
  margin-bottom: 2rem;
  max-width: 15ch;
}

.author-sign {
  font-family: var(--ff-ui);
  font-size: 1rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
