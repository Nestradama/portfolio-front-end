<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/data/tags'

const props = withDefaults(defineProps<{
  tagNames?: string[]
  catalog?: Tag[]
  modelValue: string
}>(), {
  tagNames: () => [],
  catalog: () => [],
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const groups = computed(() => {
  const result: Array<{ stack: string; tags: Array<{ name: string; id: number }> }> = []

  for (const name of props.tagNames) {
    const catalogTag = props.catalog.find((tag) => tag.name === name)
    const stack = catalogTag?.stack ?? 'Sans stack'
    const group = result.find((item) => item.stack === stack)
    const entry = { name, id: catalogTag?.id ?? 0 }

    if (group) group.tags.push(entry)
    else result.push({ stack, tags: [entry] })
  }

  return result
})

function select(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div v-if="tagNames.length" class="mb-8 space-y-3" aria-label="Filtrer les projets par tag">
    <div class="flex flex-wrap items-center gap-2">
      <span class="font-mono text-[10px] uppercase tracking-wider text-muted">Filtres</span>
      <button
        type="button"
        class="border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
        :class="modelValue === '' ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
        @click="select('')"
      >Tous</button>
    </div>
    <div v-for="group in groups" :key="group.stack" class="flex flex-wrap items-center gap-2">
      <span class="min-w-24 font-mono text-[10px] uppercase tracking-wider text-accent">{{ group.stack }}</span>
      <button
        v-for="tag in group.tags"
        :key="tag.name"
        type="button"
        class="border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
        :class="modelValue === tag.name ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
        @click="select(tag.name)"
      >{{ tag.name }}</button>
    </div>
  </div>
</template>
