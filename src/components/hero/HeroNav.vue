<script setup lang="ts">
defineProps<{
  active: 'me' | 'stack' | 'contact'
}>()

const emit = defineEmits<{ select: [tab: 'me' | 'stack' | 'contact'] }>()
</script>

<template>
  <nav class="flex flex-row md:flex-col flex-wrap gap-4 md:gap-3 font-mono text-[0.75rem] md:text-[1rem] sm:text-[0.8rem] uppercase tracking-widest w-full" aria-label="Navigation principale">
    <button
        :class="active === 'me' ? 'text-accent underline' : 'text-muted'"
        @click="emit('select', 'me')"
    >01. Moi
    </button>
    <p class="md:hidden">|</p>
    <button
        :class="active === 'stack' ? 'text-accent underline' : 'text-muted'"
        @click="emit('select', 'stack')"
    >02. Stack
    </button>
    <p class="md:hidden">|</p>

    <button
        :class="active === 'contact' ? 'text-accent underline' : 'text-muted'"
        @click="emit('select', 'contact')"
    >03. Contact
    </button>
  </nav>
</template>
