<script setup lang="ts">
import { projectStack, type Project } from '@/data/projects'
import ProjectActions from './ProjectActions.vue'
import ProjectLinkArrow from './ProjectLinkArrow.vue'
import ProjectReasons from './ProjectReasons.vue'
import ProjectStack from './ProjectStack.vue'

defineProps<{ project: Project; index: number; preview: boolean }>()
</script>

<template>
  <article v-if="preview" class="neo-card p-5 md:p-7">
    <div class="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
      <div class="min-w-0">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span class="text-muted">{{ project.context }}</span>
          <span>0{{ index + 1 }}</span>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <h2 class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{{ project.title }}</h2>
          <ProjectLinkArrow :project="project" />
        </div>
        <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{{ project.desc }}</p>

        <div class="mt-5 border-t border-(--border) pt-4">
          <h3 class="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">Pourquoi ce projet</h3>
          <ProjectReasons :reasons="project.reasons" variant="grid" />
        </div>
      </div>

      <aside class="flex flex-col gap-4 border-t border-(--border) pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <img
          v-if="project.detailImage"
          :src="project.detailImage"
          :alt="`Aperçu de ${project.title}`"
          class="aspect-video w-full border border-(--border) object-cover"
          loading="lazy"
        >

        <div>
          <h3 class="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">Stack</h3>
          <ProjectStack :items="projectStack(project)" variant="compact" />
        </div>

        <ProjectActions :project="project" compact class="mt-auto" />
      </aside>
    </div>
  </article>

  <article v-else class="neo-card p-6 md:p-10">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
      <span class="text-muted">{{ project.context }}</span>
      <span>0{{ index + 1 }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <h2 class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{{ project.title }}</h2>
      <ProjectLinkArrow :project="project" />
    </div>
    <p class="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{{ project.desc }}</p>

    <div class="mt-8 grid gap-8 border-t border-(--border) pt-8 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h3 class="mb-4 font-mono text-[10px] uppercase tracking-widest text-accent">Pourquoi ce projet</h3>
        <ProjectReasons :reasons="project.reasons" variant="list" />
      </div>

      <div>
        <h3 class="mb-4 font-mono text-[10px] uppercase tracking-widest text-accent">Stack</h3>
        <ProjectStack :items="projectStack(project)" variant="default" />
        <ProjectActions :project="project" class="mt-6" />
      </div>
    </div>
  </article>
</template>
