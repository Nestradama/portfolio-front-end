<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { ApiVitrine } from '@/api/content'
import type { VitrinePayload } from './types'
import { adminButton, adminGhostButton, adminInput, adminLabel } from './adminStyles'

const props = defineProps<{
  vitrine: ApiVitrine | null
  busy: boolean
  error: string
}>()

const emit = defineEmits<{
  save: [payload: VitrinePayload]
  cancel: []
}>()

const form = reactive({
  title: '',
  description: '',
  image: '',
  link: '',
  linkText: '',
  sortOrder: 0,
  published: true,
})

function fill(vitrine: ApiVitrine | null) {
  form.title = vitrine?.title ?? ''
  form.description = vitrine?.description ?? ''
  form.image = vitrine?.image ?? ''
  form.link = vitrine?.link ?? ''
  form.linkText = vitrine?.linkText ?? ''
  form.sortOrder = vitrine?.sortOrder ?? 0
  form.published = vitrine?.published ?? true
}

watch(() => props.vitrine, fill, { immediate: true })

function submit() {
  emit('save', {
    title: form.title.trim(),
    description: form.description.trim(),
    image: form.image.trim() || null,
    link: form.link.trim() || null,
    linkText: form.linkText.trim(),
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
  })
}
</script>

<template>
  <form class="space-y-5 border border-(--border) p-6" @submit.prevent="submit">
    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label for="vitrine-title" :class="adminLabel">Titre</label>
        <input id="vitrine-title" v-model="form.title" :class="adminInput" required>
      </div>
      <div>
        <label for="vitrine-order" :class="adminLabel">Ordre</label>
        <input id="vitrine-order" v-model.number="form.sortOrder" type="number" min="0" :class="adminInput">
      </div>
    </div>

    <div>
      <label for="vitrine-description" :class="adminLabel">Description</label>
      <textarea id="vitrine-description" v-model="form.description" rows="4" :class="adminInput"></textarea>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label for="vitrine-image" :class="adminLabel">Image</label>
        <input id="vitrine-image" v-model="form.image" placeholder="/assets/..." :class="adminInput">
      </div>
      <div>
        <label for="vitrine-link" :class="adminLabel">Lien</label>
        <input id="vitrine-link" v-model="form.link" placeholder="/ou-https" :class="adminInput">
      </div>
    </div>

    <div>
      <label for="vitrine-link-text" :class="adminLabel">Texte du lien</label>
      <input id="vitrine-link-text" v-model="form.linkText" :class="adminInput">
    </div>

    <label class="flex items-center gap-3 text-sm text-muted">
      <input v-model="form.published" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
      Visible sur le site public
    </label>

    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>

    <div class="flex flex-wrap gap-3">
      <button type="submit" :class="adminButton" :disabled="busy">
        {{ busy ? 'Enregistrement…' : (vitrine ? 'Enregistrer' : 'Créer') }}
      </button>
      <button type="button" :class="adminGhostButton" @click="emit('cancel')">Annuler</button>
    </div>
  </form>
</template>
