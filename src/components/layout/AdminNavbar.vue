<template>
  <nav
    class="h-16 flex items-center justify-between px-6 md:px-12 bg-[#800000] text-white sticky top-0 z-50 shadow-md"
  >
    <!-- Kiri: Brand Logo / Nama -->
    <router-link
      to="/admin"
      class="font-serif text-[20px] tracking-tight font-bold flex items-center gap-3"
    >
      <img
        src="@/assets/logo.png"
        alt="Logo GKJW"
        class="h-8 w-auto object-contain brightness-0 invert"
      />
      Portal Majelis
    </router-link>

    <!-- Tengah: Navigasi Admin (Nested Routes) -->
    <div class="hidden md:flex items-center gap-8">
      <router-link
        to="/admin"
        exact-active-class="text-[#f4c5a8] font-bold"
        class="text-[15px] font-sans font-medium hover:text-[#f4c5a8] transition-colors"
        >Overview</router-link
      >
      <router-link
        to="/admin/warta"
        active-class="text-[#f4c5a8] font-bold"
        class="text-[15px] font-sans font-medium hover:text-[#f4c5a8] transition-colors"
        >Warta</router-link
      >
      <router-link
        to="/admin/renungan"
        active-class="text-[#f4c5a8] font-bold"
        class="text-[15px] font-sans font-medium hover:text-[#f4c5a8] transition-colors"
        >Renungan</router-link
      >
      <router-link
        to="/admin/jadwal"
        active-class="text-[#f4c5a8] font-bold"
        class="text-[15px] font-sans font-medium hover:text-[#f4c5a8] transition-colors"
        >Jadwal</router-link
      >
    </div>

    <!-- Kanan: User Info & Logout -->
    <div class="flex items-center gap-4">
      <span class="text-sm hidden sm:inline opacity-90 font-medium"
        >Halo, {{ store.user?.name?.split(' ')[0] || 'Admin' }}</span
      >
      <button
        @click="handleLogout"
        class="bg-white text-[#800000] px-4 py-1.5 rounded-full text-[14px] font-sans font-bold hover:bg-[#f5f5f5] transition-colors"
      >
        Keluar
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const router = useRouter()

const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>
