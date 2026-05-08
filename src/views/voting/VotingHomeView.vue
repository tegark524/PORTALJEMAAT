<template>
  <main class="relative w-full pb-24 pt-24 md:pt-32 px-6 md:px-12 max-w-6xl mx-auto min-h-screen">
    <!-- Latar Belakang Estetik -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(220,38,38,0.08)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none"
    ></div>

    <div v-if="store.isLoading" class="flex flex-col items-center justify-center min-h-[50vh]">
      <div class="flex flex-row gap-2">
        <div class="w-3 h-3 rounded-full bg-[#800000] animate-bounce"></div>
        <div class="w-3 h-3 rounded-full bg-[#800000] animate-bounce [animation-delay:-.3s]"></div>
        <div class="w-3 h-3 rounded-full bg-[#800000] animate-bounce [animation-delay:-.5s]"></div>
      </div>
      <p class="text-[#777169] mt-4 font-medium text-sm">Memuat Data Portal...</p>
    </div>

    <div v-else>
      <!-- 1. Hero Section & Status Pemilihan -->
      <section class="max-w-3xl mx-auto text-center mb-16">
        <h1
          class="font-serif text-[40px] md:text-[56px] font-bold text-[#0c0a09] leading-tight mb-4 tracking-[-0.02em]"
        >
          {{
            store.votingConfig?.judul_pemilihan ||
            store.votingConfig?.nama_event ||
            'E-Voting Majelis'
          }}
        </h1>
        <p
          v-if="!isResultPublished"
          class="text-[16px] text-[#4e4e4e] leading-[1.6] mb-10 max-w-2xl mx-auto"
        >
          {{
            store.votingConfig?.deskripsi ||
            store.votingConfig?.deskripsi_event ||
            'Selamat datang di Portal Pemilihan Majelis.'
          }}
        </p>

        <!-- Papan Status Countdown -->
        <div
          v-if="!isResultPublished"
          class="bg-white p-6 md:p-8 rounded-[24px] border border-[#e7e5e4] shadow-sm relative overflow-hidden"
        >
          <!-- Status: WAITING (Belum Mulai) -->
          <div v-if="votingStatus === 'WAITING'" class="space-y-4">
            <div
              class="inline-flex items-center gap-2 bg-[#fef08a] text-[#854d0e] px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Segera Dibuka
            </div>
            <h3 class="text-[15px] font-semibold text-[#4e4e4e]">Pemilihan akan dimulai dalam:</h3>
            <div class="flex justify-center gap-3 md:gap-6 font-mono text-[#0c0a09]">
              <div class="flex flex-col items-center">
                <span class="text-3xl md:text-5xl font-bold">{{ timeRemaining.days }}</span
                ><span
                  class="text-[10px] md:text-[12px] text-[#777169] uppercase font-sans font-bold"
                  >Hari</span
                >
              </div>
              <span class="text-3xl md:text-5xl font-bold text-[#d6d3d1]">:</span>
              <div class="flex flex-col items-center">
                <span class="text-3xl md:text-5xl font-bold">{{ timeRemaining.hours }}</span
                ><span
                  class="text-[10px] md:text-[12px] text-[#777169] uppercase font-sans font-bold"
                  >Jam</span
                >
              </div>
              <span class="text-3xl md:text-5xl font-bold text-[#d6d3d1]">:</span>
              <div class="flex flex-col items-center">
                <span class="text-3xl md:text-5xl font-bold">{{ timeRemaining.minutes }}</span
                ><span
                  class="text-[10px] md:text-[12px] text-[#777169] uppercase font-sans font-bold"
                  >Menit</span
                >
              </div>
              <span class="text-3xl md:text-5xl font-bold text-[#d6d3d1]">:</span>
              <div class="flex flex-col items-center">
                <span class="text-3xl md:text-5xl font-bold">{{ timeRemaining.seconds }}</span
                ><span
                  class="text-[10px] md:text-[12px] text-[#777169] uppercase font-sans font-bold"
                  >Detik</span
                >
              </div>
            </div>
            <button
              disabled
              class="mt-6 w-full md:w-auto bg-[#f5f5f5] text-[#a8a29e] px-8 py-3.5 rounded-full font-bold text-[15px] cursor-not-allowed"
            >
              Bilik Suara Terkunci
            </button>
          </div>

          <!-- Status: ACTIVE (Sedang Berlangsung) -->
          <div v-else-if="votingStatus === 'ACTIVE'" class="space-y-4">
            <div
              class="inline-flex items-center gap-2 bg-[#fee2e2] text-[#dc2626] px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-2 animate-pulse"
            >
              <div class="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></div>
              Sedang Berlangsung
            </div>
            <h3 class="text-[15px] font-semibold text-[#4e4e4e]">Sisa Waktu Pemilihan:</h3>
            <div class="flex justify-center gap-3 md:gap-6 font-mono text-[#0c0a09]">
              <div class="flex flex-col items-center">
                <span class="text-3xl md:text-5xl font-bold">{{ timeRemaining.hours }}</span
                ><span
                  class="text-[10px] md:text-[12px] text-[#777169] uppercase font-sans font-bold"
                  >Jam</span
                >
              </div>
              <span class="text-3xl md:text-5xl font-bold text-[#d6d3d1]">:</span>
              <div class="flex flex-col items-center">
                <span class="text-3xl md:text-5xl font-bold">{{ timeRemaining.minutes }}</span
                ><span
                  class="text-[10px] md:text-[12px] text-[#777169] uppercase font-sans font-bold"
                  >Menit</span
                >
              </div>
              <span class="text-3xl md:text-5xl font-bold text-[#d6d3d1]">:</span>
              <div class="flex flex-col items-center">
                <span class="text-3xl md:text-5xl font-bold">{{ timeRemaining.seconds }}</span
                ><span
                  class="text-[10px] md:text-[12px] text-[#777169] uppercase font-sans font-bold"
                  >Detik</span
                >
              </div>
            </div>
            <div class="mt-6">
              <router-link
                to="/voting/login"
                class="inline-flex items-center gap-2 w-full md:w-auto justify-center bg-[#800000] text-white px-8 py-3.5 rounded-full font-bold text-[15px] hover:bg-[#500000] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Masuk Bilik Suara
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Status: CLOSED (Sudah Ditutup) -->
          <div v-else class="space-y-4">
            <div
              class="inline-flex items-center gap-2 bg-[#f0efed] text-[#4e4e4e] px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Telah Ditutup
            </div>
            <h3 class="text-[20px] md:text-[24px] font-serif font-bold text-[#0c0a09]">
              Periode Pemilihan Selesai
            </h3>
            <p class="text-[14px] text-[#777169]">
              Terima kasih atas partisipasi Anda dalam memberikan hak suara.
            </p>
          </div>
        </div>
      </section>

      <!-- 2. Section Publikasi Hasil -->
      <section v-if="votingStatus === 'CLOSED' || isResultPublished" class="mb-24">
        <div class="flex items-center gap-4 mb-8">
          <h2 class="font-serif text-[28px] md:text-[32px] font-bold text-[#0c0a09]">
            Hasil Pemilihan
          </h2>
          <div class="h-px bg-[#e7e5e4] flex-grow"></div>
        </div>

        <!-- Belum Terpublikasi -->
        <div
          v-if="!isResultPublished"
          class="bg-[#faf7f2] p-8 md:p-12 text-center rounded-[24px] border border-[#e7e5e4]"
        >
          <div
            class="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm"
          >
            <svg
              class="w-8 h-8 text-[#800000]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h3 class="font-bold text-[18px] text-[#0c0a09] mb-2">Rekapitulasi Sedang Berlangsung</h3>
          <p class="text-[#777169] text-[15px] max-w-lg mx-auto">
            Hasil akhir pemilihan belum dipublikasikan oleh Panitia/Majelis Jemaat. Silakan kembali
            beberapa saat lagi.
          </p>
        </div>

        <!-- Hasil Live Count (Chart) -->
        <div v-else class="bg-white p-6 md:p-10 rounded-[24px] border border-[#e7e5e4] shadow-sm">
          <div v-if="isFetchingVotes" class="text-center py-10 text-[#777169] animate-pulse">
            Menghitung perolehan suara...
          </div>
          <div v-else>
            <!-- Live Update Indicator -->
            <div class="flex justify-end mb-6">
              <div
                class="flex items-center gap-2 text-[12px] text-[#777169] font-medium bg-[#f5f5f5] px-3 py-1.5 rounded-full border border-[#e7e5e4]"
              >
                <span class="relative flex h-2.5 w-2.5">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75"
                  ></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16a34a]"></span>
                </span>
                Live Update (Auto-Refresh)
              </div>
            </div>

            <!-- Statistik Suara -->
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 border-b border-[#f0efed] pb-6"
            >
              <div>
                <p
                  class="text-[11px] md:text-[12px] font-bold text-[#777169] uppercase tracking-wider mb-1"
                >
                  Total Suara Masuk
                </p>
                <p
                  class="text-[28px] md:text-[36px] font-serif font-bold text-[#800000] leading-none"
                >
                  {{ totalVotes }}
                </p>
              </div>
              <div>
                <p
                  class="text-[11px] md:text-[12px] font-bold text-[#777169] uppercase tracking-wider mb-1"
                >
                  Daftar Pemilih
                </p>
                <p
                  class="text-[28px] md:text-[36px] font-serif font-bold text-[#0c0a09] leading-none"
                >
                  {{ totalVoters }}
                </p>
              </div>
              <div>
                <p
                  class="text-[11px] md:text-[12px] font-bold text-[#777169] uppercase tracking-wider mb-1"
                >
                  Partisipasi
                </p>
                <p
                  class="text-[28px] md:text-[36px] font-serif font-bold text-[#16a34a] leading-none"
                >
                  {{ partisipasiPercentage }}%
                </p>
              </div>
              <div>
                <p
                  class="text-[11px] md:text-[12px] font-bold text-[#777169] uppercase tracking-wider mb-1"
                >
                  Belum Memilih
                </p>
                <p
                  class="text-[28px] md:text-[36px] font-serif font-bold text-[#dc2626] leading-none"
                >
                  {{ golputVotes }}
                </p>
              </div>
            </div>

            <!-- Bar Chart -->
            <div class="space-y-6">
              <div v-for="(kandidat, index) in voteResults" :key="kandidat.id" class="relative">
                <div class="flex justify-between items-end mb-2">
                  <div class="flex items-center gap-3">
                    <span class="text-[#a8a29e] font-bold text-[14px]">#{{ index + 1 }}</span>
                    <span class="font-bold text-[#0c0a09] text-[15px] md:text-[16px]">{{
                      kandidat.nama
                    }}</span>
                  </div>
                  <div class="text-right">
                    <span class="font-bold text-[#0c0a09] text-[16px]">{{ kandidat.suara }}</span>
                    <span class="text-[#777169] text-[13px] ml-1"
                      >({{ kandidat.persentase }}%)</span
                    >
                  </div>
                </div>
                <!-- Progress Bar -->
                <div
                  class="w-full bg-[#f5f5f5] rounded-full h-4 overflow-hidden border border-[#e7e5e4]"
                >
                  <div
                    class="bg-[#800000] h-full rounded-full transition-all duration-1000 ease-out relative"
                    :style="{ width: kandidat.persentase + '%' }"
                  >
                    <div
                      class="absolute inset-0 bg-white/20 w-full"
                      style="
                        background-image: linear-gradient(
                          45deg,
                          rgba(255, 255, 255, 0.15) 25%,
                          transparent 25%,
                          transparent 50%,
                          rgba(255, 255, 255, 0.15) 50%,
                          rgba(255, 255, 255, 0.15) 75%,
                          transparent 75%,
                          transparent
                        );
                        background-size: 1rem 1rem;
                      "
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Daftar Kandidat (Disembunyikan jika Hasil sudah rilis atau ditutup) -->
      <section v-if="votingStatus !== 'CLOSED' && !isResultPublished">
        <div class="flex items-center gap-4 mb-8">
          <h2 class="font-serif text-[28px] md:text-[32px] font-bold text-[#0c0a09]">
            Profil Kandidat
          </h2>
          <div class="h-px bg-[#e7e5e4] flex-grow"></div>
        </div>

        <div
          v-if="!store.kandidat.length"
          class="text-center py-16 bg-white border border-[#e7e5e4] rounded-[16px] text-[#777169]"
        >
          Data kandidat belum ditambahkan oleh panitia.
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="kandidat in store.kandidat"
            :key="kandidat.id"
            class="bg-white rounded-[20px] p-6 border border-[#e7e5e4] shadow-sm hover:shadow-md transition-shadow group flex flex-col"
          >
            <div
              class="w-24 h-24 rounded-full bg-[#f0efed] border-4 border-white shadow-sm overflow-hidden mb-4 shrink-0 mx-auto relative group-hover:scale-105 transition-transform duration-300"
            >
              <img
                v-if="kandidat.url_foto || kandidat.foto"
                :src="kandidat.url_foto || kandidat.foto"
                :alt="kandidat.nama"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-[#f5f5f5] text-[#a8a29e]"
              >
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 class="text-[18px] font-bold text-[#0c0a09] text-center mb-4 leading-tight">
              {{ kandidat.nama }}
            </h3>

            <div class="bg-[#faf7f2] rounded-xl p-4 flex-grow border border-[#e7e5e4]/50">
              <p class="text-[12px] font-bold text-[#800000] uppercase tracking-wider mb-2">
                Visi & Misi
              </p>
              <p class="text-[14px] text-[#4e4e4e] leading-[1.6] whitespace-pre-wrap">
                {{ kandidat.visi_misi || '-' }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useChurchStore } from '@/stores/churchStore'
import axios from 'axios'

const store = useChurchStore()
const now = ref(new Date().getTime())
let timerInterval = null
let liveCountInterval = null

const isFetchingVotes = ref(false)
const publicVotes = ref([])

onMounted(async () => {
  document.title = 'Portal Pemilihan | GKJW Sukolilo'
  // Pastikan data penting ter-load
  await Promise.all([store.fetchVotingConfig(), store.fetchKandidat()])

  // Update waktu setiap detik untuk countdown
  timerInterval = setInterval(() => {
    now.value = new Date().getTime()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (liveCountInterval) clearInterval(liveCountInterval)
})

// Status Perhitungan Waktu
const votingStatus = computed(() => {
  const config = store.votingConfig
  if (!config || !config.waktu_mulai || !config.waktu_selesai) return 'WAITING'

  const start = new Date(config.waktu_mulai).getTime()
  const end = new Date(config.waktu_selesai).getTime()
  const current = now.value

  if (current < start) return 'WAITING'
  if (current > end) return 'CLOSED'
  return 'ACTIVE'
})

// Penghitung Mundur (Sisa Waktu)
const timeRemaining = computed(() => {
  const config = store.votingConfig
  if (!config) return { days: '00', hours: '00', minutes: '00', seconds: '00' }

  const start = new Date(config.waktu_mulai).getTime()
  const end = new Date(config.waktu_selesai).getTime()
  const current = now.value

  let target = start
  if (votingStatus.value === 'ACTIVE') target = end
  else if (votingStatus.value === 'CLOSED')
    return { days: '00', hours: '00', minutes: '00', seconds: '00' }

  const diff = target - current
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days: d.toString().padStart(2, '0'),
    hours: h.toString().padStart(2, '0'),
    minutes: m.toString().padStart(2, '0'),
    seconds: s.toString().padStart(2, '0'),
  }
})

// Logika Publikasi Hasil Suara
const isResultPublished = computed(() => {
  const pub = store.votingConfig?.is_result_published
  return pub === true || pub === 'TRUE' || String(pub).toLowerCase() === 'true'
})

// Fetch Suara & Pemilih
const fetchLiveCount = async () => {
  if (publicVotes.value.length === 0) isFetchingVotes.value = true
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GAS_API_URL}?table=tb_suara&mode=public`,
    )
    publicVotes.value = response.data?.data || response.data || []
    await store.fetchVoters() // Tarik total pemilih untuk kalkulasi partisipasi
  } catch (err) {
    console.error('Gagal memuat hasil suara', err)
  } finally {
    isFetchingVotes.value = false
  }
}

// Load hasil suara jika Dipublikasi (Mengesampingkan status agar admin bisa memaksa buka hasil)
watch(
  () => isResultPublished.value,
  async (published) => {
    if (published) {
      if (!liveCountInterval) {
        fetchLiveCount()
        liveCountInterval = setInterval(fetchLiveCount, 10000) // Auto-refresh setiap 10 detik
      }
    } else {
      if (liveCountInterval) {
        clearInterval(liveCountInterval)
        liveCountInterval = null
      }
    }
  },
  { immediate: true },
)

// Menghitung Kalkulasi Perolehan Suara
const totalVotes = computed(() => publicVotes.value.length)
const totalVoters = computed(() => store.voters.length)
const golputVotes = computed(() => Math.max(0, totalVoters.value - totalVotes.value))
const partisipasiPercentage = computed(() => {
  if (totalVoters.value === 0) return 0
  return ((totalVotes.value / totalVoters.value) * 100).toFixed(1)
})

const voteResults = computed(() => {
  const results = store.kandidat.map((k) => ({
    id: k.id,
    nama: k.nama,
    suara: 0,
    persentase: 0,
  }))

  publicVotes.value.forEach((vote) => {
    const candidate = results.find((c) => c.id.toString() === vote.id_kandidat?.toString())
    if (candidate) candidate.suara++
  })

  if (totalVotes.value > 0) {
    results.forEach((r) => {
      r.persentase = ((r.suara / totalVotes.value) * 100).toFixed(1)
    })
  }

  // Urutkan dari suara terbanyak
  return results.sort((a, b) => b.suara - a.suara)
})
</script>
