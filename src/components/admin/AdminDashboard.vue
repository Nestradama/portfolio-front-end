<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { AdminContent } from '@/api/admin'
import { adminApi, ApiError } from '@/api/admin'
import type { ApiProject, ApiVitrine } from '@/api/content'
import ProjectForm from './ProjectForm.vue'
import VitrineForm from './VitrineForm.vue'
import ContentSettingsForm from './ContentSettingsForm.vue'
import SeoForm from './SeoForm.vue'
import VisibilityForm from './VisibilityForm.vue'
import { adminButton, adminGhostButton } from './adminStyles'
import type { ProjectPayload, VitrinePayload } from './types'
import type { SiteSettings } from '@/data/settings'

const { csrf, username } = defineProps<{
  csrf: string
  username: string
}>()

const emit = defineEmits<{ logout: [] }>()

type Tab = 'projects' | 'vitrines' | 'content' | 'seo' | 'sections'

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'projects', label: 'Projets' },
  { id: 'vitrines', label: 'Vitrines' },
  { id: 'content', label: 'Contenu' },
  { id: 'seo', label: 'SEO' },
  { id: 'sections', label: 'Sections' },
]

const content = ref<AdminContent | null>(null)
const tab = ref<Tab>('projects')
const tagSuggestions = computed(() =>
  [...new Set((content.value?.projects ?? []).flatMap((project) => project.tags ?? []))].sort((a, b) =>
    a.localeCompare(b),
  ),
)
const mode = ref<'project' | 'vitrine' | null>(null)
const editingProject = ref<ApiProject | null>(null)
const editingVitrine = ref<ApiVitrine | null>(null)
const loading = ref(true)
const busy = ref(false)
const error = ref('')

onMounted(load)

async function load() {
  loading.value = true
  error.value = ''

  try {
    content.value = await adminApi.content()
  } catch (failure) {
    if (failure instanceof ApiError && failure.status === 401) {
      emit('logout')
      return
    }
    error.value = messageOf(failure)
  } finally {
    loading.value = false
  }
}

function newProject() {
  editingProject.value = null
  editingVitrine.value = null
  error.value = ''
  mode.value = 'project'
}

function editProject(project: ApiProject) {
  editingProject.value = project
  editingVitrine.value = null
  error.value = ''
  mode.value = 'project'
}

function newVitrine() {
  editingProject.value = null
  editingVitrine.value = null
  error.value = ''
  mode.value = 'vitrine'
}

function editVitrine(vitrine: ApiVitrine) {
  editingProject.value = null
  editingVitrine.value = vitrine
  error.value = ''
  mode.value = 'vitrine'
}

function cancelForm() {
  mode.value = null
  error.value = ''
}

async function saveProject(payload: ProjectPayload) {
  busy.value = true
  error.value = ''

  try {
    if (editingProject.value) {
      await adminApi.updateProject(editingProject.value.id, payload, csrf)
    } else {
      await adminApi.createProject(payload, csrf)
    }
    mode.value = null
    await load()
  } catch (failure) {
    error.value = messageOf(failure)
  } finally {
    busy.value = false
  }
}

async function saveVitrine(payload: VitrinePayload) {
  busy.value = true
  error.value = ''

  try {
    if (editingVitrine.value) {
      await adminApi.updateVitrine(editingVitrine.value.id, payload, csrf)
    } else {
      await adminApi.createVitrine(payload, csrf)
    }
    mode.value = null
    await load()
  } catch (failure) {
    error.value = messageOf(failure)
  } finally {
    busy.value = false
  }
}

async function saveSettings(payload: Partial<SiteSettings>) {
  busy.value = true
  error.value = ''

  try {
    await adminApi.updateSettings(payload, csrf)
    await load()
  } catch (failure) {
    error.value = messageOf(failure)
  } finally {
    busy.value = false
  }
}

async function removeProject(project: ApiProject) {
  if (!window.confirm(`Supprimer « ${project.title} » ?`)) {
    return
  }

  error.value = ''
  try {
    await adminApi.deleteProject(project.id, csrf)
    await load()
  } catch (failure) {
    error.value = messageOf(failure)
  }
}

async function removeVitrine(vitrine: ApiVitrine) {
  if (!window.confirm(`Supprimer « ${vitrine.title} » ?`)) {
    return
  }

  error.value = ''
  try {
    await adminApi.deleteVitrine(vitrine.id, csrf)
    await load()
  } catch (failure) {
    error.value = messageOf(failure)
  }
}

function messageOf(failure: unknown): string {
  return failure instanceof ApiError ? failure.message : 'Une erreur est survenue.'
}
</script>

<template>
  <section class="max-w-6xl mx-auto">
    <header class="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-(--border) pb-5">
      <div>
        <p class="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">Administration</p>
        <h1 class="font-heading text-2xl font-bold">Contenu du portfolio</h1>
        <p class="mt-1 text-sm text-muted">Connecté en tant que {{ username }} · version {{ content?.version ?? '—' }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" :class="adminGhostButton" @click="load">Rafraîchir</button>
        <button type="button" :class="adminGhostButton" @click="emit('logout')">Déconnexion</button>
      </div>
    </header>

    <p v-if="error" class="mb-4 text-sm text-red-400" role="alert">{{ error }}</p>
    <p v-if="loading" class="text-muted font-mono text-sm" role="status">Chargement…</p>

    <template v-if="!loading && content">
      <nav class="mb-6 flex flex-wrap gap-2 border-b border-(--border)" aria-label="Sections admin">
        <button
          v-for="item in tabs"
          :key="item.id"
          type="button"
          class="px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
          :class="tab === item.id ? 'border-b-2 border-accent text-accent' : 'text-muted'"
          @click="tab = item.id; mode = null"
        >
          {{ item.label }}<span v-if="item.id === 'projects'"> ({{ content.projects.length }})</span><span v-if="item.id === 'vitrines'"> ({{ content.vitrines.length }})</span>
        </button>
      </nav>

      <ProjectForm
        v-if="mode === 'project'"
        :project="editingProject"
        :busy="busy"
        :error="error"
        :tag-suggestions="tagSuggestions"
        @save="saveProject"
        @cancel="cancelForm"
      />

      <VitrineForm
        v-if="mode === 'vitrine'"
        :vitrine="editingVitrine"
        :busy="busy"
        :error="error"
        @save="saveVitrine"
        @cancel="cancelForm"
      />

      <ContentSettingsForm
        v-if="tab === 'content'"
        :settings="content.settings"
        :busy="busy"
        :error="error"
        @save="saveSettings"
      />

      <SeoForm
        v-if="tab === 'seo'"
        :settings="content.settings"
        :busy="busy"
        :error="error"
        @save="saveSettings"
      />

      <VisibilityForm
        v-if="tab === 'sections'"
        :settings="content.settings"
        :busy="busy"
        :error="error"
        @save="saveSettings"
      />

      <template v-if="tab === 'projects'">
        <div class="mb-4 flex justify-end">
          <button type="button" :class="adminButton" @click="newProject">Nouveau projet</button>
        </div>
        <div class="overflow-x-auto border border-(--border)">
          <table class="w-full text-left text-sm">
            <thead class="bg-(--card) font-mono text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th class="p-3">Titre</th>
                <th class="p-3">Contexte</th>
                <th class="p-3">État</th>
                <th class="p-3">Ordre</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in content.projects" :key="project.id" class="border-t border-(--border)">
                <td class="p-3 font-medium">{{ project.title }}</td>
                <td class="p-3 text-muted">{{ project.context }}</td>
                <td class="p-3">
                  <span :class="project.published ? 'text-green-400' : 'text-muted'">
                    {{ project.published ? 'Publié' : 'Masqué' }}
                  </span>
                </td>
                <td class="p-3 font-mono text-xs text-muted">{{ project.sortOrder }}</td>
                <td class="p-3">
                  <div class="flex gap-3">
                    <button type="button" class="text-accent hover:underline" @click="editProject(project)">Modifier</button>
                    <button type="button" class="text-red-400 hover:underline" @click="removeProject(project)">Supprimer</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-if="tab === 'vitrines'">
        <div class="mb-4 flex justify-end">
          <button type="button" :class="adminButton" @click="newVitrine">Nouvelle vitrine</button>
        </div>
        <div class="overflow-x-auto border border-(--border)">
          <table class="w-full text-left text-sm">
            <thead class="bg-(--card) font-mono text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th class="p-3">Titre</th>
                <th class="p-3">Lien</th>
                <th class="p-3">État</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vitrine in content.vitrines" :key="vitrine.id" class="border-t border-(--border)">
                <td class="p-3 font-medium">{{ vitrine.title }}</td>
                <td class="p-3 font-mono text-xs text-muted">{{ vitrine.link ?? '—' }}</td>
                <td class="p-3">
                  <span :class="vitrine.published ? 'text-green-400' : 'text-muted'">
                    {{ vitrine.published ? 'Publié' : 'Masqué' }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex gap-3">
                    <button type="button" class="text-accent hover:underline" @click="editVitrine(vitrine)">Modifier</button>
                    <button type="button" class="text-red-400 hover:underline" @click="removeVitrine(vitrine)">Supprimer</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
  </section>
</template>
