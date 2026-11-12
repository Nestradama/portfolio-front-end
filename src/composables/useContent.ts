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
const version = ref(0)
const loading = ref(false)
const error = ref('')
const source = ref<'api' | 'backup' | null>(null)

let loaded = false
let pending: Promise<void> | null = null

function apply(content: Content, origin: 'api' | 'backup'): void {
  projects.value = content.projects
  vitrines.value = content.vitrines
  settings.value = content.settings
  tags.value = content.tags
  version.value = content.version
  source.value = origin
  loaded = true
}

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
    .then((content) => apply(content, 'api'))
    .catch(async (failure: unknown) => {
      // The public pages must stay usable when the API is down. The static
      // snapshot is generated from the same content by the admin.
      try {
        const backup = await fetchBackup()
        apply(backup, 'backup')
        error.value = ''
        console.warn('[content] API unavailable, using the static backup.', failure)
      } catch (backupFailure: unknown) {
        error.value = failure instanceof Error ? failure.message : 'Content API unavailable'
        console.warn('[content] API and static backup unavailable.', failure, backupFailure)
      }
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
    source,
    load,
    refresh,
  }
}
