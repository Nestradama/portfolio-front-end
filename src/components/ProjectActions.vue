<script setup lang="ts">
import type { Project } from '@/data/projects'

withDefaults(defineProps<{ project: Project; compact?: boolean }>(), { compact: false })
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <!-- The main link only renders when it has a label; otherwise there is nothing to click. -->
    <a
      v-if="project.link && project.linkText.trim()"
      :href="project.link"
      tabindex="0"
      :class="compact ? 'px-3 py-2' : 'px-4 py-2'"
      class="inline-flex border border-(--border) font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-accent hover:text-black"
    >{{ project.linkText }} <span aria-hidden="true">↗</span></a>
    <span
      v-else-if="project.linkText.trim()"
      :class="compact ? 'px-3 py-2' : 'px-4 py-2'"
      class="inline-flex border border-(--border) font-mono text-[10px] uppercase tracking-widest text-muted/60"
    >{{ project.linkText }}</span>

    <!-- GitHub is a separate opt-out: `showGithub` can hide it without clearing the URL. -->
    <a
      v-if="project.github && project.showGithub !== false"
      :href="project.github"
      target="_blank"
      rel="noreferrer"
      tabindex="0"
      :aria-label="`Voir le code de ${project.title} sur GitHub`"
      :class="compact ? 'px-3 py-2' : 'px-4 py-2'"
      class="inline-flex border border-(--border) font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-accent hover:text-black"
    >GitHub <span aria-hidden="true">↗</span></a>
  </div>
</template>
