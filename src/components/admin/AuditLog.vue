<script setup lang="ts">
import type { AuditEntry } from '@/api/admin'

defineProps<{
  entries: AuditEntry[]
  loading: boolean
  error: string
}>()

function formatDate(value: string): string {
  const date = new Date(value.replace(' ', 'T') + 'Z')
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('fr-FR')
}
</script>

<template>
  <div class="space-y-4">
    <p v-if="loading" class="font-mono text-sm text-muted" role="status">Chargement du journal…</p>
    <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>

    <div v-if="!loading && entries.length === 0" class="border border-(--border) p-6 text-sm text-muted">
      Aucune action enregistrée pour l’instant.
    </div>

    <div v-else-if="!loading" class="overflow-x-auto border border-(--border)">
      <table class="w-full text-left text-sm">
        <thead class="bg-(--card) text-xs font-semibold uppercase tracking-wide text-muted">
          <tr>
            <th class="p-3">Date</th>
            <th class="p-3">Action</th>
            <th class="p-3">Cible</th>
            <th class="p-3">IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.id" class="border-t border-(--border)">
            <td class="whitespace-nowrap p-3 font-mono text-xs text-muted">{{ formatDate(entry.createdAt) }}</td>
            <td class="p-3">
              <span class="font-medium">{{ entry.username }}</span>
              <span class="text-muted"> · {{ entry.action }}</span>
            </td>
            <td class="p-3 font-mono text-xs text-muted">{{ entry.target ?? '—' }}</td>
            <td class="p-3 font-mono text-xs text-muted">{{ entry.ip ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
