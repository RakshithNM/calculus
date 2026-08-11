<template>
  <ChapterLayout id="slopes" label="Chapter X" title="Geometrical Meaning of Differentiation">
    <template #prose>
      <div class="prose-block">
        <p>
          The derivative has a beautiful geometric interpretation. If you zoom in
          infinitely close to any smooth curve, it looks perfectly straight — and
          the derivative gives the <span class="hi">slope of that line</span>.
        </p>
        <blockquote>
          "The slope of the tangent at any point of a curve is the value of
          <em>dy/dx</em> at that point."
        </blockquote>
        <p>
          For the parabola <span class="dx">y = x²</span>, the derivative is
          <span class="hi">2x</span>. At <span class="dx">x = 1</span> the slope
          is 2; at <span class="dx">x = −1</span> it's −2; at the very bottom it's
          exactly zero — the curve is momentarily flat.
        </p>
        <p>
          Move your mouse (or touch) across the graph. The tangent line pivots
          and the slope readout updates in real time. The sign of the slope tells
          you whether the function is rising or falling.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Tangent Line Explorer">
        <TangentExplorer />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import TangentExplorer from '@/components/interactive/TangentExplorer.vue'
</script>
