<template>
  <ChapterLayout id="dodges" label="Chapter XX" title="Dodges, Pitfalls, and Triumphs">
    <template #prose>
      <div class="prose-block">
        <p>
          Just as differentiation had its useful "dodges" (like the Chain Rule), integration has its own bag of tricks. But integration is notoriously trickier. While anyone can learn to differentiate almost anything by blindly following rules, integration requires a bit of art, intuition, and sometimes, a clever dodge.
        </p>
        <p>
          Thompson covers several methods in this chapter, such as substitution and partial fractions. But the crowning triumph of integration dodges is <strong>Integration by Parts</strong>.
        </p>
        <p>
          It stems from the Product Rule of differentiation. The formula looks like a strange algebra puzzle:
        </p>
        <blockquote>
          <span class="hi">∫ u dv = uv - ∫ v du</span>
        </blockquote>
        <p>
          It says: "If you have a really hard integral (<span class="dx">∫ u dv</span>), you can trade it for a completely different integral (<span class="dx">∫ v du</span>) minus a simple rectangle (<span class="dx">uv</span>). If you choose wisely, the new integral might be much easier to solve!"
        </p>
        <p>
          This sounds like abstract magic, but it is actually a beautiful geometric truth. Imagine a curve plotted on a graph where the horizontal axis is <span class="dx">u</span> and the vertical axis is <span class="dx">v</span>. 
        </p>
        <p>
          In the interactive below, the <strong>Amber area</strong> represents the integral of <span class="dx">v</span> with respect to <span class="dx">u</span>. The <strong>Teal area</strong> represents the integral of <span class="dx">u</span> with respect to <span class="dx">v</span>. Together, they perfectly form a rectangle with area <span class="dx">u × v</span>. If you know the area of the rectangle, and you can calculate one of the shapes, you get the other one for free!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Geometry of Parts">
        <IntegrationDodgesVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import IntegrationDodgesVis from '@/components/interactive/IntegrationDodgesVis.vue'
</script>
