<script setup lang="ts">
const props = withDefaults(defineProps<{
  tagNames?: string[]
  modelValue: string
}>(), {
  tagNames: () => [],
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function select(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div v-if="tagNames.length" class="mb-8 flex flex-wrap items-center gap-2" aria-label="Filtrer les projets par tag">
    <span class="mr-1 font-mono text-[10px] uppercase tracking-wider text-muted">Filtres</span>
    <button
      type="button"
      class="border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
      :class="modelValue === '' ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
      @click="select('')"
    >Tous</button>
    <button
      v-for="tag in tagNames"
      :key="tag"
      type="button"
      class="border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
      :class="modelValue === tag ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
      @click="select(tag)"
    >{{ tag }}</button>
  </div>
</template>
