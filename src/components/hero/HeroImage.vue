<script setup lang="ts">
import { useContent } from '@/composables/useContent'

const { settings } = useContent()
</script>

<template>
  <div class="w-24 sm:w-32 md:w-40 aspect-square bg-(--card) border-2 border-(--border) overflow-hidden group">
    <img :src="settings.home.photo" alt="Photo de profil de Corentin ROQUIN" class="w-full h-full object-cover transition-all duration-700">
  </div>
</template>
