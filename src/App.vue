<script setup lang="ts">
import {ref} from "vue";

const legalOpen = ref(false)
const privacyOpen = ref(false)
const openLegal = () => (legalOpen.value = true)
const openPrivacy = () => (privacyOpen.value = true)

import HeroShell from '@/components/hero/HeroShell.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import ProjectsCarousel from "@/components/ProjectsCarousel.vue";
import VitrineSection from "@/components/VitrineSection.vue";

import LegalModal from "@/components/modals/LegalModal.vue";
import PrivacyModal from "@/components/modals/PrivacyModal.vue";
</script>

<template>
  <main class="grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-2.5 md:py-20">
    <HeroShell @open-privacy="openPrivacy()" />
    <ProjectsCarousel/>
    <VitrineSection/>
    <LegalModal :open="legalOpen" @close="legalOpen = false" />
    <PrivacyModal :open="privacyOpen" @close="privacyOpen = false" />
  </main>
  <SiteFooter email="roquin.corentin@protonmail.com" github="Nestradama" @open-legal="openLegal()" @open-privacy="openPrivacy()"/>
</template>