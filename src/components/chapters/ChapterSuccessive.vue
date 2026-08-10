<template>
  <ChapterLayout id="successive" label="Chapter VII" title="Successive Differentiation">
    <template #prose>
      <div class="prose-block">
        <p>
          If you differentiate a function, you get its rate of change. But what happens if you differentiate <em>that</em> result again?
        </p>
        <p>
          Thompson calls this <strong>Successive Differentiation</strong>. If <span class="dx">y</span> is your original function, its first derivative is <span class="hi">dy/dx</span> (how fast <span class="dx">y</span> is changing). Its second derivative is written as <span class="hi">d²y/dx²</span>, which simply means: how fast is <span class="hi">dy/dx</span> changing?
        </p>
        <blockquote>
          "Let us try the experiment of differentiating a function twice over."
        </blockquote>
        <p>
          If <span class="dx">y = 0.2x³ - 2x</span>, the first derivative is <span class="dx">dy/dx = 0.6x² - 2</span>. The second derivative is <span class="dx">d²y/dx² = 1.2x</span>. Each time you differentiate, the power rule bumps the exponent down by one.
        </p>
        <p>
          This has profound physical meaning. If <span class="dx">y</span> is position, then <span class="hi">dy/dx</span> is velocity (how fast position changes), and <span class="hi">d²y/dx²</span> is acceleration (how fast velocity changes).
        </p>
        <p>
          In the interactive below, you can see all three functions plotted together. Move your mouse along the x-axis to track a point across all three curves simultaneously. Use the buttons to isolate specific curves and see how the slope of one curve becomes the height of the next!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Tracing the Derivatives">
        <SuccessiveVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import SuccessiveVis from '@/components/interactive/SuccessiveVis.vue'
</script>
