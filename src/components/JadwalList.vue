<template>
  <div>
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-[#ffffff] rounded-[16px] p-6 border border-[#e7e5e4] h-[200px] flex flex-col animate-pulse"
      >
        <div class="flex justify-between mb-6">
          <div class="h-6 w-20 bg-[#e7e5e4] rounded-full"></div>
          <div class="h-6 w-16 bg-[#e7e5e4] rounded-full"></div>
        </div>
        <div class="h-8 w-3/4 bg-[#e7e5e4] rounded mb-4"></div>
        <div class="mt-auto space-y-3">
          <div class="h-4 w-full bg-[#e7e5e4] rounded"></div>
          <div class="h-4 w-2/3 bg-[#e7e5e4] rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="jadwals.length === 0"
      class="py-16 text-center text-[#777169] font-sans text-[16px] bg-[#ffffff] rounded-[16px] border border-[#e7e5e4]"
    >
      Belum ada jadwal ibadah mendatang.
    </div>

    <!-- Content Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in jadwals"
          :key="index"
          @click="$emit('read-more', item)"
          class="relative bg-[#ffffff] border border-[#e7e5e4] rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-all flex-col group min-h-[220px] cursor-pointer"
          :class="index >= 1 && !showAll ? 'hidden md:flex' : 'flex'"
        >
          <!-- Background Image Handling -->
          <div v-if="item.gambar" class="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <img
              :src="item.gambar"
              alt="Poster Jadwal"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <!-- Overlay putih semi-transparan agar teks tetap terbaca jelas -->
            <div
              class="absolute inset-0 bg-white/90 group-hover:bg-white/80 transition-colors duration-500"
            ></div>
          </div>

          <!-- Card Content -->
          <div class="p-6 flex flex-col flex-1 relative z-10">
            <h3 class="font-serif text-[22px] font-bold text-[#0c0a09] leading-tight mb-3">
              {{ item.nama_ibadah || item.kategori }}
            </h3>

            <div class="space-y-2 mb-4 text-[14px] text-[#292524] font-semibold flex-1">
              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-[#800000]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>{{ formatDateDisplay(item.tanggal || item.date) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-[#800000]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{{ formatWaktu(item.waktu) }} WIB</span>
              </div>
              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-[#800000]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span>{{ item.lokasi }}</span>
              </div>
            </div>

            <div class="mt-auto flex items-center justify-between gap-2 pt-2">
              <span
                class="text-[#800000] text-[13px] font-bold group-hover:underline flex items-center gap-1"
              >
                Selengkapnya &rarr;
              </span>
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                @click.stop
                class="inline-flex items-center gap-1.5 bg-[#800000] hover:bg-[#500000] text-white px-4 py-2 rounded-full text-[13px] font-bold transition-colors shadow-sm"
              >
                Buka Tautan
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Tombol Selengkapnya (Hanya Mobile) -->
      <div v-if="jadwals.length > 1" class="mt-8 flex justify-center md:hidden">
        <button
          @click="showAll = !showAll"
          class="bg-transparent border border-[#d6d3d1] text-[#0c0a09] px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#f0efed] transition-colors"
        >
          {{ showAll ? 'Tutup Daftar' : 'Lihat Selengkapnya' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ jadwals: Array, isLoading: Boolean })

defineEmits(['read-more'])

const showAll = ref(false)

const formatWaktu = (timeStr) => {
  if (!timeStr) return ''
  if (typeof timeStr === 'string' && timeStr.includes('1899')) {
    const d = new Date(timeStr)
    if (!isNaN(d.getTime())) {
      d.setMinutes(d.getMinutes() + 7)
      d.setSeconds(d.getSeconds() + 12)
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }
  }
  if (typeof timeStr === 'string' && /^\d{2}:\d{2}/.test(timeStr)) {
    return timeStr.substring(0, 5)
  }
  return timeStr
}

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch (e) {
    return dateStr
  }
}
</script>
