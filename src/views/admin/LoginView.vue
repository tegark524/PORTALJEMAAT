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
      <div class="flex justify-center items-center min-h-[44px] mb-6">
        <div v-if="isLoading" class="flex flex-row gap-2 justify-center items-center">
          <div class="w-2.5 h-2.5 rounded-full bg-[#800000] animate-bounce"></div>
          <div
            class="w-2.5 h-2.5 rounded-full bg-[#800000] animate-bounce [animation-delay:-.3s]"
          ></div>
          <div
            class="w-2.5 h-2.5 rounded-full bg-[#800000] animate-bounce [animation-delay:-.5s]"
          ></div>
          <span class="ml-2 text-[#4e4e4e] font-medium text-[14px]">Memverifikasi akses...</span>
        </div>
        <div v-show="!isLoading">
          <GoogleLogin :callback="handleGoogleCallback" prompt />
        </div>
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
const isLoading = ref(false)

const handleGoogleCallback = async (response) => {
  errorMsg.value = '' // Clear previous errors
  isLoading.value = true
  try {
    const id_token = response.credential
    if (!id_token) {
      throw new Error('Login gagal, token tidak diterima.')
    }

    await store.login(id_token)

    router.push('/admin')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>
