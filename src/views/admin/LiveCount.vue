<template>
  <div class="space-y-8">
    <!-- Print Header -->
    <div class="hidden print:block text-center border-b-2 border-[#0c0a09] pb-6 mb-6">
      <h1 class="text-2xl font-serif font-bold text-[#0c0a09] uppercase">
        Rekapitulasi Hasil Pemilihan
      </h1>
      <p class="text-lg font-medium text-[#4e4e4e]">
        {{ store.votingConfig?.judul_pemilihan || 'GKJW Jemaat Sukolilo' }}
      </p>
      <p class="text-sm text-[#777169] mt-2">
        Dicetak pada:
        {{ new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
      <div>
        <h1 class="text-2xl font-serif font-bold text-[#0c0a09]">Live Count Pemilihan</h1>
        <p class="text-sm text-[#777169] mt-1">
          Tampilan real-time bilik suara. Data diperbarui otomatis setiap 10 detik.
          <span
            v-if="isRefreshing"
            class="inline-flex ml-2 items-center gap-1 text-[#800000] text-xs font-bold animate-pulse"
          >
            <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Memperbarui...
          </span>
        </p>
      </div>
      <div class="flex gap-3">
        <button
          @click="refreshData"
          class="bg-white border border-[#d6d3d1] text-[#0c0a09] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#f5f5f5] transition-colors shadow-sm flex justify-center items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          <span class="hidden sm:inline">Muat Ulang</span>
        </button>
        <button
          @click="printRekap"
          class="bg-[#800000] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#500000] transition-colors shadow-sm flex justify-center items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            ></path>
          </svg>
          Cetak PDF
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:block">
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-[#e7e5e4] flex items-center justify-between print:border-[#d6d3d1] print:shadow-none print:mb-6"
      >
        <div>
          <p class="text-[13px] font-bold text-[#777169] uppercase tracking-wider mb-1">
            Total Suara Masuk
          </p>
          <p class="text-4xl font-serif font-bold text-[#800000]">{{ store.suara.length }}</p>
        </div>
        <div
          class="w-14 h-14 bg-[#faf7f2] rounded-full flex items-center justify-center text-[#800000]"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Chart Bar -->
    <div
      class="bg-white p-8 rounded-xl shadow-sm border border-[#e7e5e4] print:border-none print:shadow-none print:p-0"
    >
      <h2 class="text-lg font-bold text-[#0c0a09] mb-8">Perolehan Suara Kandidat</h2>

      <div class="space-y-6">
        <div v-for="(kandidat, index) in tally" :key="kandidat.id" class="relative group">
          <div class="flex justify-between items-end mb-2">
            <div class="flex items-center gap-3">
              <span class="text-[#a8a29e] font-serif italic text-lg w-6">{{ index + 1 }}.</span>
              <span class="font-bold text-[#292524] text-[15px]">{{ kandidat.nama }}</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-[#800000] text-[16px]">{{ kandidat.count }}</span>
              <span class="text-[#777169] text-xs ml-1 font-medium"
                >({{ kandidat.percentage.toFixed(1) }}%)</span
              >
            </div>
          </div>

          <!-- Progress Bar -->
          <div
            class="w-full bg-[#f0efed] rounded-full h-4 overflow-hidden relative print:border print:border-[#d6d3d1]"
            style="-webkit-print-color-adjust: exact; print-color-adjust: exact"
          >
            <div
              class="bg-[#800000] h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              :style="{ width: kandidat.percentage + '%' }"
            >
              <div
                class="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_25%,rgba(255,255,255,0.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.15)_75%,rgba(255,255,255,0.15)_100%)] bg-[length:20px_20px] animate-[slide_2s_linear_infinite]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
let intervalId = null
const isRefreshing = ref(false)

const printRekap = () => {
  window.print()
}

const refreshData = async () => {
  isRefreshing.value = true
  await Promise.all([store.fetchKandidat(), store.fetchSuara()])
  isRefreshing.value = false
}

onMounted(() => {
  refreshData()
  intervalId = setInterval(refreshData, 10000) // Auto refresh 10 detik
})

onUnmounted(() => clearInterval(intervalId))

const tally = computed(() => {
  const total = store.suara.length || 1 // Mencegah Divide by Zero
  return store.kandidat
    .map((k) => {
      // Sesuaikan dengan nama kolom di GAS (id_kandidat) dan jadikan String agar cocok
      const count = store.suara.filter(
        (s) => String(s.id_kandidat || s.candidate_id) === String(k.id),
      ).length
      return { ...k, count, percentage: (count / total) * 100 }
    })
    .sort((a, b) => b.count - a.count)
})
</script>

<style>
@keyframes slide {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 20px 20px;
  }
}
</style>
