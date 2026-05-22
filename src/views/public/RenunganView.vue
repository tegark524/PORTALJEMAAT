<template>
  <main class="w-full pb-24 pt-24 md:pt-32 px-6 md:px-12 max-w-6xl mx-auto min-h-screen">
    <!-- Atmospheric Background -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(200,184,224,0.15)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none"
    ></div>

    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
      <div>
        <h1
          class="font-serif text-[32px] md:text-[42px] font-bold text-[#0c0a09] tracking-[-0.02em] leading-tight"
        >
          Renungan Harian
        </h1>
        <p class="text-[#777169] text-[15px] mt-2">
          Membaca, merenungkan, dan menghidupi firman Tuhan setiap hari.
        </p>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
      <!-- Bagian Detail (Kiri / Atas) -->
      <div class="lg:w-2/3">
        <div
          v-if="store.isLoading"
          class="animate-pulse space-y-6 bg-white p-8 md:p-12 rounded-[24px] border border-[#e7e5e4]"
        >
          <div class="h-4 bg-[#e7e5e4] rounded w-1/4"></div>
          <div class="h-10 bg-[#e7e5e4] rounded w-3/4"></div>
          <div class="h-32 bg-[#e7e5e4] rounded w-full mt-8"></div>
          <div class="h-4 bg-[#e7e5e4] rounded w-full"></div>
          <div class="h-4 bg-[#e7e5e4] rounded w-full"></div>
          <div class="h-4 bg-[#e7e5e4] rounded w-5/6"></div>
        </div>

        <div
          v-else-if="activeRenungan"
          class="bg-white rounded-[24px] p-6 md:p-12 shadow-sm border border-[#e7e5e4] relative overflow-hidden"
        >
          <!-- Date & Title -->
          <p
            class="text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[#800000] mb-3"
          >
            {{
              formatDate(
                activeRenungan.tanggal_tayang || activeRenungan.tanggal || activeRenungan.date,
              )
            }}
          </p>
          <h2
            class="font-serif text-[28px] md:text-[38px] font-bold text-[#0c0a09] mb-8 leading-[1.2]"
          >
            {{ activeRenungan.judul || activeRenungan.tema || activeRenungan.title }}
          </h2>

          <p
            v-if="activeRenungan.nats || activeRenungan.bible_book_name"
            class="text-[17px] text-[#800000] italic font-serif"
            :class="isBibleAvailable ? 'mb-4' : 'mb-8'"
          >
            {{
              activeRenungan.nats ||
              (activeRenungan.bible_book_name
                ? `${activeRenungan.bible_book_name} ${activeRenungan.bible_chapter}${activeRenungan.bible_range || activeRenungan.bible_nats ? ':' + (activeRenungan.bible_range || activeRenungan.bible_nats) : ''}`
                : '')
            }}
          </p>

          <!-- API Fetch Alkitab -->
          <div class="mb-10" v-if="isBibleAvailable">
            <button
              v-if="!showFullBible"
              @click="showFullBible = true"
              class="inline-flex items-center gap-2 bg-[#800000] text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-[#500000] transition-colors shadow-sm"
            >
              📖 Baca Alkitab
            </button>
            <button
              v-else
              @click="showFullBible = false"
              class="inline-flex items-center gap-2 bg-[#f0efed] text-[#4e4e4e] border border-[#d6d3d1] px-5 py-2 rounded-full text-[13px] font-bold hover:bg-[#e7e5e4] transition-colors shadow-sm mb-4"
            >
              Tutup Alkitab
            </button>

            <transition name="slide-down">
              <div v-show="showFullBible">
                <div
                  v-if="bibleLoading"
                  class="text-[#777169] text-[15px] leading-relaxed font-serif animate-pulse flex items-center gap-3 mt-4"
                >
                  <div
                    class="w-4 h-4 border-2 border-[#800000]/30 border-t-[#800000] rounded-full animate-spin"
                  ></div>
                  Memuat perikop Alkitab...
                </div>

                <div
                  v-else-if="bibleError"
                  class="text-[#dc2626] text-[15px] bg-[#fee2e2] p-4 rounded-xl border border-[#fca5a5] mt-4"
                >
                  {{ bibleError }}
                </div>

                <div
                  v-else
                  class="bg-[#fafafa] rounded-2xl p-6 md:p-8 border border-[#e7e5e4] shadow-inner mt-2"
                >
                  <div
                    class="flex justify-between items-center border-b border-[#d6d3d1] pb-4 mb-5"
                  >
                    <h4 class="font-serif text-[20px] md:text-[24px] font-bold text-[#0c0a09]">
                      {{ normalizedBible.bookName }} {{ normalizedBible.chapter
                      }}{{ normalizedBible.range ? ':' + normalizedBible.range : '' }}
                    </h4>
                    <span
                      class="text-[12px] md:text-[13px] font-bold text-[#777169] uppercase tracking-wider bg-[#e7e5e4] px-3 py-1 rounded-md"
                      >TB</span
                    >
                  </div>
                  <div class="space-y-2 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                    <p
                      v-for="verse in bibleVerses"
                      :key="verse.a"
                      class="text-[#3c3c3c] text-[17px] md:text-[19px] leading-relaxed font-serif"
                    >
                      <sup class="font-bold text-[#800000] mr-1.5">{{ verse.a }}</sup
                      >{{ verse.t }}
                    </p>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Devotion Content -->
          <div
            class="text-[#4e4e4e] text-[16px] md:text-[17px] leading-[1.8] space-y-5 whitespace-pre-wrap font-sans mt-8 pt-8 border-t border-[#f0efed]"
          >
            {{ activeRenungan.isi_renungan || activeRenungan.isi || activeRenungan.content }}
          </div>

          <!-- Penulis & Share -->
          <div
            class="mt-12 pt-6 border-t border-[#e7e5e4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="text-[#777169] text-[14px] font-medium italic">
              Penulis: {{ activeRenungan.penulis || 'Tim Renungan Harian' }}
            </div>
            <button
              @click="shareContent(activeRenungan)"
              class="flex items-center gap-2 bg-[#f0efed] hover:bg-[#e7e5e4] text-[#0c0a09] px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                ></path>
              </svg>
              Bagikan
            </button>
          </div>
        </div>

        <div
          v-else
          class="bg-white rounded-[24px] p-12 text-center shadow-sm border border-[#e7e5e4] text-[#777169] flex flex-col items-center justify-center min-h-[400px]"
        >
          <svg
            class="w-12 h-12 text-[#d6d3d1] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span class="text-lg">Belum ada renungan tersedia saat ini.</span>
        </div>
      </div>

      <!-- Bagian List Arsip (Kanan / Bawah) -->
      <div class="lg:w-1/3">
        <div class="sticky top-28">
          <h3 class="font-serif text-[22px] font-bold text-[#0c0a09] mb-6 flex items-center gap-3">
            <svg class="w-5 h-5 text-[#800000]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Arsip Renungan
          </h3>

          <div v-if="store.isLoading" class="space-y-4">
            <div
              v-for="i in 5"
              :key="i"
              class="h-[100px] bg-white rounded-[16px] animate-pulse border border-[#e7e5e4]"
            ></div>
          </div>

          <div
            v-else-if="sortedRenungan.length > 0"
            class="flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-12 custom-scrollbar"
          >
            <button
              v-for="renungan in sortedRenungan"
              :key="renungan.id"
              @click="setActiveRenungan(renungan)"
              class="text-left p-5 rounded-[16px] border transition-all duration-300 w-full group relative overflow-hidden"
              :class="
                activeRenungan?.id === renungan.id
                  ? 'bg-[#fff7f6] border-[#800000] shadow-sm'
                  : 'bg-white border-[#e7e5e4] hover:border-[#d6d3d1] hover:bg-[#fafafa]'
              "
            >
              <div
                v-if="activeRenungan?.id === renungan.id"
                class="absolute left-0 top-0 bottom-0 w-1 bg-[#800000]"
              ></div>
              <p
                class="text-[11px] font-bold uppercase tracking-wider mb-2"
                :class="activeRenungan?.id === renungan.id ? 'text-[#800000]' : 'text-[#777169]'"
              >
                {{ formatDate(renungan.tanggal_tayang || renungan.tanggal || renungan.date) }}
              </p>
              <h4
                class="font-serif font-bold text-[16px] leading-[1.4] line-clamp-2"
                :class="
                  activeRenungan?.id === renungan.id
                    ? 'text-[#0c0a09]'
                    : 'text-[#4e4e4e] group-hover:text-[#0c0a09]'
                "
              >
                {{ renungan.judul || renungan.tema || renungan.title }}
              </h4>
              <p
                v-if="renungan.nats || renungan.bible_book_name"
                class="text-[13px] italic mt-2 line-clamp-1"
                :class="activeRenungan?.id === renungan.id ? 'text-[#800000]/80' : 'text-[#a8a29e]'"
              >
                {{
                  renungan.nats ||
                  (renungan.bible_book_name
                    ? `${renungan.bible_book_name} ${renungan.bible_chapter}${renungan.bible_range || renungan.bible_nats ? ':' + (renungan.bible_range || renungan.bible_nats) : ''}`
                    : '')
                }}
              </p>
            </button>
          </div>
          <div
            v-else
            class="bg-white p-6 rounded-xl border border-[#e7e5e4] text-[#a8a29e] text-[14px] text-center"
          >
            Tidak ada arsip renungan.
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted, watch } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const activeRenungan = ref(null)
const bibleVerses = ref([])
const bibleLoading = ref(false)
const bibleError = ref('')
const showFullBible = ref(false)

onMounted(() => {
  document.title = 'Renungan Harian | GKJW Sukolilo'
})

// Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Sort data by newest date
const sortedRenungan = computed(() => {
  if (!store.renungan || !Array.isArray(store.renungan) || !store.renungan.length) return []
  const now = new Date()
  now.setHours(23, 59, 59, 999) // Batas akhir hari ini

  return [...store.renungan]
    .filter((r) => {
      if (!r) return false
      const rawDate = r.tanggal_tayang || r.date || r.tanggal
      if (!rawDate) return false
      const rDate = new Date(rawDate)
      return !isNaN(rDate.getTime()) && rDate <= now
    })
    .sort((a, b) => {
      if (!a || !b) return 0
      const dateB = new Date(b.tanggal_tayang || b.date || b.tanggal)
      const dateA = new Date(a.tanggal_tayang || a.date || a.tanggal)
      if (isNaN(dateB.getTime()) || isNaN(dateA.getTime())) return 0
      return dateB - dateA
    })
})

// Set the latest as active initially
watch(
  () => sortedRenungan.value,
  (newVal) => {
    if (newVal.length > 0 && !activeRenungan.value) {
      setActiveRenungan(newVal[0])
    }
  },
  { immediate: true },
)

const setActiveRenungan = (renungan) => {
  activeRenungan.value = renungan
  bibleVerses.value = []
  bibleError.value = ''
  showFullBible.value = false
  loadBibleVerses(renungan)
  // Smooth scroll up on mobile devices when clicking archive items
  if (window.innerWidth < 1024) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// --- Bible Fetching & Parsing Logic ---
const getBookFileName = (bookName) => {
  const clean = String(bookName).toLowerCase().trim()
  const mapping = {
    kej: 'kejadian',
    kel: 'keluaran',
    im: 'imamat',
    bil: 'bilangan',
    ul: 'ulangan',
    yos: 'yosua',
    hak: 'hakim-hakim',
    rut: 'rut',
    '1 sam': '1_samuel',
    '2 sam': '2_samuel',
    '1 raj': '1_raja-raja',
    '2 raj': '2_raja-raja',
    '1 taw': '1_tawarikh',
    '2 taw': '2_tawarikh',
    ezr: 'ezra',
    neh: 'nehemia',
    est: 'ester',
    ayb: 'ayub',
    mzm: 'mazmur',
    maz: 'mazmur',
    ams: 'amsal',
    pkh: 'pengkhotbah',
    kid: 'kidung_agung',
    yes: 'yesaya',
    yer: 'yeremia',
    rat: 'ratapan',
    yeh: 'yehezkiel',
    dan: 'daniel',
    hos: 'hosea',
    yoe: 'yoel',
    am: 'amos',
    ob: 'obaja',
    yun: 'yunus',
    mik: 'mikha',
    nah: 'nahum',
    hab: 'habakuk',
    zef: 'zefanya',
    hag: 'hagai',
    zak: 'zakharia',
    mal: 'maleakhi',
    mat: 'matius',
    mrk: 'markus',
    mar: 'markus',
    luk: 'lukas',
    yoh: 'yohanes',
    kis: 'kisah_para_rasul',
    rom: 'roma',
    '1 kor': '1_korintus',
    '2 kor': '2_korintus',
    gal: 'galatia',
    efe: 'efesus',
    fil: 'filipi',
    kol: 'kolose',
    '1 tes': '1_tesalonika',
    '2 tes': '2_tesalonika',
    '1 tim': '1_timotius',
    '2 tim': '2_timotius',
    tit: 'titus',
    flm: 'filemon',
    ibr: 'ibrani',
    yak: 'yakobus',
    '1 pet': '1_petrus',
    '2 pet': '2_petrus',
    '1 yoh': '1_yohanes',
    '2 yoh': '2_yohanes',
    '3 yoh': '3_yohanes',
    yud: 'yudas',
    wah: 'wahyu',
  }
  for (const [key, value] of Object.entries(mapping)) {
    if (clean === key || clean.startsWith(key + ' ') || clean === value) return value + '.json'
  }
  return clean.replace(/\s+/g, '_') + '.json'
}

const parseNats = (natsString) => {
  if (!natsString) return null
  // Mendukung nama kitab dengan tanda hubung seperti "Raja-raja" atau "Hakim-hakim"
  const regex = /^(\d?\s*[a-zA-Z\s\-]+?)\s*(\d+)\s*:\s*([\d\s,-]+)/
  const match = String(natsString).trim().match(regex)
  if (match) {
    return {
      bookName: match[1].trim(),
      bookFile: getBookFileName(match[1]),
      chapter: match[2].trim(),
      range: match[3].trim(),
    }
  }
  return null
}

const getBibleMetadata = (item) => {
  if (!item)
    return { bookFile: '', bookName: '', chapter: '', range: '', bibleNats: '', textNats: '' }

  let bookFile = String(
    item.bible_book_file || item.book_file || item.file || item.alkitab || '',
  ).trim()
  let bookName = String(
    item.bible_book_name || item.book_name || item.book || item.kitab || '',
  ).trim()
  let chapter = String(item.bible_chapter || item.chapter || item.pasal || '').trim()
  let range = String(item.bible_range || item.range || item.ayat || '').trim()

  // Utamakan parsing dari teks Nats agar lebih akurat dan kebal dari perubahan kolom
  if (item.nats) {
    const parsed = parseNats(item.nats)
    if (parsed) {
      bookFile = parsed.bookFile
      bookName = parsed.bookName
      chapter = parsed.chapter
      range = parsed.range
    }
  }

  return {
    bookFile,
    bookName,
    chapter,
    range,
    bibleNats: String(item.bible_nats || item.tentang || '').trim(),
    textNats: String(item.nats || '').trim(),
  }
}

const normalizedBible = computed(() => getBibleMetadata(activeRenungan.value))

const isBibleAvailable = computed(() => {
  return (
    normalizedBible.value.bookFile &&
    normalizedBible.value.chapter &&
    (normalizedBible.value.range || normalizedBible.value.bibleNats)
  )
})

const parseBibleRange = (range, bibleNats) => {
  if (!range || !String(range).trim()) {
    const verseNum = Number(bibleNats)
    if (Number.isInteger(verseNum) && verseNum > 0) {
      return { start: verseNum, end: verseNum }
    }
    return { start: 1, end: 1 }
  }
  const mainRange = String(range).split(',')[0].trim()
  const parts = mainRange
    .split('-')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v > 0)

  if (!parts.length) {
    const verseNum = Number(bibleNats)
    return Number.isInteger(verseNum) && verseNum > 0
      ? { start: verseNum, end: verseNum }
      : { start: 1, end: 1 }
  }
  return {
    start: parts[0],
    end: parts[1] || parts[0],
  }
}

const loadBibleVerses = async (item) => {
  bibleVerses.value = []
  bibleError.value = ''

  const metadata = getBibleMetadata(item)
  if (!metadata.bookFile || !metadata.chapter || (!metadata.range && !metadata.bibleNats)) return

  bibleLoading.value = true
  try {
    const bibleUrl = `${import.meta.env.BASE_URL}alkitab/${metadata.bookFile}`
    const response = await axios.get(bibleUrl)
    const bibleData = response.data
    const chapter = Number(metadata.chapter)
    const { start, end } = parseBibleRange(metadata.range, metadata.bibleNats)

    if (!Number.isInteger(chapter) || chapter < 1) {
      bibleError.value = 'Data pasal Alkitab tidak valid.'
      return
    }

    if (!Array.isArray(bibleData)) {
      bibleError.value = 'Format teks Alkitab tidak dikenali.'
      return
    }

    bibleVerses.value = bibleData.filter(
      (verse) => Number(verse.p) === chapter && Number(verse.a) >= start && Number(verse.a) <= end,
    )

    if (!bibleVerses.value.length) {
      bibleError.value = 'Ayat Alkitab tidak ditemukan untuk rentang tersebut.'
    }
  } catch (error) {
    bibleError.value = 'Gagal memuat teks Alkitab. Silakan coba lagi.'
  } finally {
    bibleLoading.value = false
  }
}

// Share to WhatsApp or Copy to Clipboard
const shareContent = async (item) => {
  if (!item) return
  const url = window.location.href
  const formattedDate = formatDate(item.tanggal_tayang || item.tanggal || item.date)
  let shareText = `${url}\n\n*Renungan Harian - ${formattedDate}*\n`

  const natsText =
    item.nats ||
    (item.bible_book_name
      ? `${item.bible_book_name} ${item.bible_chapter}${item.bible_range || item.bible_nats ? ':' + (item.bible_range || item.bible_nats) : ''}`
      : '')
  if (natsText) shareText += `_${natsText}_\n\n`
  shareText += `${item.isi_renungan || item.isi || item.content || ''}\n`

  if (navigator.share) {
    try {
      await navigator.share({ text: shareText })
    } catch (err) {
      console.error('Gagal membagikan:', err)
    }
  } else {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert('Renungan berhasil disalin ke clipboard! Silakan paste/tempel di WhatsApp.')
      })
      .catch((err) => console.error('Gagal menyalin teks: ', err))
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease-in-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  overflow: hidden;
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 2000px;
  opacity: 1;
  transform: translateY(0);
}

/* Kustomisasi scrollbar agar rapi */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d6d3d1;
  border-radius: 4px;
}
</style>
