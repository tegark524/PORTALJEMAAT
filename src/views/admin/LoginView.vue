<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
      <!-- Branding -->
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-light text-gray-800">GKJW Sukolilo</h1>
        <h2 class="text-xl font-semibold text-[#800000]">Portal Admin Majelis</h2>
      </div>

      <!-- Login Prompt -->
      <div class="mb-8">
        <p class="text-gray-600">
          Silakan login menggunakan akun Google Majelis yang telah terdaftar.
        </p>
      </div>

      <!-- Google Login Button -->
      <div class="flex justify-center mb-6">
        <GoogleLogin :callback="handleGoogleCallback" prompt />
      </div>

      <!-- Error Message -->
      <div v-if="errorMsg" class="text-red-600 text-sm font-medium p-3 bg-red-100 rounded-lg">
        <p>{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const router = useRouter()
const store = useChurchStore()
const errorMsg = ref('')

const handleGoogleCallback = async (response) => {
  errorMsg.value = '' // Clear previous errors
  try {
    const id_token = response.credential
    if (!id_token) {
      throw new Error('Login gagal, token tidak diterima.')
    }

    await store.login(id_token)

    router.push('/admin')
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>
