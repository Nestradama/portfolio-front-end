<script setup lang="ts">
import {onMounted, onBeforeUnmount, watch} from "vue";

const props = defineProps<
    { title: string; open: boolean }>()
const emit = defineEmits<{ close: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))


watch(() => props.open, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <div v-if="open" @click.self="emit('close')"
       class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
       :aria-label="title" role="dialog" aria-modal="true">
    <div
        class="bg-(--card) border border-(--border) rounded-lg shadow-2xl p-6 sm:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
      <button class="absolute top-4 right-4 text-muted hover:text-accent"
              aria-label="Fermer la modale" @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
      <h2 class="font-heading text-2xl font-bold mb-6">{{ title }}</h2>
      <div class="space-y-4 text-sm text-muted">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
