<template>
  <main id="beranda" class="relative overflow-hidden w-full pb-24 pt-20 md:pt-24">
    <!-- Atmospheric Gradient Orb -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(200,184,224,0.3)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none md:w-[900px] md:h-[900px]"
    ></div>

    <!-- Unified Headline Slider Section -->
    <section
      class="max-w-6xl mx-auto px-6 md:px-12 mb-12 relative z-10"
      @mouseenter="stopSlide"
      @mouseleave="startSlide"
    >
      <h2
        class="font-serif text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px] mb-6 text-center uppercase"
      >
        Warta Jemaat
      </h2>
      <div
        v-if="combinedHeadlines.length > 0"
        class="relative w-full overflow-hidden rounded-[24px] bg-[#0c0a09] text-white min-h-[350px] md:min-h-[450px] shadow-2xl flex group"
      >
        <div
          v-for="(item, index) in combinedHeadlines"
          :key="item.id"
          class="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform flex"
          :class="
            currentSlide === index
              ? 'opacity-100 translate-x-0 z-10'
              : 'opacity-0 translate-x-12 z-0 pointer-events-none'
          "
        >
          <!-- Background Image -->
          <div
            v-if="item.image"
            class="absolute inset-0 w-full h-full z-0 cursor-pointer overflow-hidden"
            @click="openModal(item.raw)"
          >
            <img
              :src="item.image"
              class="w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
              alt="Media Headline"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/80 to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- Content -->
          <div
            class="relative z-20 p-8 md:p-12 lg:p-16 flex flex-col justify-end h-full w-full max-w-4xl"
          >
            <h2
              class="font-serif text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] mb-4 text-white drop-shadow-lg line-clamp-2 hover:text-gray-300 cursor-pointer transition-colors"
              @click="openModal(item.raw)"
            >
              {{ item.title }}
            </h2>

            <div
              v-if="item.type === 'jadwal'"
              class="text-[14px] md:text-[16px] text-gray-300 mb-6 flex flex-wrap items-center gap-2 md:gap-3"
            >
              <span class="flex items-center gap-1.5">
                <svg
                  class="w-4 h-4 md:w-5 md:h-5"
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
                {{ formatDate(item.date) }}
              </span>
              <span class="hidden md:inline">&bull;</span>
              <span>{{ formatWaktu(item.time) }} WIB</span>
              <span class="hidden md:inline">&bull;</span>
              <span class="truncate max-w-[200px] md:max-w-none">{{ item.location }}</span>
            </div>
            <div
              v-else
              class="text-[14px] md:text-[16px] text-gray-300 mb-6 flex items-center gap-2 md:gap-3"
            >
              <span class="flex items-center gap-1.5">
                <svg
                  class="w-4 h-4 md:w-5 md:h-5"
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
                {{ formatDate(item.date) }}
              </span>
            </div>

            <p
              class="text-[14px] md:text-[16px] text-gray-400 line-clamp-3 md:line-clamp-4 max-w-3xl mb-8"
            >
              {{ item.desc }}
            </p>

            <div class="flex flex-wrap gap-3">
              <button
                @click="openModal(item.raw)"
                class="self-start bg-white text-[#0c0a09] px-6 py-2.5 rounded-full text-[13px] md:text-[14px] font-bold hover:bg-gray-200 transition-colors"
              >
                Baca Selengkapnya
              </button>
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="self-start bg-[#800000] text-white px-6 py-2.5 rounded-full text-[13px] md:text-[14px] font-bold hover:bg-[#500000] transition-colors flex items-center gap-2"
              >
                Buka Tautan
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <!-- Controls (Prev/Next) -->
        <button
          v-if="combinedHeadlines.length > 1"
          @click="prevSlide"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-black/80 hover:scale-110"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <button
          v-if="combinedHeadlines.length > 1"
          @click="nextSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-black/80 hover:scale-110"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>

        <!-- Slide Indicators -->
        <div
          v-if="combinedHeadlines.length > 1"
          class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20"
        >
          <button
            v-for="(_, index) in combinedHeadlines"
            :key="index"
            @click="currentSlide = index"
            class="h-1.5 rounded-full transition-all duration-500 ease-out"
            :class="
              currentSlide === index ? 'bg-[#a7e5d3] w-8' : 'bg-white/40 w-2 hover:bg-white/60'
            "
          ></button>
        </div>
      </div>
    </section>

    <!-- Renungan Harian Banner Section -->
    <section id="renungan" class="py-12 px-6 md:px-12 max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 class="font-serif text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px]">
          Renungan Harian
        </h2>
      </div>

      <div
        class="bg-[#ffffff] rounded-[24px] p-8 md:p-12 border border-[#e7e5e4] shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-shadow duration-300 mb-8"
      >
        <!-- Decorative Background Orb -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(200,184,224,0.15)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none"
        ></div>

        <div class="flex-1 w-full relative z-10">
          <div class="flex items-center gap-3 mb-5">
            <span
              class="bg-[#f5f5f5] text-[#0c0a09] text-[10px] font-bold uppercase tracking-[0.96px] px-3 py-1.5 rounded-full border border-[#e7e5e4]"
              >Renungan Terbaru</span
            >
            <span
              v-if="latestRenungan"
              class="text-[#777169] text-[13px] font-medium tracking-wide"
              >{{
                formatDate(
                  latestRenungan.tanggal_tayang || latestRenungan.tanggal || latestRenungan.date,
                )
              }}</span
            >
          </div>

          <div v-if="store.isLoading" class="animate-pulse">
            <div class="h-8 w-3/4 bg-[#e7e5e4] rounded mb-4"></div>
            <div class="h-4 w-full bg-[#e7e5e4] rounded mb-2"></div>
            <div class="h-4 w-5/6 bg-[#e7e5e4] rounded"></div>
          </div>
          <div v-else-if="latestRenungan" class="flex flex-col h-full">
            <h3
              class="font-serif text-[28px] md:text-[36px] font-bold text-[#0c0a09] mb-4 leading-[1.2]"
            >
              {{ latestRenungan.judul || latestRenungan.tema || latestRenungan.title }}
            </h3>
            <p v-if="latestRenungan.nats" class="text-[15px] text-[#800000] italic mb-4">
              {{ latestRenungan.nats }}
            </p>
            <p
              class="text-[16px] text-[#4e4e4e] font-normal leading-[1.6] line-clamp-3 mb-8 max-w-3xl"
            >
              {{ latestRenungan.isi_renungan || latestRenungan.isi || latestRenungan.content }}
            </p>
            <button
              @click="openModal(latestRenungan)"
              class="self-start bg-transparent border border-[#0c0a09] text-[#0c0a09] px-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#0c0a09] hover:text-[#ffffff] transition-colors"
            >
              Baca Renungan Penuh
            </button>
          </div>
          <div v-else class="text-[#777169] text-[16px]">Belum ada renungan tersedia.</div>
        </div>
      </div>

      <!-- Arsip Renungan Card Grid -->
      <div v-if="pastRenungan.length > 0">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6"
          :class="!showAllRenungan ? 'hidden md:grid' : ''"
        >
          <div
            v-for="(renungan, index) in pastRenungan"
            :key="index"
            @click="openModal(renungan)"
            class="bg-[#faf7f2] rounded-[16px] p-6 border border-[#e7e5e4] shadow-sm flex flex-col h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <p class="text-[12px] font-sans tracking-[0.96px] text-[#777169] font-medium mb-3">
              {{ formatDate(renungan.tanggal_tayang || renungan.tanggal || renungan.date) }}
            </p>
            <h4
              class="font-serif text-[20px] font-bold text-[#0c0a09] mb-2 leading-[1.3] group-hover:text-[#800000] transition-colors"
            >
              {{ renungan.judul || renungan.tema || renungan.title }}
            </h4>
            <p v-if="renungan.nats" class="text-[13px] text-[#800000] italic mb-3">
              {{ renungan.nats }}
            </p>
            <p
              class="text-[14px] text-[#4e4e4e] font-sans font-normal leading-[1.6] line-clamp-3 mb-4 flex-grow"
            >
              {{ renungan.isi_renungan || renungan.isi || renungan.content }}
            </p>
            <span
              class="mt-auto self-start text-[#800000] text-[13px] font-bold font-sans flex items-center gap-1 group-hover:underline"
            >
              Baca Renungan &rarr;
            </span>
          </div>
        </div>

        <!-- Tombol Selengkapnya (Hanya Mobile) -->
        <div class="mt-8 flex justify-center md:hidden">
          <button
            @click="showAllRenungan = !showAllRenungan"
            class="bg-transparent border border-[#d6d3d1] text-[#0c0a09] px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#f0efed] transition-colors"
          >
            {{ showAllRenungan ? 'Tutup Arsip' : 'Lihat Arsip Lainnya' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Jadwal Ibadah Section -->
    <section id="jadwal" class="py-12 px-6 md:px-12 max-w-6xl mx-auto relative">
      <div
        class="absolute top-1/2 -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(167,229,211,0.25)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none"
      ></div>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 class="font-serif text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px]">
          Jadwal Ibadah
        </h2>
      </div>

      <JadwalList :jadwals="listJadwal" :isLoading="store.isLoading" @read-more="openModal" />
    </section>

    <!-- Warta Jemaat List Section -->
    <section id="warta-list" class="py-12 px-6 md:px-12 max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 class="font-serif text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px]">
          Warta Lainnya
        </h2>

        <!-- Search Bar -->
        <div class="relative w-full md:w-72">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari warta..."
            class="w-full bg-[#ffffff] border border-[#d6d3d1] rounded-full px-5 py-2.5 text-[15px] font-sans text-[#0c0a09] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-shadow"
          />
          <svg
            class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <WartaList :wartas="listWarta" :isLoading="store.isLoading" @read-more="openModal" />
    </section>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-[#0c0a09]/60 backdrop-blur-sm" @click="closeModal"></div>

          <!-- Modal Content -->
          <div
            class="bg-[#ffffff] rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl scale-100 transition-transform"
            @click.stop
          >
            <div class="p-8 overflow-y-auto">
              <button
                @click="closeModal"
                class="absolute top-6 right-6 text-[#a8a29e] hover:text-[#0c0a09] bg-[#f5f5f5] hover:bg-[#e7e5e4] rounded-full p-2 transition-colors"
              >
                <span class="sr-only">Close</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>

              <p class="text-[12px] font-semibold tracking-[0.96px] text-[#800000] uppercase mb-4">
                {{
                  selectedItem?.formattedDate ||
                  formatDate(
                    selectedItem?.tanggal_tayang || selectedItem?.tanggal || selectedItem?.date,
                  )
                }}
              </p>
              <h2
                class="font-serif text-[32px] md:text-[40px] font-bold text-[#0c0a09] leading-[1.1] mb-3 pr-8"
              >
                {{
                  selectedItem?.judul ||
                  selectedItem?.tema ||
                  selectedItem?.title ||
                  selectedItem?.nama_ibadah ||
                  selectedItem?.kategori
                }}
              </h2>
              <p
                v-if="selectedItem?.nats"
                class="text-[#800000] italic text-[16px] mb-6 font-serif"
              >
                {{ selectedItem.nats }}
              </p>

              <!-- Tambahan Informasi untuk Jadwal Ibadah -->
              <div
                v-else-if="selectedItem?.lokasi"
                class="flex flex-wrap gap-4 text-[#4e4e4e] text-[14px] mb-6 bg-[#f5f5f5] p-4 rounded-xl border border-[#e7e5e4]"
              >
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
                  <span class="font-medium">{{ formatWaktu(selectedItem.waktu) }} WIB</span>
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
                  <span class="font-medium">{{ selectedItem.lokasi }}</span>
                </div>
              </div>
              <div v-else class="mb-4"></div>

              <!-- Gambar Warta di dalam Modal Detail -->
              <div
                v-if="selectedItem?.url_gambar || selectedItem?.gambar"
                class="mb-6 rounded-xl overflow-hidden shadow-sm border border-[#e7e5e4]"
              >
                <img
                  :src="selectedItem?.url_gambar || selectedItem?.gambar"
                  alt="Media Warta"
                  class="w-full h-auto max-h-[400px] object-cover"
                />
              </div>

              <div class="text-[#4e4e4e] text-[16px] leading-[1.6] space-y-4 whitespace-pre-wrap">
                {{
                  selectedItem?.isi_renungan ||
                  selectedItem?.isi ||
                  selectedItem?.content ||
                  selectedItem?.ringkasan ||
                  selectedItem?.excerpt ||
                  selectedItem?.keterangan
                }}
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChurchStore } from '@/stores/churchStore'
import WartaList from '@/components/WartaList.vue'
import JadwalList from '@/components/JadwalList.vue'

// Fungsi untuk memformat tanggal ISO menjadi "Hari, Tanggal Bulan Tahun"
const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString // return original jika format tidak valid
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const store = useChurchStore()
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedItem = ref(null)
const showAllRenungan = ref(false)

// --- Warta Logic ---
// Sort data by date descending
const sortedWarta = computed(() => {
  if (!store.warta.length) return []
  return [...store.warta].sort(
    (a, b) => new Date(b.tanggal || b.date) - new Date(a.tanggal || a.date),
  )
})

// Filter sorted data by search
const filteredWarta = computed(() => {
  if (!searchQuery.value) return sortedWarta.value
  const query = searchQuery.value.toLowerCase()
  return sortedWarta.value.filter((w) => (w.judul || w.title || '').toLowerCase().includes(query))
})

// List Warta (Reguler) di bawah: Mengecualikan yang sudah masuk ke Headline
const listWarta = computed(() => {
  if (searchQuery.value) return filteredWarta.value
  const headlineIds = combinedHeadlines.value.filter((h) => h.type === 'warta').map((h) => h.raw.id)
  return sortedWarta.value.filter((w) => !headlineIds.includes(w.id))
})

// --- Modal Logic ---
const openModal = (item) => {
  selectedItem.value = item
  isModalOpen.value = true
  document.body.style.overflow = 'hidden' // Prevent scrolling behind modal
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedItem.value = null
  }, 200) // Clear after exit animation
  document.body.style.overflow = 'auto'
}

// Schedule Logic: Filter schedules that haven't passed
const validJadwal = computed(() => {
  if (!store.jadwal.length) return []
  const now = new Date()
  now.setHours(0, 0, 0, 0) // Atur filter agar jadwal hari ini tetap tampil sampai ganti hari
  return store.jadwal
    .filter((j) => {
      const jadwalDate = new Date(j.tanggal || j.date || new Date().toISOString())
      return jadwalDate >= now
    })
    .sort((a, b) => new Date(a.tanggal || a.date) - new Date(b.tanggal || b.date))
})

// List Jadwal (Reguler) di bawah: Mengecualikan yang sudah masuk ke Headline
const listJadwal = computed(() => {
  const headlineIds = combinedHeadlines.value
    .filter((h) => h.type === 'jadwal')
    .map((h) => h.raw.id)
  return validJadwal.value.filter((j) => !headlineIds.includes(j.id))
})

// Format Waktu untuk Jadwal Headline
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

// --- Unified Headline Logic ---
const combinedHeadlines = computed(() => {
  const headlines = []

  store.warta.forEach((w) => {
    if (w.is_headline === true || w.is_headline === 'TRUE' || w.is_headline === 'true') {
      headlines.push({
        id: 'warta-' + w.id,
        type: 'warta',
        label: 'Warta Penting',
        title: w.judul || w.title,
        date: w.tanggal || w.date,
        image: w.display_gambar || w.url_gambar || w.gambar,
        desc: w.isi || w.isi_lengkap || w.content || w.ringkasan,
        raw: w,
      })
    }
  })

  validJadwal.value.forEach((j) => {
    if (j.is_headline === true || j.is_headline === 'TRUE' || j.is_headline === 'true') {
      headlines.push({
        id: 'jadwal-' + j.id,
        type: 'jadwal',
        label: 'Jadwal Spesial',
        title: j.nama_ibadah || j.kategori,
        date: j.tanggal || j.date,
        time: j.waktu,
        location: j.lokasi,
        desc: j.keterangan,
        link: j.link,
        image: j.display_gambar || j.url_gambar || j.gambar, // Fallback gambar jadwal
        raw: j,
      })
    }
  })

  // Fallback: Jika admin lupa mencentang satupun headline, kita tampilkan warta terbaru
  if (headlines.length === 0 && sortedWarta.value.length > 0) {
    const w = sortedWarta.value[0]
    headlines.push({
      id: 'warta-' + w.id,
      type: 'warta',
      label: 'Warta Terbaru',
      title: w.judul || w.title,
      date: w.tanggal || w.date,
      image: w.display_gambar || w.url_gambar || w.gambar,
      desc: w.isi || w.isi_lengkap || w.content || w.ringkasan,
      raw: w,
    })
  }

  return headlines.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const currentSlide = ref(0)
let slideInterval

const startSlide = () => {
  slideInterval = setInterval(() => {
    if (combinedHeadlines.value.length > 1) {
      currentSlide.value = (currentSlide.value + 1) % combinedHeadlines.value.length
    }
  }, 5000) // 5 Detik per slide
}
const stopSlide = () => {
  clearInterval(slideInterval)
}
const nextSlide = () =>
  (currentSlide.value = (currentSlide.value + 1) % combinedHeadlines.value.length)
const prevSlide = () =>
  (currentSlide.value =
    (currentSlide.value - 1 + combinedHeadlines.value.length) % combinedHeadlines.value.length)

onMounted(() => startSlide())
onUnmounted(() => stopSlide())

// --- Renungan Logic ---
const sortedRenungan = computed(() => {
  if (!store.renungan.length) return []
  return [...store.renungan].sort(
    (a, b) =>
      new Date(b.tanggal_tayang || b.date || b.tanggal) -
      new Date(a.tanggal_tayang || a.date || a.tanggal),
  )
})

const latestRenungan = computed(() => {
  return sortedRenungan.value.length ? sortedRenungan.value[0] : null
})

const pastRenungan = computed(() => {
  return sortedRenungan.value.slice(1)
})
</script>
