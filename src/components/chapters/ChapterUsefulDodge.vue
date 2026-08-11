<template>
  <ChapterLayout id="useful-dodge" label="Chapter IX" title="Introducing a Useful Dodge">
    <template #prose>
      <div class="prose-block">
        <p>
          Sometimes you have a function buried inside another function. How do you find the rate of change of the outer one with respect to the innermost variable?
        </p>
        <p>
          Thompson calls his solution a "useful dodge"—which we now know as the <strong>Chain Rule</strong>. He explains it with a very intuitive idea: if <span class="dx">y</span> depends on <span class="dx">u</span>, and <span class="dx">u</span> depends on <span class="dx">x</span>, their rates of change simply multiply together.
        </p>
        <blockquote>
          "If <em>y</em> depends on <em>u</em>, and <em>u</em> depends on <em>x</em>, then the rate of variation of <em>y</em> with regard to <em>x</em> is the product of the rate of variation of <em>y</em> with regard to <em>u</em>, and that of <em>u</em> with regard to <em>x</em>."
        </blockquote>
        <p>
          Think of it like a chain of gears or pulleys. If gear <span class="dx">u</span> turns twice as fast as gear <span class="dx">x</span> (so <span class="hi">du/dx = 2</span>), and gear <span class="dx">y</span> turns three times as fast as gear <span class="dx">u</span> (so <span class="hi">dy/du = 3</span>), then how fast does <span class="dx">y</span> turn relative to <span class="dx">x</span>? 
          It turns <span class="hi">2 × 3 = 6</span> times as fast!
        </p>
        <p>
          Mathematically: <span class="hi">dy/dx = (dy/du) × (du/dx)</span>. It looks like you're just cancelling the <span class="dx">du</span>'s as if they were ordinary fractions. And because they represent "a little bit of," you actually can!
        </p>
        <p>
          Play with the sliders below to adjust the "gear ratios" and watch how the final speed of <span class="dx">y</span> is purely a product of the links in the chain.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · The Chain Rule Pulleys">
        <UsefulDodgeVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import UsefulDodgeVis from '@/components/interactive/UsefulDodgeVis.vue'
</script>
