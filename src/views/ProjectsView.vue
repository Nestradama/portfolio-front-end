<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContent } from '@/composables/useContent'
import { useProjectFilters } from '@/composables/useProjectFilters'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectDetailBlock from '@/components/ProjectDetailBlock.vue'
import ProjectDetailModal from '@/components/ProjectDetailModal.vue'
import TagFilters from '@/components/TagFilters.vue'
import VitrineSection from '@/components/VitrineSection.vue'
import type { Project } from '@/data/projects'

const { projects, settings, tags: tagCatalog } = useContent()
const selectedProject = ref<Project | null>(null)
const { activeTag, tags, filteredProjects } = useProjectFilters(
  projects,
  tagCatalog,
  (project) => project.showOnProjects !== false,
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
          <ProjectDetailBlock
            v-for="(project, index) in group.projects"
            :key="project.id"
            :project="project"
            :index="group.start + index"
            :preview="group.mode === 'detailed-preview'"
          />
        </template>
      </template>
    </div>

    <div v-if="settings.sections.projectsVitrines" class="mt-16 border-t border-(--border) pt-12 md:mt-24 md:pt-16">
      <VitrineSection location="projects" />
    </div>

    <ProjectDetailModal :project="selectedProject" @close="selectedProject = null" />
  </section>
</template>
