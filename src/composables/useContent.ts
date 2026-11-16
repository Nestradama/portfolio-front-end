import { ref } from 'vue'
import { fetchBackup, fetchContent, type Content } from '@/api/content'
import type { Project } from '@/data/projects'
import { defaultSettings, type SiteSettings } from '@/data/settings'
import type { Tag } from '@/data/tags'
import type { Vitrine } from '@/data/vitrine'

const projects = ref<Project[]>([])
const vitrines = ref<Vitrine[]>([])
const settings = ref<SiteSettings>(defaultSettings)
const tags = ref<Tag[]>([])
const error = ref('')

let loaded = false
let pending: Promise<void> | null = null

function apply(content: Content): void {
  projects.value = content.projects
  vitrines.value = content.vitrines
  settings.value = content.settings
  tags.value = content.tags
  loaded = true
}

async function load(): Promise<void> {
  if (loaded) {
    return
  }

  if (pending !== null) {
    return pending
  }

  error.value = ''

  pending = fetchContent()
    .then((content) => apply(content))
    .catch(async (failure: unknown) => {
      // The public pages must stay usable when the API is down. The static
      // snapshot is generated from the same content by the admin.
      try {
        const backup = await fetchBackup()
        apply(backup)
        error.value = ''
        console.warn('[content] API unavailable, using the static backup.', failure)
      } catch (backupFailure: unknown) {
        error.value = failure instanceof Error ? failure.message : 'Content API unavailable'
        console.warn('[content] API and static backup unavailable.', failure, backupFailure)
      }
    })
    .finally(() => {
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
    error,
    load,
    refresh,
  }
}
