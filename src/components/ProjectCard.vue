<script setup lang="ts">
import type { Project } from '@/data/projects'

withDefaults(defineProps<{ project: Project; index?: number }>(), { index: 0 })
</script>

<template>
  <article class="neo-card p-6 w-65 sm:w-[320px] md:w-87.5 flex flex-col shrink-0 min-h-62.5 sm:min-h-70">
    <div class="font-mono text-xs text-pink mb-2 uppercase tracking-tighter">0{{ index + 1 }} // Projet</div>
    <h3 class="font-heading text-xl sm:text-2xl font-bold mb-3">{{ project.title }}</h3>
    <p class="text-xs sm:text-sm text-muted leading-relaxed mb-6 line-clamp-3">{{ project.shortDesc }}</p>
    <div class="flex flex-wrap gap-2 mt-auto">
      <span v-for="tech in project.stack" :key="tech" class="text-xs font-mono border border-(--border) px-2 py-0.5">{{ tech }}</span>
    </div>
  </article>
</template>
