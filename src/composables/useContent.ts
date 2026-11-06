import { ref } from 'vue'
import { fetchContent } from '@/api/content'
import { projects as fallbackProjects, type Project } from '@/data/projects'
import { defaultSettings, type SiteSettings } from '@/data/settings'
import type { Tag } from '@/data/tags'
import { vitrines as fallbackVitrines, type Vitrine } from '@/data/vitrine'

const projects = ref<Project[]>(fallbackProjects)
const vitrines = ref<Vitrine[]>(fallbackVitrines)
const settings = ref<SiteSettings>(defaultSettings)
const tags = ref<Tag[]>([])
const version = ref(0)
const loading = ref(false)
const error = ref('')

let loaded = false
let pending: Promise<void> | null = null

async function load(): Promise<void> {
  if (loaded) {
    return
  }

  if (pending !== null) {
    return pending
  }

  loading.value = true
  error.value = ''

  pending = fetchContent()
    .then((content) => {
      projects.value = content.projects
      vitrines.value = content.vitrines
      settings.value = content.settings
      tags.value = content.tags
      version.value = content.version
      loaded = true
    })
    .catch((failure: unknown) => {
      error.value = failure instanceof Error ? failure.message : 'Content API unavailable'
      console.warn('[content] API unavailable, keeping local fallback.', failure)
    })
    .finally(() => {
      loading.value = false
      pending = null
    })

  return pending
}

async function refresh(): Promise<void> {
  // A refresh can be requested while the initial load is still running, for example
  // right after an admin save. Wait for it, then force a new request so the caller
  // never receives a response that started before the change.
  if (pending !== null) {
    await pending.catch(() => {})
  }

  loaded = false
  return load()
}

export function useContent() {
  return {
    projects,
    vitrines,
    settings,
    tags,
    version,
    loading,
    error,
    load,
    refresh,
  }
}
