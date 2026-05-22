<template>
  <div
    class="min-h-screen bg-[#FDFCFB] text-[#0c0a09] font-sans selection:bg-[#c8b8e0] selection:text-[#0c0a09] pb-8 transition-all duration-300"
    :style="{ paddingTop: !store.isOnline ? '40px' : '0px' }"
  >
    <!-- Global Fullscreen Loading -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!store.isLoaded"
        class="fixed inset-0 z-[100] bg-[#FDFCFB] flex flex-col items-center justify-center"
      >
        <img src="@/assets/logo.png" alt="GKJW Logo" class="h-24 w-auto animate-pulse mb-8" />
        <div class="flex gap-2">
          <div
            class="w-2 h-2 rounded-full bg-[#800000] animate-bounce"
            style="animation-delay: -0.3s"
          ></div>
          <div
            class="w-2 h-2 rounded-full bg-[#800000] animate-bounce"
            style="animation-delay: -0.15s"
          ></div>
          <div class="w-2 h-2 rounded-full bg-[#800000] animate-bounce"></div>
        </div>
        <p class="mt-6 text-[#777169] font-serif tracking-[0.15em] text-sm uppercase">
          Memuat Data Jemaat
        </p>
      </div>
    </transition>

    <!-- Sembunyikan Navbar publik saat berada di halaman login, admin, atau voting -->
    <Navbar v-if="!route.path.startsWith('/admin') && !route.path.startsWith('/voting') && route.name !== 'login'" />

    <router-view />


    <!-- Offline Indicator Banner (Sticky Top - Pushes content down) -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div
        v-if="!store.isOnline"
        class="fixed top-0 left-0 w-full h-10 z-[101] bg-[#fef08a] border-b border-[#eab308] px-6 flex items-center justify-center gap-2 text-center text-[#854d0e] font-sans text-[13px] font-semibold shadow-sm transition-all duration-300"
      >
        <svg class="w-4 h-4 animate-pulse flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Koneksi internet terputus. Menampilkan data tersimpan (offline).</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const route = useRoute()
let pollInterval

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    store.silentRefresh() // Refresh data saat user kembali ke tab
  }
}

const updateOnlineStatus = () => {
  store.isOnline = window.navigator.onLine
}


onMounted(() => {
  store.initializeHomeData()
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Listeners untuk status internet jemaat
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  // Background polling setiap 10 menit (10 * 60 * 1000 ms)
  pollInterval = setInterval(() => {
    store.silentRefresh()
  }, 600000)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  clearInterval(pollInterval)
})
</script>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}
</style>
