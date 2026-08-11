<template>
  <ChapterLayout id="die-away" label="Chapter XIV (Part II)" title="The Die-away Curve">
    <template #prose>
      <div class="prose-block">
        <p>
          We just saw how <span class="dx">e^x</span> models organic growth, where a quantity grows faster the larger it gets. But what about the reverse? What if a quantity <em>shrinks</em> based on how much is left?
        </p>
        <p>
          Thompson calls this the <strong>Die-away Curve</strong>. It models a cooling cup of coffee, radioactive decay, or a discharging capacitor. The mathematical formula is <span class="dx">y = e^{-x}</span>.
        </p>
        <blockquote>
          "As the curve descends, its steepness decreases. Its slope is negative, but the magnitude of the downward slope is exactly equal to the height at that instant."
        </blockquote>
        <p>
          In calculus terms: <span class="hi">dy/dx = -y</span>. 
        </p>
        <p>
          This leads to a beautifully simple geometric fact: if you draw a tangent line touching the curve at <em>any</em> point, it will always cross the x-axis exactly 1 unit ahead of where you are!
        </p>
        <p>
          In the interactive below, trace the die-away curve. The orange line shows your current Height (<span class="dx">y</span>). The blue line is your Tangent. Notice how the base of the triangle (<span class="dx">dx</span>) is completely locked at 1. The curve gets shallower precisely as it gets shorter, maintaining that perfect proportion all the way to infinity.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · The 1-Unit Tangent Rule">
        <DieAwayVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import DieAwayVis from '@/components/interactive/DieAwayVis.vue'
</script>
