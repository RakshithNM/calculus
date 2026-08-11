<template>
  <ChapterLayout id="solutions" label="Chapter XXI" title="Finding Some Solutions">
    <template #prose>
      <div class="prose-block">
        <p>
          We have arrived at the grand finale of Thompson's book: <strong>Differential Equations</strong>. 
        </p>
        <p>
          Until now, we have mostly been given a function (like <span class="dx">y = x²</span>) and asked to find its slope (<span class="hi">dy/dx</span>), or vice versa. But what if we are given an equation that describes a <em>relationship</em> between a function and its slope, and we have to figure out what the function actually is?
        </p>
        <p>
          For example: <span class="hi">dy/dx = y</span>. 
        </p>
        <p>
          This says: "Find me a function whose steepness is exactly equal to its height." As we learned in Chapter 14, the only function that does this is the organic growth curve, <span class="dx">y = e^x</span>. 
        </p>
        <p>
          Or how about <span class="hi">dy/dx = -x/y</span>? If you solve this, you get <span class="dx">x² + y² = C</span>, which is the equation for a circle!
        </p>
        <blockquote>
          "A differential equation is an equation containing differential coefficients. The process of finding what function it came from is called <em>solving</em> the differential equation."
        </blockquote>
        <p>
          But the most beautiful way to understand differential equations is to simply <em>look at them</em>. If an equation tells you the slope (<span class="dx">dy/dx</span>) at every point in space, you can draw a little line at every point showing that slope. This is called a <strong>Slope Field</strong>.
        </p>
        <p>
          In the interactive below, choose a differential equation. The background shows its slope field. <strong>Click anywhere on the graph</strong> to drop an initial starting point. The computer will just follow the slopes, tracing out the hidden function right before your eyes!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Slope Fields">
        <DifferentialEqVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import DifferentialEqVis from '@/components/interactive/DifferentialEqVis.vue'
</script>
