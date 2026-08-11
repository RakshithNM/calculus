<template>
  <ChapterLayout id="rate-of-change" label="Chapter III" title="How Fast Does It Grow?">
    <template #prose>
      <div class="prose-block">
        <p>
          Here is the central question of all calculus: if <span class="dx">y</span>
          depends on <span class="dx">x</span>, <em>how fast does y change when x
          changes?</em> Not by how much - by how fast, per unit of x.
        </p>
        <p>
          Thompson answers it with a square. Suppose the side is <span class="dx">x = 3</span>,
          so the area is <span class="dx">y = x² = 9</span>. Now grow the side by a
          tiny bit <span class="dx">dx</span>. The new area is:
        </p>
        <blockquote>
          (x + dx)² = x² + <span class="hi">2x · dx</span> + dx²
        </blockquote>
        <p>
          Three pieces appear: the original square, two thin strips
          (<span class="hi">2x · dx</span>), and a tiny corner
          (<span class="dx">dx²</span>). When <span class="dx">dx</span> is very
          small, the corner is <em>negligibly small</em> compared to the strips - 
          a small times a small is a very small indeed.
        </p>
        <p>
          Drop the corner. The change in area is just
          <span class="hi">2x · dx</span>. Divide both sides by
          <span class="dx">dx</span> and you have the rate of change:
          <span class="hi">dy/dx = 2x</span>. The power rule didn't come from
          nowhere - it came from this square.
        </p>
        <p>
          This procedure - growing <span class="dx">x</span> by
          <span class="dx">dx</span>, finding the resulting change
          <span class="dx">dy</span>, dividing, then letting
          <span class="dx">dx</span> vanish - is called
          <span class="hi">differentiation</span>. The result,
          <span class="hi">dy/dx</span>, is the <span class="hi">derivative</span>.
          Every shortcut and rule in calculus is just a faster way of
          doing exactly this.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · The Growing Square">
        <GrowingSquare />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import GrowingSquare from '@/components/interactive/GrowingSquare.vue'
</script>
