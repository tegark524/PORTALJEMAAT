<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 bg-[#ffffff]/80 backdrop-blur-md border-b border-[#e7e5e4] shadow-sm transition-all duration-300"
  >
    <div class="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link :to="{ path: '/' }" class="flex items-center gap-3">
        <img src="@/assets/logo.png" alt="GKJW Logo" class="h-8 w-auto" />
        <span class="font-serif text-[18px] md:text-[20px] font-bold text-[#800000]">
          GKJW Sukolilo
        </span>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <template v-for="link in navLinks" :key="link.name">
          <!-- Dropdown Menu untuk "Tentang Kami" -->
          <div v-if="link.dropdown" class="relative group py-4">
            <router-link
              :to="getToLocation(link)"
              class="text-[14px] transition-colors hover:text-[#800000] flex items-center gap-1"
              :class="isActive(link) ? 'text-[#800000] font-bold' : 'text-[#4e4e4e] font-medium'"
            >
              {{ link.name }}
              <svg
                class="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </router-link>
            <!-- Dropdown Container -->
            <div
              class="absolute top-12 left-0 w-56 bg-white border border-[#e7e5e4] rounded-[16px] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2 z-50"
            >
              <router-link
                v-for="sub in link.dropdown"
                :key="sub.name"
                :to="getToLocation(sub)"
                class="px-5 py-2.5 text-[14px] text-[#4e4e4e] font-medium hover:bg-[#f0efed] hover:text-[#800000] transition-colors"
              >
                {{ sub.name }}
              </router-link>
            </div>
          </div>
          <!-- Standard Menu -->
          <router-link
            v-else
            :to="getToLocation(link)"
            class="text-[14px] transition-colors hover:text-[#800000]"
            :class="isActive(link) ? 'text-[#800000] font-bold' : 'text-[#4e4e4e] font-medium'"
          >
            {{ link.name }}
          </router-link>
        </template>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden text-[#0c0a09] hover:text-[#800000] transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!isMobileMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation Dropdown -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-16 left-0 w-full bg-[#ffffff] border-b border-[#e7e5e4] shadow-lg flex flex-col px-6 py-4 gap-4"
      >
        <template v-for="link in navLinks" :key="link.name">
          <router-link
            :to="getToLocation(link)"
            @click="!link.dropdown && (isMobileMenuOpen = false)"
            class="text-[15px] transition-colors hover:text-[#800000]"
            :class="isActive(link) ? 'text-[#800000] font-bold' : 'text-[#4e4e4e] font-medium'"
          >
            {{ link.name }}
          </router-link>

          <!-- Render Sub-links for Mobile directly underneath -->
          <template v-if="link.dropdown">
            <router-link
              v-for="sub in link.dropdown"
              :key="sub.name"
              :to="getToLocation(sub)"
              @click="isMobileMenuOpen = false"
              class="pl-4 text-[14px] text-[#777169] transition-colors hover:text-[#800000] border-l-2 border-[#e7e5e4] ml-2"
            >
              {{ sub.name }}
            </router-link>
          </template>
        </template>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const store = useChurchStore()

onMounted(() => {
  store.fetchVotingConfig()
})

// Struktur navigasi modular (Kunci penyelesaian Link Stacking)
const navLinks = computed(() => {
  const links = [
    { name: 'Beranda', path: '/', hash: '#beranda' },
    { name: 'Renungan', path: '/', hash: '#renungan' },
    { name: 'Jadwal', path: '/', hash: '#jadwal' },
    { name: 'Warta', path: '/', hash: '#warta-list' },
    {
      name: 'Tentang Kami',
      path: '/tentang',
      hash: '',
      dropdown: [
        { name: 'Sejarah Gereja', path: '/tentang', hash: '#sejarah' },
        { name: 'Jadwal Pelayanan', path: '/tentang', hash: '#jadwal-pelayanan' },
        { name: 'Struktur Organisasi', path: '/tentang', hash: '#organisasi' },
        { name: 'Donasi & Persembahan', path: '/tentang', hash: '#donasi' },
        { name: 'Hubungi Kami', path: '/tentang', hash: '#kontak' },
      ],
    },
    { name: 'Layanan Doa', path: '/doa', hash: '' },
  ]

  const activeConfig = store.votingConfig?.is_active
  const isVotingActive =
    activeConfig === true ||
    activeConfig === 'TRUE' ||
    String(activeConfig).toLowerCase() === 'true'

  if (isVotingActive) {
    links.push({ name: 'Voting Majelis', path: '/voting', hash: '' })
  }

  return links
})

// Resolusi path absolute untuk mem-bypass URL stacking (seperti /doa#warta)
const getToLocation = (link) => {
  // Mengirim Object Location ke Vue Router:
  // Memastikan kita selalu merujuk pada absolute path (link.path) yang akan dieksekusi
  // oleh router-link ke format absolut misalnya: `/#warta-list`
  return { path: link.path, hash: link.hash }
}

// Evaluasi State Aktif berdasarkan URL dan Hash Saat Ini
const isActive = (link) => {
  // Highlight absolut untuk halaman di luar root (Beranda), misalnya /doa atau /tentang
  if (link.path !== '/') {
    return route.path === link.path
  }

  // Highlight seksi pada halaman Utama (Home)
  if (route.path === '/') {
    if (!route.hash && link.hash === '#beranda') return true
    return route.hash === link.hash
  }

  return false
}
</script>
