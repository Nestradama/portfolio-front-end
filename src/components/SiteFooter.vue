<script setup lang="ts">
defineProps<{
  email:string
  github:string
}>()

const emit = defineEmits<{ openLegal: []; openPrivacy: [] }>()
</script>

<template>
  <footer class="border-t border-(--border) py-12 bg-(--card) px-4">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex flex-wrap justify-center gap-6 font-mono text-xs uppercase tracking-widest text-muted" aria-label="Navigation de pied de page">
        <a href="#" id="legal-link" class="hover:text-accent" @click.prevent="emit('openLegal')">Mentions Légales</a>
        <a href="#" id="privacy-link" class="hover:text-accent" @click.prevent="emit('openPrivacy')">Politique de Confidentialité</a>
        <a v-if="email" :href="'mailto:'+email" class="hover:text-accent">Email</a>
      </div>
      <div class="font-mono text-xs text-muted uppercase tracking-widest">[ &copy; 2026 Corentin ROQUIN ]</div>
    </div>
  </footer>
</template>
