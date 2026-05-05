<template>
  <div
    class="bg-[#ffffff] rounded-[16px] p-6 border border-[#e7e5e4] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col h-full group"
  >
    <!-- Header Card: Kategori & Waktu -->
    <div class="flex justify-between items-start mb-6 gap-2">
      <span
        class="bg-[#f0efed] text-[#0c0a09] text-[10px] font-bold uppercase tracking-[0.96px] px-3 py-1.5 rounded-full shrink-0"
      >
        {{ jadwal.nama_ibadah || jadwal.kategori || jadwal.category }}
      </span>
      <span
        class="text-[#800000] font-sans font-bold text-[13px] bg-[#800000]/10 px-3 py-1.5 rounded-full text-right"
      >
        {{ formattedWaktu }}
      </span>
    </div>

    <!-- Tanggal (Title) -->
    <h3
      class="font-serif text-[24px] font-bold text-[#0c0a09] mb-4 leading-[1.3] group-hover:text-[#800000] transition-colors"
    >
      {{ formattedDate }}
    </h3>

    <!-- Detail Informasi -->
    <div class="text-[#4e4e4e] text-[14px] font-sans space-y-3 mt-auto">
      <div class="flex items-start gap-3">
        <svg
          class="w-5 h-5 opacity-50 shrink-0"
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
        <span>{{ jadwal.lokasi || jadwal.location }}</span>
      </div>
      <div v-if="jadwal.keterangan || jadwal.description" class="flex items-start gap-3">
        <svg
          class="w-5 h-5 opacity-50 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span class="line-clamp-2">{{ jadwal.keterangan || jadwal.description }}</span>
      </div>

      <!-- Tautan Opsional -->
      <div v-if="jadwal.link" class="mt-3 border-t border-[#e7e5e4] pt-3">
        <a
          :href="jadwal.link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#800000] hover:text-[#500000] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
          Buka Tautan
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ jadwal: { type: Object, required: true } })

const formattedDate = computed(() => {
  const raw = props.jadwal.tanggal || props.jadwal.date
  if (!raw) return ''
  const d = new Date(raw)
  return isNaN(d.getTime())
    ? raw
    : d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
})

const formattedWaktu = computed(() => {
  const timeStr = props.jadwal.waktu || props.jadwal.time
  if (!timeStr) return ''

  // Cek jika waktu mengalami konversi ISO 1899 dari Google Sheets (Offset Batavia LMT +07:07:12)
  if (typeof timeStr === 'string' && timeStr.includes('1899')) {
    const d = new Date(timeStr)
    if (!isNaN(d.getTime())) {
      d.setMinutes(d.getMinutes() + 7)
      d.setSeconds(d.getSeconds() + 12)
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }
  }

  // Jika sudah berupa format "HH:mm" standar
  if (typeof timeStr === 'string' && /^\d{2}:\d{2}/.test(timeStr)) {
    return timeStr.substring(0, 5)
  }

  return timeStr
})
</script>
