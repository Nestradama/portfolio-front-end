<script setup lang="ts">
import { ref, watch } from 'vue'
import type { StackGroup } from '@/data/settings'
import ListInput from './ListInput.vue'
import { adminButton, adminGhostButton, adminInput, adminLabel } from './adminStyles'

const props = defineProps<{ modelValue: StackGroup[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: StackGroup[]] }>()

const groups = ref<StackGroup[]>([])

watch(
  () => props.modelValue,
  (value) => {
    groups.value = value.map((group) => ({ title: group.title, items: [...group.items] }))
  },
  { immediate: true, deep: true },
)

function sync() {
  emit('update:modelValue', groups.value.map((group) => ({ title: group.title, items: [...group.items] })))
}

function addGroup() {
  groups.value.push({ title: 'Nouvelle catégorie', items: [] })
  sync()
}

function removeGroup(index: number) {
  groups.value.splice(index, 1)
  sync()
}

function moveGroup(index: number, offset: number) {
  const target = index + offset
  if (target < 0 || target >= groups.value.length) return
  const source = groups.value[index]
  const destination = groups.value[target]
  if (!source || !destination) return
  groups.value[index] = destination
  groups.value[target] = source
  sync()
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="(group, index) in groups" :key="index" class="border border-(--border) p-4">
      <div class="flex flex-wrap items-center gap-2">
        <input v-model="group.title" :class="[adminInput, 'flex-1']" aria-label="Nom de la catégorie" @input="sync">
        <button type="button" :class="adminGhostButton" :disabled="index === 0" aria-label="Monter la catégorie" @click="moveGroup(index, -1)">↑</button>
        <button type="button" :class="adminGhostButton" :disabled="index === groups.length - 1" aria-label="Descendre la catégorie" @click="moveGroup(index, 1)">↓</button>
        <button type="button" :class="adminGhostButton" @click="removeGroup(index)">Supprimer</button>
      </div>
      <div class="mt-3">
        <label :class="adminLabel">Éléments</label>
        <ListInput
          :model-value="group.items"
          placeholder="Ajouter une technologie…"
          @update:model-value="group.items = $event; sync()"
        />
      </div>
    </div>

    <button type="button" :class="adminButton" @click="addGroup">Ajouter une catégorie</button>
  </div>
</template>
