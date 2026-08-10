<template>
  <ChapterLayout id="smallness" label="Chapter I" title="On Different Degrees of Smallness">
    <template #prose>
      <div class="prose-block">
        <p>
          Calculus rests on a single, slippery idea: things can be
          <em>indefinitely small</em> without being <em>nothing</em>. Thompson calls
          these little bits <span class="dx">dx</span> and <span class="dx">dy</span> —
          where the <em>d</em> simply means "a little bit of."
        </p>
        <blockquote>
          "In mathematical language, <em>infinitely small</em> means nothing more nor less
          than <em>indefinitely small</em>."
        </blockquote>
        <p>
          A little bit of <span class="dx">x</span> is written <span class="dx">dx</span>.
          A little bit of time is <span class="dx">dt</span>. These are not zero — they're
          quantities small enough that we can reason about how they
          <span class="hi">relate</span> to each other.
        </p>
        <p>
          The ratio <span class="dx">dy/dx</span> — "how much does <em>y</em> change
          per tiny bit of <em>x</em>?" — is the derivative. Drag the slider to shrink
          <span class="dx">dx</span> toward zero. Notice it never quite gets there.
          That's the whole point.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Shrinking to Smallness">
        <SmallnessVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import SmallnessVis from '@/components/interactive/SmallnessVis.vue'
</script>
