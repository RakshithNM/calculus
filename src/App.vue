<template>
  <NavBar />
  <main>
    <HeroSection />
    <ChapterTerrors />
    <ChapterSmallness />
    <ChapterRateOfChange />
    <ChapterPowerRule />
    <ChapterConstants />
    <ChapterProductRule />
    <ChapterSuccessive />
    <ChapterTimeVaries />
    <ChapterUsefulDodge />
    <ChapterSlopes />
    <ChapterMaxMin />
    <ChapterIntegration />
  </main>
  <SiteFooter />
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import ChapterTerrors from '@/components/chapters/ChapterTerrors.vue'
import ChapterSmallness from '@/components/chapters/ChapterSmallness.vue'
import ChapterRateOfChange from '@/components/chapters/ChapterRateOfChange.vue'
import ChapterPowerRule from '@/components/chapters/ChapterPowerRule.vue'
import ChapterConstants from '@/components/chapters/ChapterConstants.vue'
import ChapterProductRule from '@/components/chapters/ChapterProductRule.vue'
import ChapterSuccessive from '@/components/chapters/ChapterSuccessive.vue'
import ChapterTimeVaries from '@/components/chapters/ChapterTimeVaries.vue'
import ChapterUsefulDodge from '@/components/chapters/ChapterUsefulDodge.vue'
import ChapterSlopes from '@/components/chapters/ChapterSlopes.vue'
import ChapterMaxMin from '@/components/chapters/ChapterMaxMin.vue'
import ChapterIntegration from '@/components/chapters/ChapterIntegration.vue'
</script>
