<template>
  <div class="flex h-screen bg-[#f5f5f5] font-sans text-[#0c0a09] overflow-hidden">
    <!-- Sidebar (Desktop) -->
    <aside class="w-64 bg-[#0c0a09] text-[#ffffff] flex-col hidden md:flex shrink-0 shadow-xl z-20">
      <div class="h-16 flex items-center px-6 border-b border-[#1c1917] shrink-0">
        <h1 class="font-serif text-[24px] font-light flex items-center gap-3">
          <img src="@/assets/logo.png" alt="Logo" class="h-8 w-auto brightness-0 invert" />
          Portal Majelis
        </h1>
      </div>
      <nav class="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        <router-link
          to="/admin"
          exact-active-class="bg-[#1c1917] text-[#ffffff]"
          class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
          >Overview</router-link
        >
        <router-link
          to="/admin/warta"
          active-class="bg-[#1c1917] text-[#ffffff]"
          class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
          >Kelola Warta</router-link
        >
        <router-link
          to="/admin/renungan"
          active-class="bg-[#1c1917] text-[#ffffff]"
          class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
          >Kelola Renungan</router-link
        >
        <router-link
          to="/admin/jadwal"
          active-class="bg-[#1c1917] text-[#ffffff]"
          class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
          >Kelola Jadwal</router-link
        >
        <router-link
          to="/admin/doa"
          active-class="bg-[#1c1917] text-[#ffffff]"
          class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
          >Kelola Doa</router-link
        >
      </nav>
      <div class="p-4 border-t border-[#1c1917]">
        <button
          @click="handleLogout"
          class="w-full bg-[#1c1917] text-[#ffffff] px-4 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#ffffff] hover:text-[#0c0a09] transition-colors"
        >
          Keluar
        </button>
      </div>
    </aside>

    <!-- Sidebar (Mobile Overlay) -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 md:hidden">
        <div
          class="absolute inset-0 bg-[#0c0a09]/60 backdrop-blur-sm"
          @click="isMobileMenuOpen = false"
        ></div>
        <aside
          class="absolute top-0 left-0 w-64 h-full bg-[#0c0a09] text-[#ffffff] flex flex-col shadow-xl"
        >
          <div
            class="h-16 flex items-center px-6 border-b border-[#1c1917] shrink-0 justify-between"
          >
            <h1 class="font-serif text-[18px] font-light flex items-center gap-3">
              <img src="@/assets/logo.png" alt="Logo" class="h-6 w-auto brightness-0 invert" />
              Portal Majelis
            </h1>
            <button
              @click="isMobileMenuOpen = false"
              class="text-[#a8a29e] hover:text-[#ffffff] transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <nav class="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
            <router-link
              @click="isMobileMenuOpen = false"
              to="/admin"
              exact-active-class="bg-[#1c1917] text-[#ffffff]"
              class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
              >Overview</router-link
            >
            <router-link
              @click="isMobileMenuOpen = false"
              to="/admin/warta"
              active-class="bg-[#1c1917] text-[#ffffff]"
              class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
              >Kelola Warta</router-link
            >
            <router-link
              @click="isMobileMenuOpen = false"
              to="/admin/renungan"
              active-class="bg-[#1c1917] text-[#ffffff]"
              class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
              >Kelola Renungan</router-link
            >
            <router-link
              @click="isMobileMenuOpen = false"
              to="/admin/jadwal"
              active-class="bg-[#1c1917] text-[#ffffff]"
              class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
              >Kelola Jadwal</router-link
            >
            <router-link
              @click="isMobileMenuOpen = false"
              to="/admin/doa"
              active-class="bg-[#1c1917] text-[#ffffff]"
              class="px-4 py-2.5 rounded-full text-[15px] font-medium text-[#a8a29e] hover:text-[#ffffff] hover:bg-[#1c1917] transition-colors"
              >Kelola Doa</router-link
            >
          </nav>
          <div class="p-4 border-t border-[#1c1917]">
            <button
              @click="handleLogout"
              class="w-full bg-[#1c1917] text-[#ffffff] px-4 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#ffffff] hover:text-[#0c0a09] transition-colors"
            >
              Keluar
            </button>
          </div>
        </aside>
      </div>
    </transition>

    <!-- Main Area -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <!-- Header -->
      <header
        class="h-16 bg-[#f5f5f5] border-b border-[#e7e5e4] flex items-center justify-between px-6 shrink-0 shadow-sm z-10"
      >
        <div class="flex items-center gap-4">
          <button
            @click="isMobileMenuOpen = true"
            class="md:hidden text-[#0c0a09] hover:text-[#800000] transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <span class="md:hidden font-serif font-light text-[20px] text-[#0c0a09]"
            >Portal Majelis</span
          >
        </div>
        <div class="flex items-center gap-4">
          <span class="text-[15px] font-medium text-[#4e4e4e] hidden sm:inline"
            >Halo, {{ store.user?.name || 'Admin' }}</span
          >
          <a
            href="/"
            target="_blank"
            class="bg-transparent border border-[#d6d3d1] text-[#0c0a09] px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#ffffff] transition-colors flex items-center gap-1.5"
          >
            Lihat Web
            <svg
              class="w-3.5 h-3.5 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              ></path>
            </svg>
          </a>
        </div>
      </header>

      <!-- Dynamic Content -->
      <div class="flex-1 overflow-y-auto p-6 md:p-10">
        <div v-if="route.name === 'admin'">
          <div class="mb-10">
            <h1 class="font-serif text-[36px] font-light tracking-[-0.36px] text-[#0c0a09]">
              Overview
            </h1>
            <p class="text-[#4e4e4e] text-[16px] mt-2">
              Pantau ringkasan data jemaat dan informasi pelayanan di sini.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div
              class="bg-[#ffffff] rounded-[16px] p-6 border border-[#e7e5e4] shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-between"
            >
              <h3 class="text-[12px] font-semibold text-[#777169] mb-2 uppercase tracking-[0.96px]">
                Pengajuan Doa
              </h3>
              <p class="font-serif text-[36px] font-light tracking-[-0.36px] text-[#0c0a09]">
                {{ store.doa.length }}
              </p>
            </div>
            <div
              class="bg-[#ffffff] rounded-[16px] p-6 border border-[#e7e5e4] shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-between"
            >
              <h3 class="text-[12px] font-semibold text-[#777169] mb-2 uppercase tracking-[0.96px]">
                Ibadah Terjadwal
              </h3>
              <p class="font-serif text-[36px] font-light tracking-[-0.36px] text-[#0c0a09]">
                {{ store.jadwal.length }}
              </p>
            </div>
            <div
              class="bg-[#ffffff] rounded-[16px] p-6 border border-[#e7e5e4] shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-between"
            >
              <h3 class="text-[12px] font-semibold text-[#777169] mb-2 uppercase tracking-[0.96px]">
                Warta On Air
              </h3>
              <p class="font-serif text-[36px] font-light tracking-[-0.36px] text-[#0c0a09]">
                {{ store.warta.length }}
              </p>
            </div>
            <div
              class="bg-[#ffffff] rounded-[16px] p-6 border border-[#e7e5e4] shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col justify-between"
            >
              <h3 class="text-[12px] font-semibold text-[#777169] mb-2 uppercase tracking-[0.96px]">
                Status Renungan
              </h3>
              <div class="flex items-center gap-3 mt-2">
                <span
                  class="w-2.5 h-2.5 rounded-full shrink-0"
                  :class="{
                    'bg-[#dc2626]': renunganStatus.status === 'danger',
                    'bg-[#f59e0b]': renunganStatus.status === 'warning',
                    'bg-[#16a34a]': renunganStatus.status === 'success',
                  }"
                ></span>
                <p
                  class="text-[14px] font-medium leading-tight"
                  :class="{
                    'text-[#dc2626]': renunganStatus.status === 'danger',
                    'text-[#0c0a09]': renunganStatus.status !== 'danger',
                  }"
                >
                  {{ renunganStatus.text }}
                </p>
              </div>
            </div>
          </div>

          <!-- Monitoring Renungan Chart (7 Hari) -->
          <div
            class="bg-[#ffffff] rounded-[16px] p-6 md:p-8 border border-[#e7e5e4] shadow-[0_4px_16px_rgba(0,0,0,0.04)] mt-6"
          >
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
            >
              <div>
                <h3 class="font-serif text-[22px] md:text-[24px] font-bold text-[#0c0a09]">
                  Monitoring Renungan
                </h3>
                <p class="text-[#777169] text-[13px] md:text-[14px] mt-1">
                  Pantau ketersediaan renungan 3 hari ke belakang hingga 3 hari ke depan.
                </p>
              </div>
              <div
                class="flex items-center gap-4 text-[12px] md:text-[13px] font-medium text-[#4e4e4e] bg-[#f5f5f5] px-4 py-2 rounded-full border border-[#e7e5e4]"
              >
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#16a34a] shadow-sm"></span> Tersedia
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-full bg-[#fee2e2] shadow-sm border border-[#fca5a5]"
                  ></span>
                  Kosong
                </div>
              </div>
            </div>

            <div class="relative mt-8 pt-4">
              <!-- Highlight Hari Ini Background -->
              <div
                class="absolute left-[50%] -translate-x-1/2 top-0 h-full w-[14%] bg-[#faf7f2] rounded-xl -z-10 border border-[#e7e5e4]/50"
              ></div>

              <!-- Bars -->
              <div
                class="flex items-end justify-between h-40 gap-2 md:gap-4 relative z-10 px-2 md:px-4 border-b border-[#e7e5e4] pb-4"
              >
                <div
                  v-for="day in weeklyRenunganChart"
                  :key="day.id"
                  class="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
                >
                  <span
                    class="text-[10px] md:text-[12px] font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    :class="day.hasRenungan ? 'text-[#16a34a]' : 'text-[#dc2626]'"
                  >
                    {{ day.hasRenungan ? 'Tersedia' : 'Kosong' }}
                  </span>
                  <div
                    class="w-full max-w-[32px] md:max-w-[48px] rounded-t-xl transition-all duration-1000 ease-out flex-shrink-0"
                    :class="
                      day.hasRenungan
                        ? 'h-[120px] bg-[#16a34a] shadow-[0_4px_12px_rgba(22,163,74,0.25)]'
                        : 'h-[24px] bg-[#fee2e2] border border-[#fca5a5]'
                    "
                  ></div>
                </div>
              </div>

              <!-- Labels -->
              <div
                class="flex items-center justify-between gap-2 md:gap-4 mt-4 px-2 md:px-4 relative z-10"
              >
                <div
                  v-for="day in weeklyRenunganChart"
                  :key="'label-' + day.id"
                  class="flex flex-col items-center flex-1"
                >
                  <span
                    class="text-[11px] md:text-[14px] whitespace-nowrap text-center transition-colors"
                    :class="
                      day.isToday
                        ? 'font-bold text-[#800000] bg-[#800000]/10 px-2.5 py-1 rounded-md'
                        : 'font-medium text-[#4e4e4e]'
                    "
                  >
                    {{ day.label }}
                  </span>
                  <span class="text-[9px] md:text-[11px] text-[#a8a29e] mt-1">{{
                    day.dateLabel
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const route = useRoute()
const router = useRouter()
const store = useChurchStore()
const isMobileMenuOpen = ref(false)

const renunganStatus = computed(() => {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const hasToday = store.renungan.some((r) => {
    const dStr = r.tanggal_tayang || r.date || r.tanggal
    if (!dStr) return false
    const d = new Date(dStr)
    return !isNaN(d.getTime()) && isSameDate(d, today)
  })

  const hasTomorrow = store.renungan.some((r) => {
    const dStr = r.tanggal_tayang || r.date || r.tanggal
    if (!dStr) return false
    const d = new Date(dStr)
    return !isNaN(d.getTime()) && isSameDate(d, tomorrow)
  })

  if (!hasToday) {
    return { status: 'danger', text: 'Hari ini belum ada renungan' }
  } else if (!hasTomorrow) {
    return { status: 'warning', text: 'Hari ini sudah ada, besok belum ada' }
  } else {
    return { status: 'success', text: 'Renungan hari ini & besok tersedia' }
  }
})

const weeklyRenunganChart = computed(() => {
  const chartData = []
  const today = new Date()

  // Mengisi data 3 hari ke belakang, Hari Ini, dan 3 hari ke depan (Total 7 hari)
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)

    const isSameDate = (date1, date2) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      )
    }

    const exists = store.renungan.some((r) => {
      const dStr = r.tanggal_tayang || r.date || r.tanggal
      if (!dStr) return false
      const rDate = new Date(dStr)
      return !isNaN(rDate.getTime()) && isSameDate(rDate, d)
    })

    const isToday = i === 0
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

    chartData.push({
      id: i,
      label: isToday ? 'Hari Ini' : dayNames[d.getDay()],
      dateLabel: `${d.getDate()}/${d.getMonth() + 1}`,
      isToday,
      hasRenungan: exists,
    })
  }
  return chartData
})

const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>
