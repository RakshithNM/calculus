<template>
  <ChapterLayout id="organic-growth" label="Chapter XIV" title="On True Compound Interest and the Law of Organic Growth">
    <template #prose>
      <div class="prose-block">
        <p>
          We now arrive at one of the most important concepts in all of mathematics: the number <span class="dx">e</span>.
        </p>
        <p>
          Thompson calls it "the law of organic growth." In nature, things don't grow by a fixed amount every day. They grow by a percentage of <em>how much is already there</em>. Your money in the bank grows faster the more money you have. A population of bacteria grows faster the more bacteria there are. 
        </p>
        <blockquote>
          "The rate of growth is proportional to the amount already grown."
        </blockquote>
        <p>
          If we want to find a function where the rate of growth (<span class="hi">dy/dx</span>) is exactly equal to its height (<span class="dx">y</span>), there is only one mathematical curve in the universe that does this: <span class="dx">y = e^x</span>. 
        </p>
        <p>
          If you differentiate <span class="dx">e^x</span>, you just get <span class="dx">e^x</span> back. It is completely immune to differentiation!
        </p>
        <p>
          In the interactive below, trace the curve of <span class="dx">y = e^x</span>. We measure its <strong>Height</strong> (the orange line) and we measure its <strong>Slope</strong> (the blue triangle, where <span class="dx">dx = 1</span> so <span class="dx">dy</span> is the slope). Watch the readout below the graph. No matter where you go on the curve, the steepness is exactly equal to the height!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Height = Slope">
        <OrganicGrowthVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import OrganicGrowthVis from '@/components/interactive/OrganicGrowthVis.vue'
</script>
