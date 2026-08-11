<template>
  <ChapterLayout id="reverse" label="Chapter XVIII" title="Integrating as the Reverse of Differentiating">
    <template #prose>
      <div class="prose-block">
        <p>
          In the previous chapter, we learned that Integration is the process of adding up an infinite number of infinitely thin slices (finding the Area).
        </p>
        <p>
          But integration has a second, equally important face: it is exactly the <strong>opposite of differentiation</strong>. 
        </p>
        <blockquote>
          "If you differentiate <span class="dx">y = x²</span>, you get <span class="hi">dy/dx = 2x</span>. Therefore, if you integrate <span class="dx">2x</span>, you must get back to <span class="hi">x²</span>."
        </blockquote>
        <p>
          This mirror relationship is known as the <strong>Fundamental Theorem of Calculus</strong>. Differentiation and Integration are two halves of the exact same idea, like addition and subtraction, or multiplication and division.
        </p>
        <p>
          Think about physics: if you know that a car's distance is <span class="dx">x²</span>, you differentiate to find its speed is <span class="dx">2x</span>. But if you only know its speed is <span class="dx">2x</span>, you can <em>integrate</em> that speed over time to find the total distance traveled (<span class="dx">x²</span>)!
        </p>
        <p>
          The interactive below proves this visually. It shows two graphs side-by-side. 
          Move the slider to see how the <strong>Area</strong> of the top graph becomes the <strong>Height</strong> of the bottom graph. And simultaneously, the <strong>Height</strong> of the top graph is exactly the <strong>Slope</strong> of the bottom graph!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Two Faces of the Same Coin">
        <ReverseVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import ReverseVis from '@/components/interactive/ReverseVis.vue'
</script>
