<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContent } from '@/composables/useContent'
import VitrineSection from '@/components/VitrineSection.vue'

const { projects, settings } = useContent()
const activeTag = ref('')
const visibleProjects = computed(() => projects.value.filter((project) => project.showOnProjects !== false))
const tags = computed(() =>
  [...new Set(visibleProjects.value.flatMap((project) => project.tags ?? []))].sort((a, b) =>
    a.localeCompare(b),
  ),
)
const filteredProjects = computed(() =>
  activeTag.value
    ? visibleProjects.value.filter((project) => (project.tags ?? []).includes(activeTag.value))
    : visibleProjects.value,
)
</script>

<template>
  <section aria-labelledby="projects-heading">
    <header class="mb-12 border-b border-(--border) pb-8 md:mb-16">
      <p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Projets</p>
      <h1 id="projects-heading" class="max-w-4xl font-heading text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
        Projets personnels<br class="hidden sm:block"/>
        et travaux de formation.
      </h1>
      <p class="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Cette page présente les projets que j'ai réalisés seul ou pendant ma formation OpenClassrooms.
        Pour chacun, le contexte, la stack et les raisons du projet.
      </p>
    </header>

    <div v-if="tags.length" class="mb-8 flex flex-wrap items-center gap-2" aria-label="Filtrer les projets par tag">
      <button
        type="button"
        class="border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
        :class="activeTag === '' ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
        @click="activeTag = ''"
      >Tous</button>
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
        :class="activeTag === tag ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
        @click="activeTag = tag"
      >{{ tag }}</button>
    </div>

    <div v-if="settings.sections.projectsList" class="space-y-8 md:space-y-10">
      <article
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        class="neo-card p-6 md:p-10"
      >
        <img
          v-if="project.displayMode === 'detailed' && project.detailImage"
          :src="project.detailImage"
          :alt="`Aperçu de ${project.title}`"
          class="mb-8 max-h-96 w-full border border-(--border) object-cover"
          loading="lazy"
        >
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span class="text-muted">{{ project.context }}</span>
          <span>0{{ index + 1 }}</span>
        </div>

        <h2 class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{{ project.title }}</h2>
        <p class="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {{ project.displayMode === 'detailed' ? project.desc : project.shortDesc }}
        </p>

        <div v-if="project.displayMode === 'detailed'" class="mt-8 grid gap-8 border-t border-(--border) pt-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h3 class="mb-4 font-mono text-[10px] uppercase tracking-widest text-accent">Pourquoi ce projet</h3>
            <ul class="space-y-3">
              <li
                v-for="reason in project.reasons"
                :key="reason"
                class="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span class="mt-1 text-pink" aria-hidden="true">↳</span>
                <span>{{ reason }}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-4 font-mono text-[10px] uppercase tracking-widest text-accent">Stack</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.detailedStack"
                :key="tech"
                class="border border-(--border) px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted"
              >{{ tech }}</span>
            </div>

            <a
              v-if="project.link !== null"
              :href="project.link"
              class="mt-6 inline-flex border border-(--border) px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-accent hover:text-black"
            >{{ project.linkText }} ↗</a>
            <span
              v-else
              class="mt-6 inline-flex border border-(--border) px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted/60"
            >{{ project.linkText }}</span>
          </div>
        </div>

        <div v-else class="mt-8 border-t border-(--border) pt-8">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in project.stack"
              :key="tech"
              class="border border-(--border) px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted"
            >{{ tech }}</span>
          </div>
          <a
            v-if="project.link !== null"
            :href="project.link"
            class="mt-6 inline-flex border border-(--border) px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-accent hover:text-black"
          >{{ project.linkText }} ↗</a>
          <span
            v-else
            class="mt-6 inline-flex border border-(--border) px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted/60"
          >{{ project.linkText }}</span>
        </div>
      </article>
    </div>

    <VitrineSection v-if="settings.sections.projectsVitrines" location="projects" />
  </section>
</template>
