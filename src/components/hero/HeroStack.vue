<script setup lang="ts">
import { useContent } from '@/composables/useContent'

withDefaults(defineProps<{ headingLevel?: 'h1' | 'h2' }>(), { headingLevel: 'h1' })

const { settings } = useContent()
</script>

<template>
  <div>
    <component :is="headingLevel" class="font-heading text-[clamp(2.2rem,10vw,4.5rem)] font-bold mb-4 leading-[1.1] tracking-tight">
      Mon Stack.
    </component>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
      <div v-for="group in settings.stack.groups" :key="group.title">
        <h3 class="font-bold text-accent mb-2 uppercase tracking-wider">{{ group.title }}</h3>
        <ul class="space-y-1 text-muted">
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
