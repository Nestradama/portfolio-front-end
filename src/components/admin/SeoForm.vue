<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SiteSettings } from '@/data/settings'
import ImageField from './ImageField.vue'
import { adminButton, adminInput, adminLabel } from './adminStyles'

const props = defineProps<{
  settings: SiteSettings
  busy: boolean
  error: string
  csrf: string
}>()

const emit = defineEmits<{ save: [payload: Partial<SiteSettings>] }>()

const form = reactive({
  siteName: '',
  defaultImage: '',
  homeTitle: '',
  homeDescription: '',
  aboutTitle: '',
  aboutDescription: '',
  projectsTitle: '',
  projectsDescription: '',
})

function fill(settings: SiteSettings) {
  form.siteName = settings.seo.siteName
  form.defaultImage = settings.seo.defaultImage
  form.homeTitle = settings.seo.pages.home.title
  form.homeDescription = settings.seo.pages.home.description
  form.aboutTitle = settings.seo.pages.about.title
  form.aboutDescription = settings.seo.pages.about.description
  form.projectsTitle = settings.seo.pages.projects.title
  form.projectsDescription = settings.seo.pages.projects.description
}

watch(() => props.settings, fill, { immediate: true, deep: true })

function submit() {
  emit('save', {
    seo: {
      siteName: form.siteName.trim(),
      defaultImage: form.defaultImage.trim(),
      pages: {
        home: { title: form.homeTitle.trim(), description: form.homeDescription.trim() },
        about: { title: form.aboutTitle.trim(), description: form.aboutDescription.trim() },
        projects: {
          title: form.projectsTitle.trim(),
          description: form.projectsDescription.trim(),
        },
      },
    },
  })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-4 md:grid-cols-2">
      <div>
        <label for="seo-site-name" :class="adminLabel">Nom du site</label>
        <input id="seo-site-name" v-model="form.siteName" :class="adminInput">
      </div>
    </div>

    <div class="mt-4">
      <ImageField v-model="form.defaultImage" :csrf="csrf" label="Image OG par défaut" />
    </div>

    <section v-for="page in [
      { key: 'home', label: 'Accueil', title: 'homeTitle', description: 'homeDescription' },
      { key: 'about', label: 'À propos', title: 'aboutTitle', description: 'aboutDescription' },
      { key: 'projects', label: 'Projets', title: 'projectsTitle', description: 'projectsDescription' },
    ]" :key="page.key" class="border border-(--border) p-6">
      <h2 class="font-heading text-xl font-bold">{{ page.label }}</h2>
      <div class="mt-4">
        <label :for="`seo-${page.key}-title`" :class="adminLabel">Titre</label>
        <input :id="`seo-${page.key}-title`" v-model="form[page.title as keyof typeof form]" :class="adminInput">
      </div>
      <div class="mt-4">
        <label :for="`seo-${page.key}-description`" :class="adminLabel">Description</label>
        <textarea :id="`seo-${page.key}-description`" v-model="form[page.description as keyof typeof form]" rows="3" :class="adminInput"></textarea>
      </div>
    </section>

    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>

    <button type="submit" :class="adminButton" :disabled="busy">
      {{ busy ? 'Enregistrement…' : 'Enregistrer le SEO' }}
    </button>
  </form>
</template>
