<template>
  <ChapterLayout id="product-rule" label="Chapter VI" title="Sums, Differences, Products, and Quotients">
    <template #prose>
      <div class="prose-block">
        <p>
          Thompson provides a beautiful geometric intuition for differentiating a product of two variables, <span class="dx">u</span> and <span class="dx">v</span>. Instead of just memorizing a rule, he asks you to imagine a rectangle with width <span class="dx">u</span> and height <span class="dx">v</span>.
        </p>
        <p>
          The area is <span class="hi">uv</span>. Now, suppose the rectangle grows a tiny bit: the width grows by <span class="dx">du</span> and the height grows by <span class="dx">dv</span>.
        </p>
        <blockquote>
          "The new area is (u + du)(v + dv) = uv + u·dv + v·du + du·dv."
        </blockquote>
        <p>
          The original area is <span class="hi">uv</span>. The growth consists of three new pieces:
          a strip on the bottom (<span class="dx">u·dv</span>), a strip on the side (<span class="dx">v·du</span>), and a tiny little rectangle in the corner (<span class="hi">du·dv</span>).
        </p>
        <p>
          But remember the lesson of <em>degrees of smallness</em>! If <span class="dx">du</span> and <span class="dx">dv</span> are both small, then their product <span class="hi">du·dv</span> is a <em>small quantity of the second order</em>. It is so microscopically tiny compared to the strips that we can throw it away.
        </p>
        <p>
          Adjust the sliders below to shrink <span class="dx">du</span> and <span class="dx">dv</span>. Watch how the corner piece <span class="hi">du·dv</span> shrinks much faster than the strips until it becomes utterly negligible.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Growing Rectangle">
        <GrowingRectangle />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import GrowingRectangle from '@/components/interactive/GrowingRectangle.vue'
</script>
