<script setup lang="ts">
import { computed, ref } from 'vue'
import { adminApi, ApiError } from '@/api/admin'
import { adminGhostButton, adminLabel } from './adminStyles'

const props = defineProps<{
  modelValue: string
  csrf: string
  label: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const error = ref('')

const value = computed({
  get: () => props.modelValue,
  set: (next: string) => emit('update:modelValue', next),
})

async function chooseFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  error.value = ''

  try {
    const uploaded = await adminApi.upload(file, props.csrf)
    value.value = uploaded.url
  } catch (failure) {
    error.value = failure instanceof ApiError ? failure.message : 'Upload impossible.'
  } finally {
    uploading.value = false
    input.value = ''
  }
}
</script>

<template>
  <div>
    <label :class="adminLabel">{{ label }}</label>
    <div class="flex flex-wrap gap-2">
      <input v-model="value" placeholder="/assets/... ou /api/media/..." class="min-w-0 flex-1 border border-(--border) bg-transparent px-3 py-2 text-sm text-ink">
      <button type="button" :class="adminGhostButton" :disabled="uploading" @click="fileInput?.click()">
        {{ uploading ? 'Upload…' : 'Upload' }}
      </button>
      <a v-if="value" :href="value" target="_blank" rel="noreferrer" :class="adminGhostButton">Preview</a>
    </div>
    <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden" @change="chooseFile">
    <p v-if="error" class="mt-2 text-xs text-red-400" role="alert">{{ error }}</p>
  </div>
</template>
