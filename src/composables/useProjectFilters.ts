import { computed, ref, type Ref } from 'vue'
import type { Project } from '@/data/projects'
import type { Tag } from '@/data/tags'

/**
 * Shared project filtering for the home rail and the projects page.
 * `include` is the only page-specific rule (featured vs showOnProjects).
 */
export function useProjectFilters(
  projects: Ref<Project[]>,
  tagCatalog: Ref<Tag[]>,
  include: (project: Project) => boolean,
) {
  const activeTag = ref('')
  const baseProjects = computed(() => projects.value.filter(include))
  const hiddenTags = computed(
    () => new Set((tagCatalog.value ?? []).filter((tag) => tag.visible === false).map((tag) => tag.name)),
  )
  const tags = computed(() =>
    [...new Set(baseProjects.value.flatMap((project) => project.tags ?? []))]
      .filter((tag) => !hiddenTags.value.has(tag))
      .sort((a, b) => a.localeCompare(b)),
  )
  const filteredProjects = computed(() =>
    activeTag.value
      ? baseProjects.value.filter((project) => (project.tags ?? []).includes(activeTag.value))
      : baseProjects.value,
  )

  return { activeTag, tags, filteredProjects }
}
