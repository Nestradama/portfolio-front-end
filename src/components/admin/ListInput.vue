<script setup lang="ts">
import { ref } from 'vue'
import { adminGhostButton, adminInput, adminLabel } from './adminStyles'

const props = withDefaults(defineProps<{
  modelValue: string[]
  label?: string
  placeholder?: string
  variant?: 'chips' | 'rows'
}>(), {
  label: '',
  placeholder: 'Ajouter…',
  variant: 'chips',
})

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const input = ref('')

function add() {
  const value = input.value.trim()
  if (!value) return
  emit('update:modelValue', [...props.modelValue, value])
  input.value = ''
}

function remove(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, current) => current !== index))
}

function move(index: number, offset: number) {
  const target = index + offset
  if (target < 0 || target >= props.modelValue.length) return

  const next = [...props.modelValue]
  const sourceValue = next[index]
  const targetValue = next[target]
  if (sourceValue === undefined || targetValue === undefined) return
  next[index] = targetValue
  next[target] = sourceValue
  emit('update:modelValue', next)
}
</script>

<template>
  <div>
    <label v-if="label" :class="adminLabel">{{ label }}</label>

    <div v-if="variant === 'chips'" class="mb-2 flex flex-wrap gap-2">
      <span
        v-for="(item, index) in modelValue"
        :key="`${item}-${index}`"
        class="inline-flex items-center gap-1 border border-(--border) px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted"
      >
        {{ item }}
        <button type="button" class="text-accent" :aria-label="`Monter ${item}`" @click="move(index, -1)">↑</button>
        <button type="button" class="text-accent" :aria-label="`Descendre ${item}`" @click="move(index, 1)">↓</button>
        <button type="button" class="text-red-400" :aria-label="`Retirer ${item}`" @click="remove(index)">×</button>
      </span>
    </div>

    <ul v-else-if="modelValue.length" class="mb-2 divide-y divide-(--border) border border-(--border)">
      <li v-for="(item, index) in modelValue" :key="`${item}-${index}`" class="flex items-center gap-2 p-2 text-sm">
        <span class="flex-1">{{ item }}</span>
        <button type="button" class="px-1 text-accent" :aria-label="`Monter ${item}`" @click="move(index, -1)">↑</button>
        <button type="button" class="px-1 text-accent" :aria-label="`Descendre ${item}`" @click="move(index, 1)">↓</button>
        <button type="button" class="px-1 text-red-400" :aria-label="`Retirer ${item}`" @click="remove(index)">×</button>
      </li>
    </ul>

    <div class="flex gap-2">
      <input v-model="input" :placeholder="placeholder" :aria-label="label || placeholder" :class="adminInput" @keydown.enter.prevent="add">
      <button type="button" :class="adminGhostButton" @click="add">Ajouter</button>
    </div>
  </div>
</template>
