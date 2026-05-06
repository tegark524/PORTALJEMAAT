<template>
  <main
    class="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6 relative overflow-hidden"
  >
    <!-- Atmospheric Gradient Orb sesuai dengan brand guidelines -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(200,184,224,0.15)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none md:w-[700px] md:h-[700px]"
    ></div>

    <div
      class="bg-[#ffffff] rounded-[24px] p-8 md:p-12 border border-[#e7e5e4] shadow-sm w-full max-w-md relative z-10 text-center"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <div
          class="w-16 h-16 bg-[#faf7f2] rounded-full border border-[#e7e5e4] flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            ></path>
          </svg>
        </div>
      </div>

      <h1 class="font-serif text-[32px] font-bold text-[#0c0a09] leading-tight mb-2">
        Bilik Suara Digital
      </h1>
      <p class="text-[15px] text-[#4e4e4e] font-sans mb-8">
        Pemilihan Majelis Jemaat GKJW Sukolilo
      </p>

      <form @submit.prevent="handleLogin" class="text-left space-y-6">
        <div>
          <label class="block text-[12px] font-bold text-[#777169] uppercase tracking-[0.96px] mb-2"
            >ID Jemaat (NIK / NIJ)</label
          >
          <input
            v-model="voterId"
            type="text"
            required
            placeholder="Masukkan ID Anda..."
            class="w-full bg-[#fcfcfc] border border-[#e7e5e4] rounded-lg px-4 py-3 text-[15px] font-medium focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-shadow"
            :disabled="isLoading"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading || !voterId"
          class="w-full bg-[#800000] text-white px-6 py-3.5 rounded-full text-[15px] font-bold hover:bg-[#500000] disabled:opacity-50 transition-colors shadow-md flex justify-center items-center h-12"
        >
          <div
            v-if="isLoading"
            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
          <span v-else>Masuk Bilik Suara</span>
        </button>

        <p
          v-if="errorMsg"
          class="text-[#dc2626] text-[14px] text-center font-medium bg-[#fee2e2] p-3 rounded-lg border border-[#fca5a5]"
        >
          {{ errorMsg }}
        </p>
      </form>

      <div class="mt-8 pt-6 border-t border-[#e7e5e4] text-[13px] text-[#777169]">
        <router-link to="/" class="hover:text-[#800000] hover:underline transition-colors"
          >&larr; Kembali ke Beranda</router-link
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const router = useRouter()
const voterId = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

onMounted(() => {
  store.checkVoterAuth()
  if (store.voterSession) {
    router.push('/voting/dashboard')
  }
})

const handleLogin = async () => {
  if (!voterId.value.trim()) return
  isLoading.value = true
  errorMsg.value = ''
  try {
    await store.verifyVoter(voterId.value)
    router.push('/voting/dashboard')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>
