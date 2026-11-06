<script setup lang="ts">
import type { Project } from '@/data/projects'
import ModalShell from './modals/ModalShell.vue'

defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <ModalShell :open="project !== null" :title="project?.title ?? ''" wide @close="emit('close')">
    <div v-if="project" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
        <span>{{ project.context }}</span>
        <span v-if="project.tags?.length">{{ project.tags.join(' · ') }}</span>
      </div>

      <p class="text-sm leading-relaxed text-muted sm:text-base">{{ project.desc }}</p>

      <img
        v-if="project.detailImage || project.image"
        :src="(project.detailImage || project.image) ?? ''"
        :alt="`Aperçu de ${project.title}`"
        class="aspect-video w-full border border-(--border) object-cover"
        loading="lazy"
      >

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

      <a
        v-if="project.link"
        :href="project.link"
        class="inline-flex border border-(--border) px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-accent hover:text-black"
      >{{ project.linkText || 'Voir le projet' }} ↗</a>
      <span
        v-else-if="project.linkText"
        class="inline-flex border border-(--border) px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted/60"
      >{{ project.linkText }}</span>
    </div>
  </ModalShell>
</template>
