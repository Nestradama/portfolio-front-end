<script setup lang="ts">
import type { ApiVitrine } from '@/api/content'

defineProps<{ vitrines: ApiVitrine[]; busy: boolean }>()
const emit = defineEmits<{
  edit: [vitrine: ApiVitrine]
  remove: [vitrine: ApiVitrine]
  move: [index: number, offset: number]
}>()
</script>

<template>
  <div class="overflow-x-auto border border-(--border)">
    <table class="w-full text-left text-sm">
      <thead class="bg-(--card) text-xs font-semibold uppercase tracking-wide text-muted">
        <tr>
          <th class="p-3">Titre</th>
          <th class="p-3">Lien</th>
          <th class="p-3">État</th>
          <th class="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vitrine, index) in vitrines" :key="vitrine.id" class="border-t border-(--border)">
          <td class="p-3">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <button type="button" class="px-1 text-accent disabled:text-muted/40" :disabled="busy || index === 0" aria-label="Monter la vitrine" @click="emit('move', index, -1)">↑</button>
                <button type="button" class="px-1 text-accent disabled:text-muted/40" :disabled="busy || index === vitrines.length - 1" aria-label="Descendre la vitrine" @click="emit('move', index, 1)">↓</button>
              </div>
              <span class="font-medium">{{ vitrine.title }}</span>
            </div>
          </td>
          <td class="p-3 font-mono text-xs text-muted">{{ vitrine.link ?? '—' }}</td>
          <td class="p-3">
            <span :class="vitrine.published ? 'text-green-400' : 'text-muted'">
              {{ vitrine.published ? 'Publié' : 'Masqué' }}
            </span>
          </td>
          <td class="p-3">
            <div class="flex gap-3">
              <button type="button" class="text-accent hover:underline" @click="emit('edit', vitrine)">Modifier</button>
              <button type="button" class="text-red-400 hover:underline" @click="emit('remove', vitrine)">Supprimer</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
