<template>
  <ChapterLayout id="area" label="Chapter XIX" title="On Finding Areas by Integrating">
    <template #prose>
      <div class="prose-block">
        <p>
          We now know that integrating is the reverse of differentiating. But how does this actually help us find the area under a curve?
        </p>
        <p>
          Suppose we want to find the exact area under the curve <span class="dx">y = x²</span>, starting from <span class="dx">x = a</span> and ending at <span class="dx">x = b</span>. 
        </p>
        <p>
          First, we integrate <span class="dx">x²</span> to find its "master" formula for area. By reversing the power rule, we know that integrating <span class="dx">x²</span> gives us <span class="hi">x³/3</span>.
        </p>
        <blockquote>
          "To find the area between two limits, you simply take the integral at the upper limit and subtract the integral at the lower limit."
        </blockquote>
        <p>
          This is called a <strong>Definite Integral</strong>. The area from <span class="dx">a</span> to <span class="dx">b</span> is simply the total area up to <span class="dx">b</span>, minus the "empty" area up to <span class="dx">a</span>.
        </p>
        <p>
          So, the area is exactly <span class="hi">(b³/3) - (a³/3)</span>.
        </p>
        <p>
          Try it out in the interactive below. You can drag the lower bound (<span class="dx">a</span>) and the upper bound (<span class="dx">b</span>) to calculate the exact area under the curve <span class="dx">y = x²</span>. Notice how the calculation flawlessly follows this simple subtraction rule!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · The Definite Integral">
        <DefiniteIntegralVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import DefiniteIntegralVis from '@/components/interactive/DefiniteIntegralVis.vue'
</script>
