<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<
    { title: string; open: boolean; wide?: boolean; hideTitle?: boolean }>(), { wide: false, hideTitle: false })
const emit = defineEmits<{ close: [] }>()

const dialogRef = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}

function focusableElements(): HTMLElement[] {
  const dialog = dialogRef.value
  if (!dialog) return []

  return Array.from(dialog.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter((element) => element.offsetParent !== null)
}

function trapFocus(event: KeyboardEvent) {
  const dialog = dialogRef.value
  if (!dialog) return

  const focusable = focusableElements()
  if (focusable.length === 0) {
    event.preventDefault()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  previouslyFocused?.focus()
  previouslyFocused = null
})

watch(() => props.open, async (open) => {
  // The modal owns the page scroll while it is open; restore it on unmount too in case
  // the parent removes the component without toggling `open`.
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    // Keep the trigger so focus can return to it when the dialog closes.
    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    await nextTick()
    dialogRef.value?.focus()
  } else {
    previouslyFocused?.focus()
    previouslyFocused = null
  }
})
</script>

<template>
  <div v-if="open" ref="dialogRef" tabindex="-1" @click.self="emit('close')" @keydown.tab="trapFocus"
       class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 outline-none"
       :aria-label="title" role="dialog" aria-modal="true">
    <div
        :class="wide ? 'max-w-4xl' : 'max-w-2xl'"
        class="bg-(--card) border border-(--border) rounded-lg shadow-2xl p-6 sm:p-8 w-full relative max-h-[90vh] overflow-y-auto">
      <button class="absolute top-4 right-4 text-muted hover:text-accent"
              aria-label="Fermer la modale" @click="emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
      <!-- The project detail modal draws its own title over the header image. -->
      <h2 v-if="!hideTitle" class="mb-6 font-heading text-2xl font-bold">{{ title }}</h2>
      <div class="space-y-4 text-sm text-muted">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
