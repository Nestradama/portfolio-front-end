<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/data/tags'
import { adminLabel } from './adminStyles'

const props = defineProps<{
  modelValue: string[]
  tags: Tag[]
  label?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const groups = computed(() => {
  const result: Array<{ stack: string; tags: Tag[] }> = []
  for (const tag of props.tags) {
    const stack = tag.stack ?? 'Sans stack'
    const group = result.find((item) => item.stack === stack)
    if (group) group.tags.push(tag)
    else result.push({ stack, tags: [tag] })
  }
  return result
})

function toggle(name: string) {
  const next = props.modelValue.includes(name)
    ? props.modelValue.filter((tag) => tag !== name)
    : [...props.modelValue, name]
  emit('update:modelValue', next)
}
</script>

<template>
  <div>
    <label v-if="label" :class="adminLabel">{{ label }}</label>
    <p v-if="!tags.length" class="text-xs text-muted">Crée d’abord des tags dans l’onglet Tags.</p>
    <div v-else class="space-y-3">
      <div v-for="group in groups" :key="group.stack">
        <p class="mb-1 font-mono text-[10px] uppercase tracking-wider text-accent">{{ group.stack }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in group.tags"
            :key="tag.id"
            type="button"
            class="border px-2.5 py-1 text-xs transition-colors"
            :class="modelValue.includes(tag.name) ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
            @click="toggle(tag.name)"
          >{{ tag.name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
