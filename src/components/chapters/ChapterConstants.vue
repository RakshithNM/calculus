<template>
  <ChapterLayout id="constants" label="Chapter V" title="Next Stage. What to do with Constants">
    <template #prose>
      <div class="prose-block">
        <p>
          What happens when we differentiate a constant? Think about what a derivative is: it's a measure of <em>how fast something is changing</em>.
        </p>
        <p>
          But a constant, by definition, <em>never changes</em>. If <span class="dx">c = 5</span>, it will always be 5. Its rate of change is absolutely zero.
        </p>
        <blockquote>
          "The differential of any constant is zero."
        </blockquote>
        <p>
          Therefore, if you have an equation like <span class="dx">y = x² + c</span>, when you differentiate it, the <span class="dx">c</span> simply vanishes: <span class="hi">dy/dx = 2x</span>.
        </p>
        <p>
          Geometrically, adding a constant just moves the curve up or down. But it doesn't change the <em>steepness</em> (the slope) at any given <span class="dx">x</span> coordinate.
        </p>
        <p>
          In the interactive below, you can drag your mouse across the grid to move the point and see the slope (just like Chapter X). But now, you can also use the slider to change the constant <span class="dx">c</span>. Watch how the curve moves up and down, but the tangent's slope at any given <span class="dx">x</span> remains exactly the same!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · The Unchanging Slope">
        <ConstantsVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import ConstantsVis from '@/components/interactive/ConstantsVis.vue'
</script>
