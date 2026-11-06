<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SiteSettings, StackGroup } from '@/data/settings'
import StackEditor from './StackEditor.vue'
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
  logo: '',
  favicon: '',
  homeTitle: '',
  homeParagraphs: '',
  homePhoto: '',
  aboutHeading: '',
  aboutParagraphs: '',
  aboutPhoto: '',
  stackGroups: [] as StackGroup[],
  contactEmail: '',
  contactGithub: '',
  contactLinkedin: '',
})

function fill(settings: SiteSettings) {
  form.logo = settings.logo ?? ''
  form.favicon = settings.favicon ?? ''
  // Older content stored the name in a separate field; fold it into the single title.
  form.homeTitle = [settings.home.heading, settings.home.name].filter(Boolean).join(' ')
  form.homeParagraphs = settings.home.paragraphs.join('\n\n')
  form.homePhoto = settings.home.photo
  form.aboutHeading = settings.about.heading
  form.aboutParagraphs = settings.about.paragraphs.join('\n\n')
  form.aboutPhoto = settings.about.photo
  form.stackGroups = settings.stack.groups.map((group) => ({
    title: group.title,
    items: [...group.items],
  }))
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

function submit() {
  emit('save', {
    logo: form.logo.trim(),
    favicon: form.favicon.trim(),
    home: {
      heading: form.homeTitle.trim(),
      // New content keeps the whole line in `heading`; `name` stays for legacy data.
      name: '',
      paragraphs: paragraphs(form.homeParagraphs),
      photo: form.homePhoto.trim(),
    },
    about: {
      heading: form.aboutHeading.trim(),
      paragraphs: paragraphs(form.aboutParagraphs),
      photo: form.aboutPhoto.trim(),
    },
    stack: { groups: form.stackGroups },
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
      <h2 class="font-heading text-xl font-bold">Identité</h2>
      <p class="mt-1 text-xs text-muted">Logo affiché dans l’en-tête et icône du site (favicon) affichée dans l’onglet du navigateur.</p>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <ImageField v-model="form.logo" :csrf="csrf" label="Logo de l’en-tête" />
        <ImageField v-model="form.favicon" :csrf="csrf" label="Logo du site (favicon)" />
      </div>
      <p class="mt-2 text-xs text-muted">Laisse un champ vide pour conserver le rendu par défaut.</p>
    </section>

    <section class="border border-(--border) p-6">
      <h2 class="font-heading text-xl font-bold">Accueil</h2>
      <div class="mt-4">
        <label for="home-title" :class="adminLabel">Titre affiché</label>
        <input
          id="home-title"
          v-model="form.homeTitle"
          :class="adminInput"
          placeholder="Salut, moi c'est Corentin."
        >
        <p class="mt-1 text-xs text-muted">Titre complet affiché sur une seule ligne en haut de l’accueil.</p>
      </div>
      <div class="mt-4">
        <label for="home-paragraphs" :class="adminLabel">Paragraphes (une ligne vide entre chaque)</label>
        <textarea id="home-paragraphs" v-model="form.homeParagraphs" rows="5" :class="adminInput"></textarea>
        <p class="mt-1 text-xs text-muted">Liens acceptés : <code>[texte](https://…)</code>, <code>[texte](mailto:…)</code> ou <code>[texte](/#contact)</code>.</p>
      </div>
      <div class="mt-4">
        <ImageField v-model="form.homePhoto" :csrf="csrf" label="Photo d’accueil" />
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
        <p class="mt-1 text-xs text-muted">Liens acceptés : <code>[texte](https://…)</code> ou <code>[texte](mailto:…)</code>.</p>
      </div>
      <div class="mt-4">
        <ImageField v-model="form.aboutPhoto" :csrf="csrf" label="Photo À propos" />
      </div>
    </section>

    <section class="border border-(--border) p-6">
      <h2 class="font-heading text-xl font-bold">Stack</h2>
      <p class="mt-1 text-xs text-muted">Ajoute des catégories puis des technologies dans chaque catégorie. Utilise les flèches pour l’ordre.</p>
      <div class="mt-4">
        <StackEditor v-model="form.stackGroups" />
      </div>
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
