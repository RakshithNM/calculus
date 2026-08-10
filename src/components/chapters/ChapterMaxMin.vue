<template>
  <ChapterLayout id="max-min" label="Chapter X" title="Maxima and Minima">
    <template #prose>
      <div class="prose-block">
        <p>
          Here is the payoff. When a function reaches a peak or a valley,
          it is — for an instant — <em>neither rising nor falling</em>. The
          slope of the tangent is exactly zero.
        </p>
        <blockquote>
          "When <em>dy/dx = 0</em>, the function is at a maximum or minimum."
        </blockquote>
        <p>
          This is why engineers, economists, and scientists use calculus daily:
          to find the <span class="hi">best answer</span> to a question. The
          shortest path, the strongest beam, the cheapest design — all are found
          by setting the derivative to zero and solving.
        </p>
        <p>
          The curve below is <span class="dx">f(x) = x³ − 3x</span>, whose
          derivative is <span class="hi">f′(x) = 3x² − 3</span>. Setting that
          to zero: <span class="hi">x = ±1</span>. Move along the curve —
          watch the tangent flatten exactly at those two points, one a peak,
          one a valley.
        </p>
        <p>
          How do you tell which is which? The second derivative: if
          <span class="dx">f′′ &lt; 0</span> the curve bends downward
          (a maximum); if <span class="dx">f′′ &gt; 0</span> it bends upward
          (a minimum). Intuition first, rule second.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Maxima & Minima Explorer">
        <MaximaMinima />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import MaximaMinima from '@/components/interactive/MaximaMinima.vue'
</script>
