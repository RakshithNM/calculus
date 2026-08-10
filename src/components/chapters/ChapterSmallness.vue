<template>
  <ChapterLayout id="smallness" label="Chapter II" title="On Different Degrees of Smallness">
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
          But Thompson's greatest lesson is about <strong>degrees</strong> of smallness.
          If <span class="dx">dx</span> is a small fraction, like 1/60, then what is <span class="hi">dx²</span> (a small bit of a small bit)? It is 1/3600.
        </p>
        <p>
          A smallness of the second degree (<span class="hi">dx²</span> or <span class="hi">dx·dy</span>) is microscopically tiny compared to a smallness of the first degree (<span class="dx">dx</span>). When we eventually let these bits shrink toward zero, the second-degree bits vanish entirely, leaving only the first-degree bits to form our rate of change.
        </p>
        <p>
          Drag the slider to shrink <span class="dx">dx</span>. Watch how <span class="hi">dx²</span> crashes toward zero exponentially faster.
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
