<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import LegalModal from '@/components/modals/LegalModal.vue'
import PrivacyModal from '@/components/modals/PrivacyModal.vue'
import { useContent } from '@/composables/useContent'

const legalOpen = ref(false)
const privacyOpen = ref(false)
const openLegal = () => (legalOpen.value = true)
const openPrivacy = () => (privacyOpen.value = true)

const route = useRoute()
const { load, settings } = useContent()
onMounted(load)

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function iconType(url: string): string | null {
  const path = url.split('?')[0]?.toLowerCase() ?? ''
  if (path.endsWith('.png')) return 'image/png'
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.gif')) return 'image/gif'
  if (path.endsWith('.svg')) return 'image/svg+xml'
  if (path.endsWith('.ico')) return 'image/x-icon'
  return null
}

function applyFavicon(url: string) {
  if (!url) return

  // index.html ships a full favicon set; a custom favicon rewrites every icon link so
  // the browser tab and the iOS shortcut both use the uploaded image.
  const type = iconType(url)
  const links = document.head.querySelectorAll<HTMLLinkElement>(
    'link[rel="icon"], link[rel="apple-touch-icon"]',
  )

  links.forEach((link) => {
    link.href = url
    link.removeAttribute('sizes')
    if (type) {
      link.type = type
    } else {
      link.removeAttribute('type')
    }
  })
}

watchEffect(() => {
  applyFavicon(settings.value.favicon ?? '')

  if (route.name === 'admin') {
    return
  }

  const page = route.name === 'projects' ? 'projects' : route.name === 'about' ? 'about' : 'home'
  const meta = settings.value.seo.pages[page]

  document.title = meta.title
  setMeta('name', 'description', meta.description)
  setMeta('property', 'og:title', meta.title)
  setMeta('property', 'og:description', meta.description)
  setMeta('property', 'og:site_name', settings.value.seo.siteName)
})
</script>

<template>
  <a href="#contenu" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-black">Aller au contenu</a>
  <SiteHeader />

  <main id="contenu" tabindex="-1" class="grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 outline-none">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.fullPath" @open-privacy="openPrivacy()" />
      </Transition>
    </RouterView>

    <LegalModal :open="legalOpen" @close="legalOpen = false" />
    <PrivacyModal :open="privacyOpen" @close="privacyOpen = false" />
  </main>

  <SiteFooter
    :email="settings.contact.email"
    :github="settings.contact.github"
    @open-legal="openLegal()"
    @open-privacy="openPrivacy()"
  />
</template>
