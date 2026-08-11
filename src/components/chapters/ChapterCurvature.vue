<template>
  <ChapterLayout id="curvature" label="Chapter XII" title="Curvature of Curves">
    <template #prose>
      <div class="prose-block">
        <p>
          We know that the first derivative (<span class="hi">dy/dx</span>) tells us the slope of a curve. But what does the second derivative (<span class="hi">d²y/dx²</span>) tell us geometrically? 
        </p>
        <p>
          Thompson explains that the second derivative tells us the <strong>curvature</strong>—whether the curve is bending upwards or bending downwards.
        </p>
        <blockquote>
          "If the second differential coefficient is positive, the curve is concave upwards... If the second differential coefficient is negative, the curve is concave downwards."
        </blockquote>
        <p>
          Think of a bowl. If <span class="dx">d²y/dx² > 0</span>, the curve is shaped like a cup (concave up), holding water. If <span class="dx">d²y/dx² < 0</span>, it is shaped like an umbrella (concave down), shedding water.
        </p>
        <p>
          If <span class="dx">d²y/dx² = 0</span>, the curve is momentarily perfectly straight. This is called a <em>point of inflection</em>—the exact moment where the curve switches from bending one way to bending the other.
        </p>
        <p>
          In the interactive below, trace the curve. Notice the <strong>osculating circle</strong> (the "kissing circle"). This circle perfectly hugs the curve, visualizing its curvature. When <span class="dx">d²y/dx²</span> is positive, the circle sits above the curve. When negative, it hangs below!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · The Kissing Circle">
        <CurvatureVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import CurvatureVis from '@/components/interactive/CurvatureVis.vue'
</script>
