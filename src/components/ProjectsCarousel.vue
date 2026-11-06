<script setup lang="ts">
const headingId = "projects-title"

import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import SectionHeader from './SectionHeader.vue'
import ProjectCard from './ProjectCard.vue'
import ProjectDetailModal from './ProjectDetailModal.vue'
import TagFilters from './TagFilters.vue'
import { useContent } from '@/composables/useContent'
import type { Project } from '@/data/projects'

const { projects, settings, tags: tagCatalog } = useContent()
const activeTag = ref('')
const selectedProject = ref<Project | null>(null)
const featuredProjects = computed(() => projects.value.filter((project) => project.featured !== false))
const hiddenTags = computed(
  () => new Set((tagCatalog.value ?? []).filter((tag) => tag.visible === false).map((tag) => tag.name)),
)
const tags = computed(() =>
  [...new Set(featuredProjects.value.flatMap((project) => project.tags ?? []))]
    .filter((tag) => !hiddenTags.value.has(tag))
    .sort((a, b) => a.localeCompare(b)),
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

function selectTag(value: string) {
  activeTag.value = value
  // A new filter replaces the rail content; start from the first card so no result
  // stays off-screen because of the previous scroll position.
  reset()
}

function revealCard(event: FocusEvent) {
  const trackEl = track.value
  const target = event.target
  const viewport = trackEl?.parentElement
  if (!trackEl || !viewport || !(target instanceof HTMLElement)) return

  const card = target.closest('article')
  if (!card) return

  const cardRect = card.getBoundingClientRect()
  const viewportRect = viewport.getBoundingClientRect()
  const gap = window.innerWidth < 640 ? 16 : 32
  const max = trackEl.scrollWidth - viewport.clientWidth

  if (cardRect.left < viewportRect.left) {
    currentPos.value = Math.max(0, currentPos.value - (viewportRect.left - cardRect.left) - gap)
  } else if (cardRect.right > viewportRect.right) {
    currentPos.value = Math.min(max, currentPos.value + (cardRect.right - viewportRect.right) + gap)
  }

  // The browser may scroll the clipping container to reveal the focused card. Keep
  // the section heading and filters anchored while the rail itself moves.
  const section = trackEl.closest('section')
  if (section) section.scrollLeft = 0
}

onMounted(() => window.addEventListener('resize', reset))
onBeforeUnmount(() => window.removeEventListener('resize', reset))
</script>

<template>
  <section class="mb-20 sm:mb-40 overflow-x-clip" :aria-labelledby="headingId">
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

    <TagFilters
      v-if="settings.sections.homeFilters && tags.length"
      :model-value="activeTag"
      :tag-names="tags"
      @update:model-value="selectTag"
    />

    <div class="relative w-full">
      <div ref="track" class="flex gap-4 sm:gap-8 w-max smooth-glide pt-2 pb-6" :style="{ transform: `translateX(-${currentPos}px)` }" @focusin="revealCard">
        <div class="shrink-0 w-px"></div>
        <ProjectCard v-for="(project, index) in visibleProjects" :key="project.id" :project="project" :index="index" @open="selectedProject = $event" />
      </div>
    </div>

    <ProjectDetailModal :project="selectedProject" @close="selectedProject = null" />
  </section>
</template>