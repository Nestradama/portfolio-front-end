<script setup lang="ts">
withDefaults(defineProps<{ reasons: string[]; variant?: 'compact' | 'list' | 'grid' }>(), {
  variant: 'compact',
})
</script>

<template>
  <ul :class="variant === 'grid' ? 'grid gap-x-6 gap-y-2 sm:grid-cols-2' : variant === 'list' ? 'space-y-3' : 'space-y-2'">
    <li
      v-for="reason in reasons"
      :key="reason"
      class="flex text-sm leading-relaxed text-muted"
      :class="variant === 'list' ? 'gap-3' : 'gap-2'"
    >
      <span class="text-pink" :class="variant === 'list' ? 'mt-1' : 'mt-0.5'" aria-hidden="true">↳</span>
      <span>{{ reason }}</span>
    </li>
  </ul>
</template>
