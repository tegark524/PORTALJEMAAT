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
          :class="showAll ? 'flex' : index === 0 ? 'flex' : index < 3 ? 'hidden md:flex' : 'hidden'"
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
            <div class="flex items-start justify-between gap-2 mb-3">
              <h3 class="font-serif text-[22px] font-bold text-[#0c0a09] leading-tight">
                {{ cleanNamaIbadah(item.nama_ibadah || item.kategori) }}
              </h3>
              <span
                v-if="getJadwalBadge(item.tanggal || item.date)"
                :class="getJadwalBadge(item.tanggal || item.date).color"
                class="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase whitespace-nowrap shadow-sm shrink-0"
              >
                {{ getJadwalBadge(item.tanggal || item.date).text }}
              </span>
            </div>

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

            <div class="mt-auto flex items-center justify-between gap-6 pt-2">
              <span class="selengkapnya-link text-[13px]"> Selengkapnya </span>
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                @click.stop
                class="tautan-button"
                style="--clr: #800000"
              >
                <span>Buka Tautan</span>
                <span class="tautan-button__icon-wrapper">
                  <svg
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="tautan-button__icon-svg"
                    width="10"
                  >
                    <path
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.28-9.224-.048 6.912 2.456.024z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <svg
                    viewBox="0 0 14 15"
                    fill="none"
                    width="10"
                    xmlns="http://www.w3.org/2000/svg"
                    class="tautan-button__icon-svg tautan-button__icon-svg--copy"
                  >
                    <path
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.28-9.224-.048 6.912 2.456.024z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Tombol Selengkapnya -->
      <div
        v-if="jadwals.length > 1"
        class="mt-8 flex justify-center"
        :class="jadwals.length <= 3 ? 'md:hidden' : ''"
      >
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

const cleanNamaIbadah = (name) => {
  if (!name) return ''
  // Membersihkan prefix teks [HARI INI] / [BESOK] jika sebelumnya terbawa dari filter HomeView
  return name.replace(/^\[HARI INI\]\s*-?\s*/i, '').replace(/^\[BESOK\]\s*-?\s*/i, '')
}

const getJadwalBadge = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  d.setHours(0, 0, 0, 0)

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.getTime() === now.getTime()) {
    return { text: 'HARI INI', color: 'bg-[#dc2626] text-[#ffffff]' }
  }
  if (d.getTime() === tomorrow.getTime()) {
    return { text: 'BESOK', color: 'bg-[#f59e0b] text-[#ffffff]' }
  }
  return null
}

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

<style scoped>
.selengkapnya-link {
  color: var(--link-color, #800000);
  line-height: 2;
  position: relative;
  padding-right: 4px;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: none;
  display: inline-block;
  text-decoration: none;
}

.selengkapnya-link:hover,
.group:hover .selengkapnya-link {
  text-decoration: underline;
}

.selengkapnya-link::before {
  content: '';
  width: 6px;
  height: 6px;
  border-top: solid 2px var(--link-color, #800000);
  border-right: solid 2px var(--link-color, #800000);
  border-radius: 1px;
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%) rotate(45deg);
  transition: transform 0.4s;
}

.selengkapnya-link:hover::before,
.group:hover .selengkapnya-link::before {
  transform: translateX(4px) translateY(-50%) rotate(45deg);
}

.tautan-button {
  line-height: 1.5;
  text-decoration: none;
  display: inline-flex;
  border: none;
  cursor: pointer;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--clr);
  color: #fff;
  border-radius: 10rem;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.3s;
  font-size: 14px;
}

.tautan-button__icon-wrapper {
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;
  color: var(--clr);
  background-color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.tautan-button:hover {
  background-color: #000;
}

.tautan-button:hover .tautan-button__icon-wrapper {
  color: #000;
}

.tautan-button__icon-svg--copy {
  position: absolute;
  transform: translate(-150%, 150%);
}

.tautan-button:hover .tautan-button__icon-svg:first-child {
  transition: transform 0.3s ease-in-out;
  transform: translate(150%, -150%);
}

.tautan-button:hover .tautan-button__icon-svg--copy {
  transition: transform 0.3s ease-in-out 0.1s;
  transform: translate(0);
}
</style>
