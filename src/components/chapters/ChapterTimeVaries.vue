<template>
  <ChapterLayout id="time-varies" label="Chapter VIII" title="When Time Varies">
    <template #prose>
      <div class="prose-block">
        <p>
          Calculus isn't just about abstract curves; it's the language of the physical universe. When our independent variable is <em>time</em> (<span class="dx">t</span>), those successive derivatives take on names you already know.
        </p>
        <p>
          Let <span class="dx">y</span> be the height of a thrown ball. 
          The first derivative with respect to time, <span class="hi">dy/dt</span>, tells us how fast the height is changing. This is <strong>velocity</strong>.
        </p>
        <p>
          The second derivative, <span class="hi">d²y/dt²</span>, tells us how fast the velocity is changing. This is <strong>acceleration</strong>.
        </p>
        <blockquote>
          "The rate of change of the rate of change of the distance is the acceleration."
        </blockquote>
        <p>
          If we throw a ball upward with an initial velocity of 40 m/s, under Earth's gravity, its height is <span class="dx">y = 40t - 4.9t²</span>. 
          By the power rule, its velocity is <span class="hi">dy/dt = 40 - 9.8t</span>. 
          Differentiate again, and its acceleration is <span class="hi">d²y/dt² = -9.8</span>.
        </p>
        <p>
          Notice how the acceleration is a <em>constant</em> negative number? Gravity pulls down at exactly the same rate, regardless of whether the ball is flying up, paused at its peak, or falling down! Press Play on the interactive below to see this in motion.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · The Physics of a Falling Ball">
        <TimeVariesVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import TimeVariesVis from '@/components/interactive/TimeVariesVis.vue'
</script>
