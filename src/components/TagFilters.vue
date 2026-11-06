<script setup lang="ts">
withDefaults(defineProps<{
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
  <div v-if="tagNames.length" class="mb-8" role="group" aria-label="Filtrer les projets par tag">
    <span class="mb-2 hidden text-sm font-medium text-muted sm:block">Filtrer :</span>

    <!-- Mobile: one scrollable strip. Desktop: wrapped rows. -->
    <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        class="shrink-0 whitespace-nowrap border px-3 py-1.5 text-sm font-medium transition-colors"
        :class="modelValue === '' ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
        @click="select('')"
      >Tous</button>
      <button
        v-for="tag in tagNames"
        :key="tag"
        type="button"
        class="shrink-0 whitespace-nowrap border px-3 py-1.5 text-sm font-medium transition-colors"
        :class="modelValue === tag ? 'border-accent bg-accent text-black' : 'border-(--border) text-muted hover:border-accent'"
        @click="select(tag)"
      >{{ tag }}</button>
    </div>
  </div>
</template>
