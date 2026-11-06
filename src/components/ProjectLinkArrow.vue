<script setup lang="ts">
import type { Project } from '@/data/projects'

withDefaults(defineProps<{ project: Project; overlay?: boolean }>(), { overlay: false })
</script>

<template>
  <!-- A project without a label has no visible call to action, so the arrow is hidden too. -->
  <a
    v-if="project.link && project.linkText.trim()"
    :href="project.link"
    :aria-label="`Ouvrir le lien de ${project.title}`"
    :class="overlay
      ? 'border-white/30 text-white/90 hover:border-accent hover:bg-accent hover:text-black'
      : 'border-(--border) text-muted hover:border-accent hover:bg-accent hover:text-black'"
    class="inline-flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-sm transition-colors"
  >↗</a>
</template>
