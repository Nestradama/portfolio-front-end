<script setup lang="ts">
import ModalShell from './ModalShell.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <ModalShell title="Mentions Légales" :open="open" @close="emit('close')">
    <p><strong class="text-text">Identité :</strong> Corentin ROQUIN</p>
    <p><strong class="text-text">Contact :</strong> <a href="mailto:roquin.corentin@protonmail.com"
                                                       class="text-accent hover:underline">roquin.corentin@protonmail.com</a>
    </p>
    <p><strong class="text-text">Directeur de la publication :</strong> Corentin ROQUIN</p>
    <div>
      <p><strong class="text-text">Hébergeur :</strong></p>
      <p>O2Switch</p>
      <p>CHEMIN DES PARDIAUX</p>
      <p>63000 CLERMONT-FERRAND, FRANCE</p>
      <p>+33 4 44 44 60 40</p>
    </div>
  </ModalShell>
</template>
