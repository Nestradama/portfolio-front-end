<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{openPrivacy: []}>()

const name = ref('')
const contactInfo = ref('')
const message = ref('')
const consent = ref(false)
const status = ref('')
const statusColor = ref<'error' | 'success' | ''>('')

const ACCESS_KEY = "aabc9114-18a0-4ca9-aba1-1d66955a6aca"
const ACTION_URL = "https://api.web3forms.com/submit"

function handleSubmit() {
  if (!consent.value) {
    setStatus('Veuillez accepter la politique de confidentialité.', 'error')
    return
  }
  if (!name.value.trim()) {
    setStatus('Veuillez entrer votre nom.', 'error')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+?[0-9\s-()]{10,}$/
  const info = contactInfo.value.trim()
  if (!emailRegex.test(info) && !phoneRegex.test(info)) {
    setStatus('Veuillez entrer une adresse email ou un numéro de téléphone valide.', 'error')
    return
  }

  if (message.value.trim().length < 20) {
    setStatus('Le message doit contenir au moins 20 caractères.', 'error')
    return
  }

  const formData = new FormData()
  formData.append('access_key', ACCESS_KEY)
  formData.append('name', name.value)
  formData.append('contact-info', contactInfo.value)
  formData.append('message', message.value)

  setStatus('Envoi en cours...')

  fetch(ACTION_URL, { method: 'POST', body: formData, headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('Message envoyé avec succès !', 'success')
          name.value = ''
          contactInfo.value = ''
          message.value = ''
          consent.value = false
        } else {
          setStatus('Une erreur est survenue. Veuillez réessayer.', 'error')
        }
        clearStatusSoon()
      })
      .catch(() => {
        setStatus('Une erreur est survenue. Veuillez réessayer.', 'error')
        clearStatusSoon()
      })
}

function setStatus(text: string, color: 'error' | 'success' | '' = '') {
  status.value = text
  statusColor.value = color
}

function clearStatusSoon() {
  setTimeout(() => setStatus(''), 5000)
}
</script>

<template>
  <form id="contact-form" :action="ACTION_URL" method="POST" @submit.prevent="handleSubmit" class="space-y-6 max-w-lg">
    <input type="hidden" name="access_key" :value="ACCESS_KEY">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label for="name" class="block text-sm font-medium text-muted mb-2">Nom</label>
        <input type="text" id="name" v-model="name" class="w-full bg-(--card) border border-(--border) rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition" required aria-label="Votre nom">
      </div>
      <div>
        <label for="contact-info" class="block text-sm font-medium text-muted mb-2">Email ou Téléphone</label>
        <input type="text" id="contact-info" v-model="contactInfo" class="w-full bg-(--card) border border-(--border) rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition" required aria-label="Votre email ou numéro de téléphone">
      </div>
    </div>
    <div>
      <label for="message" class="block text-sm font-medium text-muted mb-2">Message</label>
      <textarea id="message" v-model="message" rows="4" class="w-full bg-(--card) border border-(--border) rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 transition" required minlength="20" aria-label="Votre message"></textarea>
    </div>
    <div class="flex items-center">
      <input type="checkbox" id="privacy-consent" v-model="consent" class="h-4 w-4 text-accent bg-(--card) border border-(--border) rounded focus:ring-accent/40" required>
      <label for="privacy-consent" class="ml-2 block text-sm text-muted">J'accepte la <a href="#" id="form-privacy-link" @click.prevent="emit('openPrivacy')" class="text-accent hover:underline">politique de confidentialité</a>.</label>
    </div>
    <div>
      <button type="submit" class="bg-accent-bright text-[#161009] font-bold py-2 px-4 rounded-md hover:bg-accent-bright/90 transition">Envoyer le message</button>
    </div>
    <div class="text-sm" role="status" aria-live="polite"
         :class="{ 'text-red-500': statusColor === 'error', 'text-green-500': statusColor === 'success' }">{{ status }}</div>
  </form>
</template>
