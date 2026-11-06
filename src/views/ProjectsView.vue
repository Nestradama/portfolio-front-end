<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContent } from '@/composables/useContent'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectActions from '@/components/ProjectActions.vue'
import ProjectDetailModal from '@/components/ProjectDetailModal.vue'
import ProjectLinkArrow from '@/components/ProjectLinkArrow.vue'
import TagFilters from '@/components/TagFilters.vue'
import VitrineSection from '@/components/VitrineSection.vue'
import type { Project } from '@/data/projects'

const { projects, settings, tags: tagCatalog } = useContent()
const activeTag = ref('')
const selectedProject = ref<Project | null>(null)
const visibleProjects = computed(() => projects.value.filter((project) => project.showOnProjects !== false))
const hiddenTags = computed(
  () => new Set((tagCatalog.value ?? []).filter((tag) => tag.visible === false).map((tag) => tag.name)),
)
const tags = computed(() =>
  [...new Set(visibleProjects.value.flatMap((project) => project.tags ?? []))]
    .filter((tag) => !hiddenTags.value.has(tag))
    .sort((a, b) => a.localeCompare(b)),
)
const filteredProjects = computed(() =>
  activeTag.value
    ? visibleProjects.value.filter((project) => (project.tags ?? []).includes(activeTag.value))
    : visibleProjects.value,
)

type DisplayMode = NonNullable<Project['displayMode']>
interface ProjectGroup {
  mode: DisplayMode
  projects: Project[]
  start: number
}

const groups = computed<ProjectGroup[]>(() => {
  // Consecutive card projects share one grid; detailed blocks stay full width.
  const result: ProjectGroup[] = []

  filteredProjects.value.forEach((project, index) => {
    const mode = project.displayMode ?? 'card'

    if (mode === 'card') {
      const previous = result.at(-1)
      if (previous?.mode === 'card') {
        previous.projects.push(project)
      } else {
        result.push({ mode, projects: [project], start: index })
      }
    } else {
      result.push({ mode, projects: [project], start: index })
    }
  })

  return result
})
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

    <TagFilters v-if="settings.sections.projectsFilters && tags.length" v-model="activeTag" :tag-names="tags" />

    <div v-if="settings.sections.projectsList" class="space-y-8 md:space-y-10">
      <template v-for="group in groups" :key="group.start">
        <div v-if="group.mode === 'card'" class="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            v-for="(project, index) in group.projects"
            :key="project.id"
            :project="project"
            :index="group.start + index"
            @open="selectedProject = $event"
          />
        </div>

        <template v-else>
          <template v-if="group.mode === 'detailed-preview'">
            <article
              v-for="(project, index) in group.projects"
              :key="project.id"
              class="neo-card p-5 md:p-7"
            >
              <div class="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
                <div class="min-w-0">
                  <div class="mb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
                    <span class="text-muted">{{ project.context }}</span>
                    <span>0{{ group.start + index + 1 }}</span>
                  </div>

                  <div class="flex flex-wrap items-center gap-3">
                    <h2 class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{{ project.title }}</h2>
                    <ProjectLinkArrow :project="project" />
                  </div>
                  <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{{ project.desc }}</p>

                  <div class="mt-5 border-t border-(--border) pt-4">
                    <h3 class="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">Pourquoi ce projet</h3>
                    <ul class="grid gap-x-6 gap-y-2 sm:grid-cols-2">
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
                    <div class="flex flex-wrap gap-1.5">
                      <span
                        v-for="tech in project.detailedStack"
                        :key="tech"
                        class="border border-(--border) px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
                      >{{ tech }}</span>
                    </div>
                  </div>

                  <ProjectActions :project="project" compact class="mt-auto" />
                </aside>
              </div>
            </article>
          </template>

          <article
            v-else
            v-for="(project, index) in group.projects"
            :key="project.id"
            class="neo-card p-6 md:p-10"
          >
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted">
              <span class="text-muted">{{ project.context }}</span>
              <span>0{{ group.start + index + 1 }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <h2 class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{{ project.title }}</h2>
              <ProjectLinkArrow :project="project" />
            </div>
            <p class="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{{ project.desc }}</p>

            <div class="mt-8 grid gap-8 border-t border-(--border) pt-8 md:grid-cols-[1.1fr_0.9fr]">
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

                <ProjectActions :project="project" class="mt-6" />
              </div>
            </div>
          </article>
        </template>
      </template>
    </div>

    <div v-if="settings.sections.projectsVitrines" class="mt-16 border-t border-(--border) pt-12 md:mt-24 md:pt-16">
      <VitrineSection location="projects" />
    </div>

    <ProjectDetailModal :project="selectedProject" @close="selectedProject = null" />
  </section>
</template>
