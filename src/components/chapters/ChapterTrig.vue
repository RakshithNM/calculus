<template>
  <ChapterLayout id="trig" label="Chapter XV" title="How to Deal with Sines and Cosines">
    <template #prose>
      <div class="prose-block">
        <p>
          So far, we've dealt with algebraic functions (<span class="dx">x²</span>, <span class="dx">x³</span>) and exponential functions (<span class="dx">e^x</span>). Now we turn to the functions that go up and down: the trigonometric functions.
        </p>
        <p>
          If you plot <span class="dx">y = sin(x)</span>, it starts at 0, climbs to a peak at <span class="dx">x = π/2</span>, falls back through 0 at <span class="dx">x = π</span>, hits a valley at <span class="dx">x = 3π/2</span>, and returns to 0 at <span class="dx">x = 2π</span>.
        </p>
        <p>
          But what is its <em>rate of change</em>? Where is it growing the fastest? Right at the start! At <span class="dx">x = 0</span>, it's shooting upwards at a steep 45° angle (slope = 1). But as it reaches the top of the hill at <span class="dx">x = π/2</span>, it flattens out perfectly (slope = 0). Then it starts falling, getting steeper and steeper until it's plunging downwards at a 45° angle (slope = -1) when crossing the axis at <span class="dx">x = π</span>.
        </p>
        <blockquote>
          "The steepness of the sine curve is itself a cosine curve."
        </blockquote>
        <p>
          Mathematically: <span class="hi">If y = sin(x), then dy/dx = cos(x)</span>.
        </p>
        <p>
          And if you start with the cosine curve? It starts at a flat peak (slope = 0), and then falls. Because it starts by going <em>down</em>, its derivative is negative: <span class="hi">If y = cos(x), then dy/dx = -sin(x)</span>.
        </p>
        <p>
          Use the interactive below to see this beautiful relationship. Trace along the <span class="dx">base curve</span> in orange, and watch how its slope perfectly traces out the dashed <span class="dx">derivative curve</span> in blue! Notice how every peak and valley on the orange curve lines up perfectly with a zero on the blue curve.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Slopes of Waves">
        <TrigVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import TrigVis from '@/components/interactive/TrigVis.vue'
</script>
