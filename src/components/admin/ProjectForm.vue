<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { ApiProject } from '@/api/content'
import type { ProjectPayload } from './types'
import ImageField from './ImageField.vue'
import TagSelector from './TagSelector.vue'
import ListInput from './ListInput.vue'
import type { Tag } from '@/data/tags'
import { adminButton, adminGhostButton, adminInput, adminLabel } from './adminStyles'

const props = defineProps<{
  project: ApiProject | null
  busy: boolean
  error: string
  csrf: string
  availableTags: Tag[]
}>()

const emit = defineEmits<{
  save: [payload: ProjectPayload]
  cancel: []
}>()

type Tab = 'content' | 'stack' | 'media' | 'publication'

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'content', label: 'Contenu' },
  { id: 'stack', label: 'Stack & raisons' },
  { id: 'media', label: 'Médias' },
  { id: 'publication', label: 'Publication' },
]

const activeTab = ref<Tab>('content')

// The form uses v-show rather than v-if so every field remains mounted/submittable.
const form = reactive({
  title: '',
  context: '',
  shortDescription: '',
  description: '',
  tags: [] as string[],
  displayMode: 'card' as 'card' | 'detailed' | 'detailed-preview',
  detailImage: '',
  stack: [] as string[],
  detailedStack: [] as string[],
  reasons: [] as string[],
  link: '',
  linkText: '',
  image: '',
  sortOrder: 0,
  published: true,
  featured: true,
  showOnProjects: true,
  showDetail: true,
})

function fill(project: ApiProject | null) {
  form.title = project?.title ?? ''
  form.context = project?.context ?? ''
  form.shortDescription = project?.shortDescription ?? ''
  form.description = project?.description ?? ''
  form.tags = [...(project?.tags ?? [])]
  form.displayMode = project?.displayMode ?? 'card'
  form.detailImage = project?.detailImage ?? ''
  form.stack = [...(project?.stack ?? [])]
  form.detailedStack = [...(project?.detailedStack ?? [])]
  form.reasons = [...(project?.reasons ?? [])]
  form.link = project?.link ?? ''
  form.linkText = project?.linkText ?? ''
  form.image = project?.image ?? ''
  form.sortOrder = project?.sortOrder ?? 0
  form.published = project?.published ?? true
  form.featured = project?.featured ?? true
  form.showOnProjects = project?.showOnProjects ?? true
  form.showDetail = project?.showDetail ?? true
}

watch(() => props.project, fill, { immediate: true })

function submit() {
  emit('save', {
    title: form.title.trim(),
    context: form.context.trim(),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    tags: [...form.tags],
    displayMode: form.displayMode,
    detailImage: form.detailImage.trim() || null,
    stack: [...form.stack],
    detailedStack: [...form.detailedStack],
    reasons: [...form.reasons],
    link: form.link.trim() || null,
    linkText: form.linkText.trim(),
    image: form.image.trim() || null,
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
    featured: form.featured,
    showOnProjects: form.showOnProjects,
    showDetail: form.showDetail,
  })
}
</script>

<template>
  <form class="border border-(--border)" @submit.prevent="submit">
    <header class="border-b border-(--border) p-5 md:p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="font-heading text-xl font-bold">{{ project ? 'Modifier le projet' : 'Nouveau projet' }}</h2>
          <p class="mt-1 text-sm text-muted">Organise le contenu par onglet, puis déplie seulement les blocs utiles.</p>
        </div>
        <div class="flex gap-2">
          <button type="button" :class="adminGhostButton" @click="emit('cancel')">Annuler</button>
          <button type="submit" :class="adminButton" :disabled="busy">
            {{ busy ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </div>
      </div>

      <nav class="mt-5 flex flex-wrap gap-2 border-t border-(--border) pt-3" role="tablist" aria-label="Sections du projet">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="border-b-2 px-3 py-2 text-sm font-medium transition-colors"
          :class="activeTab === tab.id ? 'border-accent bg-(--card) text-accent' : 'border-transparent text-muted hover:text-ink'"
          @click="activeTab = tab.id"
        >{{ tab.label }}</button>
      </nav>
    </header>

    <div class="space-y-4 p-5 md:p-6">
      <div v-show="activeTab === 'content'" role="tabpanel" class="space-y-4">
        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Identité</summary>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label for="project-title" :class="adminLabel">Titre</label>
              <input id="project-title" v-model="form.title" :class="adminInput" required>
            </div>
            <div>
              <label for="project-context" :class="adminLabel">Contexte</label>
              <input id="project-context" v-model="form.context" :class="adminInput">
            </div>
          </div>
        </details>

        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Descriptions</summary>
          <div class="mt-4 space-y-4">
            <div>
              <label for="project-short" :class="adminLabel">Description courte</label>
              <textarea id="project-short" v-model="form.shortDescription" rows="2" :class="adminInput"></textarea>
            </div>
            <div>
              <label for="project-description" :class="adminLabel">Description complète</label>
              <textarea id="project-description" v-model="form.description" rows="5" :class="adminInput"></textarea>
            </div>
          </div>
        </details>

        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Tags et affichage</summary>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <TagSelector v-model="form.tags" :tags="availableTags" label="Tags" />
            <div>
              <label for="project-display-mode" :class="adminLabel">Affichage sur la page Projets</label>
              <select id="project-display-mode" v-model="form.displayMode" :class="adminInput">
                <option value="card">Carte</option>
                <option value="detailed">Détaillé</option>
                <option value="detailed-preview">Détaillé avec preview</option>
              </select>
              <p class="mt-1 text-xs text-muted">Carte reprend le format de l’accueil ; les modes détaillés prennent toute la largeur.</p>
            </div>
          </div>
        </details>
      </div>

      <div v-show="activeTab === 'stack'" role="tabpanel" class="space-y-4">
        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Stack courte</summary>
          <div class="mt-4">
            <ListInput v-model="form.stack" placeholder="Ajouter une technologie…" />
          </div>
        </details>

        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Stack détaillée</summary>
          <div class="mt-4">
            <ListInput v-model="form.detailedStack" placeholder="Ajouter une technologie…" />
          </div>
        </details>

        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Raisons</summary>
          <div class="mt-4">
            <ListInput v-model="form.reasons" placeholder="Ajouter une raison…" variant="rows" />
          </div>
        </details>
      </div>

      <div v-show="activeTab === 'media'" role="tabpanel" class="space-y-4">
        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Images</summary>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <ImageField v-model="form.image" :csrf="csrf" label="Image" />
            <ImageField v-model="form.detailImage" :csrf="csrf" label="Image détaillée" />
          </div>
        </details>

        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Liens</summary>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label for="project-link" :class="adminLabel">Lien</label>
              <input id="project-link" v-model="form.link" placeholder="/ou-https" :class="adminInput">
            </div>
            <div>
              <label for="project-link-text" :class="adminLabel">Texte du lien</label>
              <input id="project-link-text" v-model="form.linkText" :class="adminInput">
            </div>
          </div>
        </details>
      </div>

      <div v-show="activeTab === 'publication'" role="tabpanel" class="space-y-4">
        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Ordre</summary>
          <div class="mt-4 max-w-xs">
            <label for="project-order" :class="adminLabel">Position</label>
            <input id="project-order" v-model.number="form.sortOrder" type="number" min="0" :class="adminInput">
          </div>
        </details>

        <details open class="border border-(--border) p-4">
          <summary class="cursor-pointer font-heading text-lg font-bold">Visibilité</summary>
          <div class="mt-4 flex flex-col gap-3 text-sm text-muted">
            <label class="flex items-center gap-3">
              <input v-model="form.published" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
              Visible sur le site public
            </label>
            <label class="flex items-center gap-3">
              <input v-model="form.featured" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
              Afficher sur l’accueil
            </label>
            <label class="flex items-center gap-3">
              <input v-model="form.showOnProjects" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
              Afficher sur la page Projets
            </label>
            <label class="flex items-center gap-3">
              <input v-model="form.showDetail" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
              Afficher le bouton « + » (détail du projet)
            </label>
          </div>
        </details>
      </div>

      <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>
    </div>

    <footer class="flex flex-wrap justify-end gap-3 border-t border-(--border) p-5 md:p-6">
      <button type="button" :class="adminGhostButton" @click="emit('cancel')">Annuler</button>
      <button type="submit" :class="adminButton" :disabled="busy">
        {{ busy ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </footer>
  </form>
</template>
