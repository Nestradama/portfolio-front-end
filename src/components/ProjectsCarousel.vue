<script setup lang="ts">
const headingId = "projects-title"

import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import SectionHeader from './SectionHeader.vue'
import ProjectCard from './ProjectCard.vue'
import TagFilters from './TagFilters.vue'
import { useContent } from '@/composables/useContent'

const { projects, settings } = useContent()
const activeTag = ref('')
const featuredProjects = computed(() => projects.value.filter((project) => project.featured !== false))
const tags = computed(() =>
  [...new Set(featuredProjects.value.flatMap((project) => project.tags ?? []))].sort((a, b) =>
    a.localeCompare(b),
  ),
)
const visibleProjects = computed(() =>
  activeTag.value
    ? featuredProjects.value.filter((project) => (project.tags ?? []).includes(activeTag.value))
    : featuredProjects.value,
)

const track = ref<HTMLElement | null>(null)
const currentPos = ref(0)

function slide(direction: 1 | -1) {
  if (!track.value) return
  const cardW = (track.value.children[1] as HTMLElement)?.offsetWidth ?? 0
  const gap = window.innerWidth < 640 ? 16 : 32
  const max = track.value.scrollWidth - track.value.parentElement!.clientWidth
  currentPos.value = Math.min(Math.max(currentPos.value + direction * (cardW + gap), 0), max)
}

function reset() {
  currentPos.value = 0
}

onMounted(() => window.addEventListener('resize', reset))
onBeforeUnmount(() => window.removeEventListener('resize', reset))
</script>

<template>
  <section class="mb-20 sm:mb-40 overflow-hidden" :aria-labelledby="headingId">
    <SectionHeader :section-name="'Projets'" :headingId="headingId">
      <template #actions>
        <div class="flex gap-2">
          <button class="w-10 h-10 border border-(--border) flex items-center justify-center hover:bg-accent hover:text-black transition-colors" aria-label="Projet précédent" @click="slide(-1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button class="w-10 h-10 border border-(--border) flex items-center justify-center hover:bg-accent hover:text-black transition-colors" aria-label="Projet suivant" @click="slide(1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </template>
    </SectionHeader>

    <TagFilters v-if="settings.sections.homeFilters && tags.length" v-model="activeTag" :tag-names="tags" />

    <div class="relative w-full">
      <div ref="track" class="flex gap-4 sm:gap-8 w-max smooth-glide pt-2 pb-6" :style="{ transform: `translateX(-${currentPos}px)` }">
        <div class="shrink-0 w-px"></div>
        <ProjectCard v-for="(project, index) in visibleProjects" :key="project.id" :project="project" :index="index" />
      </div>
    </div>
  </section>
</template>