<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminApi, ApiError } from '@/api/admin'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import { adminButton, adminInput, adminLabel } from '@/components/admin/adminStyles'

const loading = ref(true)
const authenticated = ref(false)
const username = ref('')
const csrf = ref('')
const error = ref('')
const loginUsername = ref('admin')
const loginPassword = ref('')
const busy = ref(false)

onMounted(async () => {
  try {
    const me = await adminApi.me()
    authenticated.value = me.authenticated
    username.value = me.username ?? ''
    csrf.value = me.csrf ?? ''
  } catch (failure) {
    error.value = messageOf(failure)
  } finally {
    loading.value = false
  }
})

async function login() {
  error.value = ''
  busy.value = true

  try {
    const result = await adminApi.login(loginUsername.value, loginPassword.value)
    authenticated.value = true
    username.value = result.username
    csrf.value = result.csrf
    loginPassword.value = ''
  } catch (failure) {
    error.value = messageOf(failure)
  } finally {
    busy.value = false
  }
}

async function logout() {
  try {
    if (csrf.value) {
      await adminApi.logout(csrf.value)
    }
  } catch {
    // La session est peut-être déjà expirée.
  } finally {
    authenticated.value = false
    username.value = ''
    csrf.value = ''
    error.value = ''
  }
}

function messageOf(failure: unknown): string {
  return failure instanceof ApiError ? failure.message : 'Une erreur est survenue.'
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <p v-if="loading" class="font-mono text-sm text-muted" role="status">Vérification de la session…</p>

    <section v-else-if="!authenticated" class="neo-card max-w-md mx-auto p-8">
      <h1 class="font-heading text-2xl font-bold mb-2">Administration</h1>
      <p class="mb-6 text-sm text-muted">Connexion réservée au propriétaire du site.</p>

      <form class="space-y-4" @submit.prevent="login">
        <div>
          <label for="admin-username" :class="adminLabel">Identifiant</label>
          <input id="admin-username" v-model="loginUsername" :class="adminInput" autocomplete="username" required>
        </div>
        <div>
          <label for="admin-password" :class="adminLabel">Mot de passe</label>
          <input id="admin-password" v-model="loginPassword" type="password" :class="adminInput" autocomplete="current-password" required>
        </div>
        <p v-if="error" class="text-sm text-red-400" role="alert">{{ error }}</p>
        <button type="submit" :class="adminButton" :disabled="busy">
          {{ busy ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </section>

    <AdminDashboard
      v-else
      :csrf="csrf"
      :username="username"
      @logout="logout"
    />
  </div>
</template>
