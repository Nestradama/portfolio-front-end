<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-(--border) bg-(--bg)/90 backdrop-blur">
    <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
      <RouterLink to="/" class="font-heading text-sm font-bold tracking-tight sm:text-base">
        Corentin ROQUIN<span class="text-accent">.</span>
      </RouterLink>

      <nav class="flex items-center gap-4 font-mono text-[0.68rem] uppercase tracking-widest sm:gap-7 sm:text-xs" aria-label="Navigation du site">
        <RouterLink
          to="/"
          exact-active-class="text-accent"
          class="text-muted transition-colors hover:text-accent"
        >Accueil</RouterLink>
        <RouterLink
          to="/projets"
          active-class="text-accent"
          class="text-muted transition-colors hover:text-accent"
        >Projets</RouterLink>
        <RouterLink
          to="/a-propos"
          active-class="text-accent"
          class="text-muted transition-colors hover:text-accent"
        >À propos</RouterLink>
      </nav>
    </div>
  </header>
</template>
