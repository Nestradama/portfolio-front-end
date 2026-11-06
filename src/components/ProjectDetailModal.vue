<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Project } from '@/data/projects'
import ProjectActions from './ProjectActions.vue'
import ProjectLinkArrow from './ProjectLinkArrow.vue'
import ModalShell from './modals/ModalShell.vue'

const props = defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()

const zoomOpen = ref(false)
const zoomLayer = ref<HTMLElement | null>(null)
const zoomTrigger = ref<HTMLElement | null>(null)
const imageUrl = computed(() => props.project?.detailImage || props.project?.image || '')

watch(zoomOpen, async (open) => {
  if (!open) {
    // Return focus to the thumbnail so keyboard users keep their place.
    zoomTrigger.value?.focus()
    return
  }

  await nextTick()
  zoomLayer.value?.focus()
})

watch(
  () => props.project,
  () => {
    zoomOpen.value = false
  },
)
</script>

<template>
  <ModalShell :open="project !== null" :title="project?.title ?? ''" wide hide-title @close="emit('close')">
    <div v-if="project" class="space-y-6">
      <div class="space-y-3">
        <div class="pr-10 font-mono text-[10px] uppercase tracking-widest text-muted">{{ project.context }}</div>

        <!-- The title and gradient ignore pointer events so the whole banner stays clickable;
             the arrow opts back in because it is a real link. -->
        <div v-if="imageUrl" class="relative overflow-hidden border border-(--border)">
          <button ref="zoomTrigger" type="button" class="block w-full" aria-label="Agrandir l’aperçu" @click="zoomOpen = true">
            <img :src="imageUrl" alt="" class="h-40 w-full object-cover sm:h-48">
          </button>
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--card)] via-black/40 to-transparent"></div>
          <div class="pointer-events-none absolute inset-x-4 bottom-3 flex flex-wrap items-center gap-3">
            <h2 class="font-heading text-2xl font-bold sm:text-3xl">{{ project.title }}</h2>
            <ProjectLinkArrow :project="project" overlay class="pointer-events-auto" />
          </div>
        </div>

        <div v-else class="flex flex-wrap items-center gap-3">
          <h2 class="font-heading text-2xl font-bold">{{ project.title }}</h2>
          <ProjectLinkArrow :project="project" />
        </div>
      </div>

      <p class="text-sm leading-relaxed text-muted sm:text-base">{{ project.desc }}</p>

      <div class="grid gap-6 sm:grid-cols-2">
        <div v-if="project.reasons.length">
          <h3 class="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">Pourquoi ce projet</h3>
          <ul class="space-y-2">
            <li
              v-for="reason in project.reasons"
              :key="reason"
              class="flex gap-2 text-sm leading-relaxed text-muted"
            >
              <span class="mt-0.5 text-pink" aria-hidden="true">↳</span>
              <span>{{ reason }}</span>
            </li>
          </ul>
        </div>

        <div v-if="(project.detailedStack.length ? project.detailedStack : project.stack).length">
          <h3 class="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">Stack</h3>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in (project.detailedStack.length ? project.detailedStack : project.stack)"
              :key="tech"
              class="border border-(--border) px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
            >{{ tech }}</span>
          </div>
        </div>
      </div>

      <ProjectActions :project="project" />
    </div>
  </ModalShell>

  <!-- Escape is handled here with `.stop` so ModalShell's window listener does not also close
       the project modal while the user is only dismissing the image preview. -->
  <Teleport to="body">
    <div
      v-if="zoomOpen && project"
      ref="zoomLayer"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      :aria-label="`Aperçu de ${project.title}`"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 outline-none"
      @click.self="zoomOpen = false"
      @keydown.esc.stop="zoomOpen = false"
    >
      <button
        type="button"
        class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 text-lg text-white/80 transition-colors hover:border-accent hover:text-accent"
        aria-label="Fermer l’aperçu"
        @click="zoomOpen = false"
      >✕</button>
      <img :src="imageUrl" :alt="`Aperçu de ${project.title}`" class="max-h-[85vh] max-w-full object-contain">
    </div>
  </Teleport>
</template>
