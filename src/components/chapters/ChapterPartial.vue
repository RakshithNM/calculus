<template>
  <ChapterLayout id="partial" label="Chapter XVI" title="Partial Differentiation">
    <template #prose>
      <div class="prose-block">
        <p>
          Until now, we have only looked at functions that depend on a single variable (like <span class="dx">y</span> depending on <span class="dx">x</span>). But in the real world, things often depend on two or more variables at once!
        </p>
        <p>
          Take a cylinder. Its volume (<span class="dx">V</span>) depends on both its radius (<span class="dx">r</span>) and its height (<span class="dx">h</span>). The formula is <span class="hi">V = πr²h</span>.
        </p>
        <p>
          If you want to know how fast the volume changes, you have to specify: <em>changes when I do what?</em> Do you mean when you stretch the cylinder taller? Or when you make it wider? 
        </p>
        <p>
          To solve this, Thompson introduces <strong>Partial Differentiation</strong>. The rule is incredibly simple: if you want to differentiate with respect to <span class="dx">r</span>, you just pretend <span class="dx">h</span> is a constant number (like 5), and differentiate normally! We write this as <span class="hi">∂V/∂r</span>.
        </p>
        <blockquote>
          "A partial differential coefficient is simply one in which the differentiation has been performed with respect to one independent variable, while all the other independent variables have been kept constant."
        </blockquote>
        <p>
          Let's try it on <span class="dx">V = πr²h</span>:
          <br>1. Varying <span class="dx">r</span> (treat <span class="dx">h</span> as constant): <span class="hi">∂V/∂r = 2πrh</span>.
          <br>2. Varying <span class="dx">h</span> (treat <span class="dx">r</span> as constant): <span class="hi">∂V/∂h = πr²</span>.
        </p>
        <p>
          This isn't just abstract math - it has a beautiful physical meaning! Look at the interactive below. When you vary the radius, the added volume is a thin shell wrapped around the outside (Area = <span class="dx">2πrh</span>). When you vary the height, the added volume is a thin flat slice added to the top (Area = <span class="dx">πr²</span>). The math perfectly matches the geometry!
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="Interactive · Growing a Cylinder">
        <PartialVis />
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
import PartialVis from '@/components/interactive/PartialVis.vue'
</script>
