<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SiteSettings, StackGroup } from '@/data/settings'
import { adminButton, adminInput, adminLabel } from './adminStyles'

const props = defineProps<{
  settings: SiteSettings
  busy: boolean
  error: string
}>()

const emit = defineEmits<{ save: [payload: Partial<SiteSettings>] }>()

const form = reactive({
  homeHeading: '',
  homeName: '',
  homeParagraphs: '',
  homePhoto: '',
  aboutHeading: '',
  aboutParagraphs: '',
  aboutPhoto: '',
  stackText: '',
  contactEmail: '',
  contactGithub: '',
  contactLinkedin: '',
})

function fill(settings: SiteSettings) {
  form.homeHeading = settings.home.heading
  form.homeName = settings.home.name
  form.homeParagraphs = settings.home.paragraphs.join('\n\n')
  form.homePhoto = settings.home.photo
  form.aboutHeading = settings.about.heading
  form.aboutParagraphs = settings.about.paragraphs.join('\n\n')
  form.aboutPhoto = settings.about.photo
  form.stackText = settings.stack.groups
    .map((group) => `${group.title}: ${group.items.join(', ')}`)
    .join('\n')
  form.contactEmail = settings.contact.email
  form.contactGithub = settings.contact.github
  form.contactLinkedin = settings.contact.linkedin
}

watch(() => props.settings, fill, { immediate: true, deep: true })

function paragraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function stackGroups(value: string): StackGroup[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(':')
      const title = separator >= 0 ? line.slice(0, separator).trim() : line.trim()
      const items = separator >= 0 ? line.slice(separator + 1) : ''

      return {
        title,
        items: items
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }
    })
    .filter((group) => group.title !== '')
}

function submit() {
  emit('save', {
    home: {
      heading: form.homeHeading.trim(),
      name: form.homeName.trim(),
      paragraphs: paragraphs(form.homeParagraphs),
      photo: form.homePhoto.trim(),
    },
    about: {
      heading: form.aboutHeading.trim(),
      paragraphs: paragraphs(form.aboutParagraphs),
      photo: form.aboutPhoto.trim(),
    },
    stack: { groups: stackGroups(form.stackText) },
    contact: {
      email: form.contactEmail.trim(),
      github: form.contactGithub.trim(),
      linkedin: form.contactLinkedin.trim(),
    },
  })
}
</script>

<template>
  <form class="space-y-8" @submit.prevent="submit">
    <section class="border border-(--border) p-6">
      <h2 class="font-heading text-xl font-bold">Accueil</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label for="home-heading" :class="adminLabel">Titre</label>
          <input id="home-heading" v-model="form.homeHeading" :class="adminInput">
        </div>
        <div>
          <label for="home-name" :class="adminLabel">Nom</label>
          <input id="home-name" v-model="form.homeName" :class="adminInput">
        </div>
      </div>
      <div class="mt-4">
        <label for="home-paragraphs" :class="adminLabel">Paragraphes (une ligne vide entre chaque)</label>
        <textarea id="home-paragraphs" v-model="form.homeParagraphs" rows="5" :class="adminInput"></textarea>
      </div>
      <div class="mt-4">
        <label for="home-photo" :class="adminLabel">Photo</label>
        <input id="home-photo" v-model="form.homePhoto" :class="adminInput">
      </div>
    </section>

    <section class="border border-(--border) p-6">
      <h2 class="font-heading text-xl font-bold">À propos</h2>
      <div class="mt-4">
        <label for="about-heading" :class="adminLabel">Titre</label>
        <input id="about-heading" v-model="form.aboutHeading" :class="adminInput">
      </div>
      <div class="mt-4">
        <label for="about-paragraphs" :class="adminLabel">Paragraphes (une ligne vide entre chaque)</label>
        <textarea id="about-paragraphs" v-model="form.aboutParagraphs" rows="5" :class="adminInput"></textarea>
      </div>
      <div class="mt-4">
        <label for="about-photo" :class="adminLabel">Photo</label>
        <input id="about-photo" v-model="form.aboutPhoto" :class="adminInput">
      </div>
    </section>

    <section class="border border-(--border) p-6">
      <h2 class="font-heading text-xl font-bold">Stack</h2>
      <p class="mt-1 text-xs text-muted">Une ligne par groupe : <code>Titre: élément, élément</code></p>
      <textarea v-model="form.stackText" rows="7" :class="[adminInput, 'mt-4']"></textarea>
    </section>

    <section class="border border-(--border) p-6">
      <h2 class="font-heading text-xl font-bold">Contact</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label for="contact-email" :class="adminLabel">Email</label>
          <input id="contact-email" v-model="form.contactEmail" type="email" :class="adminInput">
        </div>
        <div>
          <label for="contact-github" :class="adminLabel">GitHub</label>
          <input id="contact-github" v-model="form.contactGithub" :class="adminInput">
        </div>
        <div>
          <label for="contact-linkedin" :class="adminLabel">LinkedIn</label>
          <input id="contact-linkedin" v-model="form.contactLinkedin" :class="adminInput">
        </div>
      </div>
    </section>

    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>

    <button type="submit" :class="adminButton" :disabled="busy">
      {{ busy ? 'Enregistrement…' : 'Enregistrer les réglages' }}
    </button>
  </form>
</template>
