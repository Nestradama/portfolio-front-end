<script setup lang="ts">
import type { ApiProject } from '@/api/content'

defineProps<{ projects: ApiProject[]; busy: boolean }>()
const emit = defineEmits<{
  edit: [project: ApiProject]
  remove: [project: ApiProject]
  move: [index: number, offset: number]
}>()
</script>

<template>
  <div class="overflow-x-auto border border-(--border)">
    <table class="w-full text-left text-sm">
      <thead class="bg-(--card) text-xs font-semibold uppercase tracking-wide text-muted">
        <tr>
          <th class="p-3">Titre</th>
          <th class="p-3">Contexte</th>
          <th class="p-3">État</th>
          <th class="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(project, index) in projects" :key="project.id" class="border-t border-(--border)">
          <td class="p-3">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <button type="button" class="px-1 text-accent disabled:text-muted/40" :disabled="busy || index === 0" aria-label="Monter le projet" @click="emit('move', index, -1)">↑</button>
                <button type="button" class="px-1 text-accent disabled:text-muted/40" :disabled="busy || index === projects.length - 1" aria-label="Descendre le projet" @click="emit('move', index, 1)">↓</button>
              </div>
              <span class="font-medium">{{ project.title }}</span>
            </div>
          </td>
          <td class="p-3 text-muted">{{ project.context }}</td>
          <td class="p-3">
            <span :class="project.published ? 'text-green-400' : 'text-muted'">
              {{ project.published ? 'Publié' : 'Masqué' }}
            </span>
          </td>
          <td class="p-3">
            <div class="flex gap-3">
              <button type="button" class="text-accent hover:underline" @click="emit('edit', project)">Modifier</button>
              <button type="button" class="text-red-400 hover:underline" @click="emit('remove', project)">Supprimer</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
