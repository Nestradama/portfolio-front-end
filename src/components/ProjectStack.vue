<script setup lang="ts">
withDefaults(defineProps<{ items: string[]; variant?: 'compact' | 'default' }>(), {
  variant: 'compact',
})
</script>

<template>
  <div class="flex flex-wrap" :class="variant === 'compact' ? 'gap-1.5' : 'gap-2'">
    <span
      v-for="tech in items"
      :key="tech"
      class="border border-(--border) font-mono text-[10px] uppercase tracking-wider text-muted"
      :class="variant === 'compact' ? 'px-2 py-0.5' : 'px-2.5 py-1'"
    >{{ tech }}</span>
  </div>
</template>
