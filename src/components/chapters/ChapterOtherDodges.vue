<template>
  <ChapterLayout id="other-dodges" label="Chapter XIII" title="Other Useful Dodges">
    <template #prose>
      <div class="prose-block">
        <p>
          In Chapter 13, Thompson introduces a few more clever tricks ("dodges") to make differentiation easier. One of the most conceptually beautiful ones is the rule for <strong>inverse functions</strong>.
        </p>
        <p>
          Suppose you know how to find <span class="hi">dy/dx</span> (how fast <span class="dx">y</span> changes as <span class="dx">x</span> changes), but you actually want to know <span class="hi">dx/dy</span> (how fast <span class="dx">x</span> changes as <span class="dx">y</span> changes).
        </p>
        <blockquote>
          "Just as <span class="dx">dx/dy</span> is the reciprocal of <span class="dx">dy/dx</span>, so the differential coefficient of <span class="dx">x</span> with respect to <span class="dx">y</span> is the reciprocal of the differential coefficient of <span class="dx">y</span> with respect to <span class="dx">x</span>."
        </blockquote>
        <p>
          In plain English: if a hill rises 2 feet for every 1 foot you walk forward (slope = 2), then you walk forward 1/2 a foot for every 1 foot you rise.
        </p>
        <p>
          Mathematically: <span class="hi">dy/dx = 1 / (dx/dy)</span>. Because <span class="dx">dy</span> and <span class="dx">dx</span> are just very small numbers, you can literally just flip the fraction upside down!
        </p>
        <p>
          In the interactive below, trace the curve to see the standard slope (<span class="dx">dy/dx</span>). Then, click <strong>Swap Axes</strong>. The entire graph mirrors itself, swapping the x and y axes. Notice how the steepness instantly inverts, visually proving that <span class="dx">dx/dy</span> is just the reciprocal of <span class="dx">dy/dx</span>!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Flipping the Axes">
        <InverseDodgeVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import InverseDodgeVis from '@/components/interactive/InverseDodgeVis.vue'
</script>
