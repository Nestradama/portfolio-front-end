<script setup lang="ts">
const headingId = "projects-title"

import { ref, onMounted, onBeforeUnmount } from 'vue'
import SectionHeader from './SectionHeader.vue'
import { projects } from '@/data/projects'

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

    <div class="relative w-full">
      <div ref="track" class="flex gap-4 sm:gap-8 w-max smooth-glide pt-2 pb-6" :style="{ transform: `translateX(-${currentPos}px)` }">
        <div class="shrink-0 w-px"></div>
        <article v-for="project in projects" :key="project.id" class="neo-card p-6 w-65 sm:w-[320px] md:w-87.5 flex flex-col shrink-0 min-h-62.5 sm:min-h-70">
          <div class="font-mono text-xs text-pink mb-2 uppercase tracking-tighter">0{{ project.id }} // Projet</div>
          <h3 class="font-heading text-xl sm:text-2xl font-bold mb-3">{{ project.title }}</h3>
          <p class="text-xs sm:text-sm text-muted leading-relaxed mb-6 line-clamp-3">{{ project.shortDesc }}</p>
          <div class="flex flex-wrap gap-2 mt-auto">
            <span v-for="tech in project.stack" :key="tech" class="text-xs font-mono border border-(--border) px-2 py-0.5">{{ tech }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>