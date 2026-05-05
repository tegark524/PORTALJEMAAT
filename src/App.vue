<template>
  <div
    class="min-h-screen bg-[#FDFCFB] text-[#0c0a09] font-sans selection:bg-[#c8b8e0] selection:text-[#0c0a09]"
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

    <!-- Sembunyikan Navbar publik saat berada di halaman login atau admin -->
    <Navbar v-if="!route.path.startsWith('/admin') && route.name !== 'login'" />

    <router-view />
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

onMounted(() => {
  store.initializeHomeData()
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Background polling setiap 10 menit (10 * 60 * 1000 ms)
  pollInterval = setInterval(() => {
    store.silentRefresh()
  }, 600000)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearInterval(pollInterval)
})
</script>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}
</style>
