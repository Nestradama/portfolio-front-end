<script setup lang="ts">
import HeroShell from '@/components/hero/HeroShell.vue'
import ProjectsCarousel from '@/components/ProjectsCarousel.vue'
import VitrineSection from '@/components/VitrineSection.vue'
import { useContent } from '@/composables/useContent'

const emit = defineEmits<{ openPrivacy: [] }>()
const { settings } = useContent()
</script>

<template>
  <HeroShell v-if="settings.sections.homeHero" @open-privacy="emit('openPrivacy')" />
  <ProjectsCarousel v-if="settings.sections.homeProjects" />
  <VitrineSection v-if="settings.sections.homeVitrines" location="home" />
</template>
