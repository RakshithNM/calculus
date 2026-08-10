<template>
  <ChapterLayout id="power-rule" label="Chapter IV" title="The Simplest Cases: The Power Rule">
    <template #prose>
      <div class="prose-block">
        <p>
          The simplest functions are powers of <span class="dx">x</span>: x², x³, x⁵.
          Thompson shows they all differentiate by one elegant pattern — the power
          "comes down" and multiplies, then the exponent drops by one:
        </p>
        <blockquote>
          "If <em>y = xⁿ</em>, then <em>dy/dx = n · xⁿ⁻¹</em>."
        </blockquote>
        <p>
          So <span class="dx">x³</span> differentiates to <span class="hi">3x²</span>.
          The rate of change of a cube grows as a square. A straight line
          (<span class="dx">n = 1</span>) has a constant derivative — it changes at
          the same pace everywhere, which makes sense.
        </p>
        <p>
          Adjust <span class="dx">n</span> with the slider. The
          <span style="color:var(--warm)">amber curve</span> is the function; the
          <span style="color:var(--accent)">teal dashed curve</span> is its derivative.
          Notice how steeper functions have steeper derivatives.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Power Rule Explorer">
        <PowerRuleSVG />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import PowerRuleSVG from '@/components/interactive/PowerRuleSVG.vue'
</script>
