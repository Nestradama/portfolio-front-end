<script setup lang="ts">
import HeroShell from '@/components/hero/HeroShell.vue'
import ProjectsCarousel from '@/components/ProjectsCarousel.vue'
import VitrineSection from '@/components/VitrineSection.vue'

const emit = defineEmits<{ openPrivacy: [] }>()
</script>

<template>
  <HeroShell @open-privacy="emit('openPrivacy')" />
  <ProjectsCarousel />
  <VitrineSection />
</template>
