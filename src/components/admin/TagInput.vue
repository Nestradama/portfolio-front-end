<script setup lang="ts">
import { ref } from 'vue'
import { adminInput, adminLabel } from './adminStyles'

const props = defineProps<{
  modelValue: string[]
  suggestions?: string[]
  label?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const input = ref('')

function add() {
  const values = input.value
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (values.length === 0) return

  const next = [...props.modelValue]
  for (const value of values) {
    if (!next.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      next.push(value)
    }
  }

  emit('update:modelValue', next)
  input.value = ''
}

function remove(tag: string) {
  emit('update:modelValue', props.modelValue.filter((value) => value !== tag))
}
</script>

<template>
  <div>
    <label v-if="label" :class="adminLabel">{{ label }}</label>
    <div v-if="modelValue.length" class="mb-2 flex flex-wrap gap-2">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 border border-(--border) px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted"
      >
        {{ tag }}
        <button type="button" class="text-red-400 hover:text-red-300" :aria-label="`Retirer ${tag}`" @click="remove(tag)">×</button>
      </span>
    </div>
    <input
      v-model="input"
      :class="adminInput"
      placeholder="Ajouter un tag puis Entrée"
      :list="suggestions?.length ? 'project-tag-suggestions' : undefined"
      @keydown.enter.prevent="add"
      @keydown.,.prevent="add"
      @blur="add"
    >
    <datalist v-if="suggestions?.length" id="project-tag-suggestions">
      <option v-for="tag in suggestions" :key="tag" :value="tag" />
    </datalist>
  </div>
</template>
