<script setup lang="ts">
import { ref } from 'vue'
import type { Tag } from '@/data/tags'
import { adminApi, ApiError } from '@/api/admin'
import { adminButton, adminGhostButton, adminInput, adminLabel } from './adminStyles'

const props = defineProps<{
  tags: Tag[]
  stackOptions: string[]
  csrf: string
}>()

const emit = defineEmits<{ changed: [] }>()

const name = ref('')
const stack = ref('')
const visible = ref(true)
const busy = ref(false)
const error = ref('')

async function create() {
  if (!name.value.trim()) return
  busy.value = true
  error.value = ''
  try {
    await adminApi.createTag(
      { name: name.value.trim(), stack: stack.value || null, visible: visible.value },
      props.csrf,
    )
    name.value = ''
    emit('changed')
  } catch (failure) {
    error.value = failure instanceof ApiError ? failure.message : 'Création impossible.'
  } finally {
    busy.value = false
  }
}

async function update(tag: Tag, value: string) {
  busy.value = true
  error.value = ''
  try {
    await adminApi.updateTag(
      tag.id,
      { name: tag.name, stack: value || null, visible: tag.visible },
      props.csrf,
    )
    emit('changed')
  } catch (failure) {
    error.value = failure instanceof ApiError ? failure.message : 'Mise à jour impossible.'
  } finally {
    busy.value = false
  }
}

async function toggleVisible(tag: Tag) {
  busy.value = true
  error.value = ''
  try {
    await adminApi.updateTag(
      tag.id,
      { name: tag.name, stack: tag.stack, visible: !tag.visible },
      props.csrf,
    )
    emit('changed')
  } catch (failure) {
    error.value = failure instanceof ApiError ? failure.message : 'Mise à jour impossible.'
  } finally {
    busy.value = false
  }
}

async function remove(tag: Tag) {
  if (!window.confirm(`Supprimer le tag « ${tag.name} » ?`)) return
  busy.value = true
  error.value = ''
  try {
    await adminApi.deleteTag(tag.id, props.csrf)
    emit('changed')
  } catch (failure) {
    error.value = failure instanceof ApiError ? failure.message : 'Suppression impossible.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-5">
    <form class="grid gap-3 border border-(--border) p-4 md:grid-cols-[1fr_14rem_auto]" @submit.prevent="create">
      <div>
        <label for="tag-name" :class="adminLabel">Nouveau tag</label>
        <input id="tag-name" v-model="name" :class="adminInput" required>
      </div>
      <div>
        <label for="tag-stack" :class="adminLabel">Stack</label>
        <select id="tag-stack" v-model="stack" :class="adminInput">
          <option value="">Sans stack</option>
          <option v-for="option in stackOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <label class="mt-2 flex items-center gap-2 text-xs text-muted">
          <input v-model="visible" type="checkbox" class="h-4 w-4 accent-[var(--accent)]">
          Visible dans les filtres publics
        </label>
      </div>
      <button type="submit" :class="[adminButton, 'self-end']" :disabled="busy">Créer</button>
    </form>

    <div class="overflow-x-auto border border-(--border)">
      <table class="w-full text-left text-sm">
                <thead class="bg-(--card) text-xs font-semibold uppercase tracking-wide text-muted">
                  <tr><th class="p-3">Tag</th><th class="p-3">Stack</th><th class="p-3">Filtre</th><th class="p-3">Utilisations</th><th class="p-3">Actions</th></tr>
                </thead>
                <tbody>
                  <tr v-for="tag in tags" :key="tag.id" class="border-t border-(--border)">
                    <td class="p-3 font-medium">{{ tag.name }}</td>
                    <td class="p-3">
                      <select :value="tag.stack ?? ''" class="border border-(--border) bg-transparent px-2 py-1 text-sm text-ink" :disabled="busy" @change="update(tag, ($event.target as HTMLSelectElement).value)">
                        <option value="">Sans stack</option>
                        <option v-for="option in stackOptions" :key="option" :value="option">{{ option }}</option>
                      </select>
                    </td>
                    <td class="p-3">
                      <input type="checkbox" :checked="tag.visible" :disabled="busy" :aria-label="`Afficher le tag ${tag.name} dans les filtres`" @change="toggleVisible(tag)">
                    </td>
                    <td class="p-3 font-mono text-xs text-muted">{{ tag.usage }} projet{{ tag.usage > 1 ? 's' : '' }}</td>
                    <td class="p-3">
                      <button type="button" :class="adminGhostButton" :disabled="busy" @click="remove(tag)">Supprimer</button>
                    </td>
                  </tr>
                </tbody>
      </table>
    </div>

    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>
  </div>
</template>
