<script setup lang="ts">
const { sectionName, headingId } = defineProps<{ sectionName: string; headingId: string }>()

const sectionNameStylized = sectionName.split(' ').join('_') + '_'
</script>

<template>
  <div class="flex justify-between items-end mb-8 border-b border-(--border) pb-4">
    <h2 :id="headingId" class="font-heading text-2xl sm:text-4xl font-bold">{{ sectionNameStylized }}</h2>
    <slot name="actions" />
  </div>
</template>