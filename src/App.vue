<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import LegalModal from '@/components/modals/LegalModal.vue'
import PrivacyModal from '@/components/modals/PrivacyModal.vue'
import { useContent } from '@/composables/useContent'

const legalOpen = ref(false)
const privacyOpen = ref(false)
const openLegal = () => (legalOpen.value = true)
const openPrivacy = () => (privacyOpen.value = true)

const { load } = useContent()
onMounted(load)
</script>

<template>
  <SiteHeader />

  <main class="grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
    <RouterView v-slot="{ Component }">
      <component :is="Component" @open-privacy="openPrivacy()" />
    </RouterView>

    <LegalModal :open="legalOpen" @close="legalOpen = false" />
    <PrivacyModal :open="privacyOpen" @close="privacyOpen = false" />
  </main>

  <SiteFooter
    email="roquin.corentin@protonmail.com"
    github="Nestradama"
    @open-legal="openLegal()"
    @open-privacy="openPrivacy()"
  />
</template>
