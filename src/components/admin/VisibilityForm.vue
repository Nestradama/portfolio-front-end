<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SiteSettings } from '@/data/settings'
import { adminButton } from './adminStyles'

type SectionKey = keyof SiteSettings['sections']

const props = defineProps<{
  settings: SiteSettings
  busy: boolean
  error: string
}>()

const emit = defineEmits<{ save: [payload: Partial<SiteSettings>] }>()

const form = reactive({ ...props.settings.sections })

watch(
  () => props.settings.sections,
  (sections) => Object.assign(form, sections),
  { deep: true },
)

const groups: Array<{
  title: string
  description: string
  items: Array<{ key: SectionKey; label: string }>
}> = [
  {
    title: 'Accueil',
    description: 'Page d’accueil',
    items: [
      { key: 'homeHero', label: 'Hero / présentation' },
      { key: 'homeProjects', label: 'Section projets' },
      { key: 'homeVitrines', label: 'Section réalisations' },
      { key: 'homeFilters', label: 'Filtres par tags' },
    ],
  },
  {
    title: 'Projets',
    description: 'Page Projets',
    items: [
      { key: 'projectsList', label: 'Liste des projets' },
      { key: 'projectsVitrines', label: 'Réalisations' },
      { key: 'projectsFilters', label: 'Filtres par tags' },
    ],
  },
  {
    title: 'À propos',
    description: 'Page À propos',
    items: [
      { key: 'aboutIntro', label: 'Introduction' },
      { key: 'aboutStack', label: 'Stack' },
      { key: 'aboutContact', label: 'Contact' },
    ],
  },
]

function submit() {
  emit('save', { sections: { ...form } })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <section v-for="group in groups" :key="group.title" class="border border-(--border) p-6">
      <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-(--border) pb-3">
        <h2 class="font-heading text-xl font-bold">{{ group.title }}</h2>
        <span class="font-mono text-[10px] uppercase tracking-widest text-muted">{{ group.description }}</span>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <label
          v-for="item in group.items"
          :key="item.key"
          class="flex items-center gap-3 border border-(--border) p-4 text-sm text-muted"
        >
          <input v-model="form[item.key]" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
          <span>{{ item.label }}</span>
        </label>
      </div>
    </section>

    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>

    <button type="submit" :class="adminButton" :disabled="busy">
      {{ busy ? 'Enregistrement…' : 'Enregistrer la visibilité' }}
    </button>
  </form>
</template>
