<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { ApiProject } from '@/api/content'
import type { ProjectPayload } from './types'
import { adminButton, adminGhostButton, adminInput, adminLabel } from './adminStyles'

const props = defineProps<{
  project: ApiProject | null
  busy: boolean
  error: string
}>()

const emit = defineEmits<{
  save: [payload: ProjectPayload]
  cancel: []
}>()

const form = reactive({
  title: '',
  context: '',
  shortDescription: '',
  description: '',
  stack: '',
  detailedStack: '',
  reasons: '',
  link: '',
  linkText: '',
  image: '',
  sortOrder: 0,
  published: true,
})

function fill(project: ApiProject | null) {
  form.title = project?.title ?? ''
  form.context = project?.context ?? ''
  form.shortDescription = project?.shortDescription ?? ''
  form.description = project?.description ?? ''
  form.stack = project?.stack.join(', ') ?? ''
  form.detailedStack = project?.detailedStack.join(', ') ?? ''
  form.reasons = project?.reasons.join('\n') ?? ''
  form.link = project?.link ?? ''
  form.linkText = project?.linkText ?? ''
  form.image = project?.image ?? ''
  form.sortOrder = project?.sortOrder ?? 0
  form.published = project?.published ?? true
}

watch(() => props.project, fill, { immediate: true })

function splitComma(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function submit() {
  emit('save', {
    title: form.title.trim(),
    context: form.context.trim(),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    stack: splitComma(form.stack),
    detailedStack: splitComma(form.detailedStack),
    reasons: splitLines(form.reasons),
    link: form.link.trim() || null,
    linkText: form.linkText.trim(),
    image: form.image.trim() || null,
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
  })
}
</script>

<template>
  <form class="space-y-5 border border-(--border) p-6" @submit.prevent="submit">
    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label for="project-title" :class="adminLabel">Titre</label>
        <input id="project-title" v-model="form.title" :class="adminInput" required>
      </div>
      <div>
        <label for="project-context" :class="adminLabel">Contexte</label>
        <input id="project-context" v-model="form.context" :class="adminInput">
      </div>
    </div>

    <div>
      <label for="project-short" :class="adminLabel">Description courte</label>
      <textarea id="project-short" v-model="form.shortDescription" rows="2" :class="adminInput"></textarea>
    </div>

    <div>
      <label for="project-description" :class="adminLabel">Description complète</label>
      <textarea id="project-description" v-model="form.description" rows="5" :class="adminInput"></textarea>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label for="project-stack" :class="adminLabel">Stack (séparée par des virgules)</label>
        <input id="project-stack" v-model="form.stack" :class="adminInput">
      </div>
      <div>
        <label for="project-detail-stack" :class="adminLabel">Stack détaillée (virgules)</label>
        <input id="project-detail-stack" v-model="form.detailedStack" :class="adminInput">
      </div>
    </div>

    <div>
      <label for="project-reasons" :class="adminLabel">Raisons (une par ligne)</label>
      <textarea id="project-reasons" v-model="form.reasons" rows="4" :class="adminInput"></textarea>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label for="project-link" :class="adminLabel">Lien</label>
        <input id="project-link" v-model="form.link" placeholder="/ou-https" :class="adminInput">
      </div>
      <div>
        <label for="project-link-text" :class="adminLabel">Texte du lien</label>
        <input id="project-link-text" v-model="form.linkText" :class="adminInput">
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label for="project-image" :class="adminLabel">Image</label>
        <input id="project-image" v-model="form.image" placeholder="/assets/..." :class="adminInput">
      </div>
      <div>
        <label for="project-order" :class="adminLabel">Ordre</label>
        <input id="project-order" v-model.number="form.sortOrder" type="number" min="0" :class="adminInput">
      </div>
    </div>

    <label class="flex items-center gap-3 text-sm text-muted">
      <input v-model="form.published" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
      Visible sur le site public
    </label>

    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>

    <div class="flex flex-wrap gap-3">
      <button type="submit" :class="adminButton" :disabled="busy">
        {{ busy ? 'Enregistrement…' : (project ? 'Enregistrer' : 'Créer') }}
      </button>
      <button type="button" :class="adminGhostButton" @click="emit('cancel')">Annuler</button>
    </div>
  </form>
</template>
