<template>
  <NavBar />
  <main>
    <HeroSection />
    <ChapterSmallness />
    <ChapterRateOfChange />
    <ChapterPowerRule />
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
import ChapterSmallness from '@/components/chapters/ChapterSmallness.vue'
import ChapterRateOfChange from '@/components/chapters/ChapterRateOfChange.vue'
import ChapterPowerRule from '@/components/chapters/ChapterPowerRule.vue'
import ChapterSlopes from '@/components/chapters/ChapterSlopes.vue'
import ChapterMaxMin from '@/components/chapters/ChapterMaxMin.vue'
import ChapterIntegration from '@/components/chapters/ChapterIntegration.vue'
</script>
