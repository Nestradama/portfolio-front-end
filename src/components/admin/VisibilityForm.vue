<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SiteSettings } from '@/data/settings'
import { adminButton } from './adminStyles'

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

const labels: Array<[keyof typeof form, string, string]> = [
  ['homeHero', 'Accueil', 'Hero / présentation'],
  ['homeProjects', 'Accueil', 'Section projets'],
  ['homeVitrines', 'Accueil', 'Section réalisations'],
  ['homeFilters', 'Accueil', 'Filtres par tags'],
  ['aboutIntro', 'À propos', 'Introduction'],
  ['aboutStack', 'À propos', 'Stack'],
  ['aboutContact', 'À propos', 'Contact'],
  ['projectsList', 'Projets', 'Liste des projets'],
  ['projectsVitrines', 'Projets', 'Réalisations'],
  ['projectsFilters', 'Projets', 'Filtres par tags'],
]

function submit() {
  emit('save', { sections: { ...form } })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-3 md:grid-cols-2">
      <label
        v-for="[key, group, label] in labels"
        :key="key"
        class="flex items-center gap-3 border border-(--border) p-4 text-sm text-muted"
      >
        <input v-model="form[key]" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
        <span><span class="font-mono text-[10px] uppercase tracking-widest text-accent">{{ group }}</span><br>{{ label }}</span>
      </label>
    </div>

    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>

    <button type="submit" :class="adminButton" :disabled="busy">
      {{ busy ? 'Enregistrement…' : 'Enregistrer la visibilité' }}
    </button>
  </form>
</template>
