<script setup lang="ts">
import ModalShell from './ModalShell.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
<ModalShell title="Politique de confidentialité" :open="open" @close="emit('close')">
  <p>Cette politique de confidentialité décrit comment vos données personnelles sont collectées, utilisées et partagées lorsque vous utilisez le formulaire de contact sur ce site.</p>
  <p><strong class="text-text">Collecte des données :</strong> Nous collectons les informations que vous nous fournissez directement via le formulaire de contact, y compris votre nom, votre email ou numéro de téléphone, et votre message.</p>
  <p><strong class="text-text">Utilisation des données :</strong> Les informations que vous fournissez sont utilisées uniquement dans le but de répondre à votre demande. Elles sont reçues sur la plateforme de messagerie sécurisée ProtonMail et ne sont traitées que par Corentin ROQUIN.</p>
  <p><strong class="text-text">Partage des données :</strong> Vos données personnelles ne sont jamais vendues, échangées ou transférées à des tiers.</p>
  <p><strong class="text-text">Vos droits :</strong> Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, veuillez nous contacter à l'adresse email fournie dans les mentions légales.</p>
</ModalShell>
</template>
