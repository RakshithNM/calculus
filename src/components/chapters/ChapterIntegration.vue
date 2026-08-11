<template>
  <ChapterLayout id="integration" label="Chapter XVII" title="Integration: Adding Up Little Bits">
    <template #prose>
      <div class="prose-block">
        <p>
          Integration is differentiation's mirror. It means adding up an
          <span class="hi">infinite number of infinitely thin slices</span> to find
          a total — most famously, the area under a curve.
        </p>
        <blockquote>
          "The process of adding up the little bits of <em>y · dx</em> is called
          <em>integration</em>."
        </blockquote>
        <p>
          The symbol <span class="hi">∫</span> is simply a stretched-out
          <span class="hi">S</span> — standing for <em>Sum</em>. So
          <span class="dx">∫ y · dx</span> reads literally as
          "the sum of all the little <span class="dx">y · dx</span> pieces."
          The notation tells you exactly what the operation does.
        </p>
        <p>
          To find the exact area, divide the region into narrow rectangles. As they
          grow thinner and more numerous, the sum converges to the true value. The
          slider shows this convergence — watch imprecision settle into precision.
        </p>
        <p>
          For <span class="dx">y = x²</span> from 0 to 2, the exact integral is
          <span class="hi">8/3 ≈ 2.667</span>. Pull the slider to the right and
          watch the approximation approach it from above.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Riemann Sum">
        <RiemannSum />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import RiemannSum from '@/components/interactive/RiemannSum.vue'
</script>
