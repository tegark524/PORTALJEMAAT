<template>
  <main class="relative w-full pb-24 pt-12 md:pt-24 px-6 md:px-12 max-w-6xl mx-auto min-h-screen">
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(200,184,224,0.15)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none"
    ></div>

    <!-- Form Section -->
    <section class="max-w-2xl mx-auto mb-24 text-center">
      <h1 class="font-serif text-[48px] font-light tracking-[-0.96px] text-[#0c0a09] mb-4">
        Layanan Doa
      </h1>
      <p class="text-[#4e4e4e] text-[16px] leading-[1.6] mb-12">
        Saling mendoakan adalah wujud kasih persaudaraan. Tuliskan pokok doa Anda, dan majelis
        beserta jemaat akan turut mendukung dalam doa.
      </p>

      <form
        @submit.prevent="submitRequest"
        class="bg-white rounded-[24px] p-8 md:p-12 border border-[#e7e5e4] shadow-sm text-left relative overflow-hidden"
      >
        <div
          v-if="successMsg"
          class="absolute inset-0 bg-[#800000] flex flex-col items-center justify-center text-white p-8 text-center z-10"
        >
          <svg
            class="w-12 h-12 mb-4 opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 class="font-serif text-[24px] font-bold mb-2">Permohonan Terkirim</h3>
          <p class="font-sans text-[15px] opacity-90">
            Permohonan doa Anda telah kami terima dan akan dimoderasi oleh majelis.
          </p>
          <button
            @click="successMsg = false"
            type="button"
            class="mt-8 bg-white text-[#800000] px-6 py-2 rounded-full font-bold text-sm"
          >
            Kembali
          </button>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[13px] font-bold text-[#777169] uppercase tracking-[0.96px] mb-2"
                >Nama Anda (Opsional)</label
              >
              <input
                v-model="form.nama"
                type="text"
                placeholder="Boleh dikosongkan (Anonim)"
                class="w-full bg-[#fcfcfc] border border-[#e7e5e4] rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#800000] transition-colors"
              />
            </div>
            <div>
              <label
                class="block text-[13px] font-bold text-[#777169] uppercase tracking-[0.96px] mb-2"
                >No. WhatsApp (Opsional)</label
              >
              <input
                v-model="form.no_wa"
                type="text"
                placeholder="Untuk keperluan konseling"
                class="w-full bg-[#fcfcfc] border border-[#e7e5e4] rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#800000] transition-colors"
              />
            </div>
          </div>
          <div>
            <label
              class="block text-[13px] font-bold text-[#777169] uppercase tracking-[0.96px] mb-2"
              >Jenis Layanan</label
            >
            <select
              v-model="form.jenis_layanan"
              class="w-full bg-[#fcfcfc] border border-[#e7e5e4] rounded-lg px-4 py-3 text-[15px] font-sans focus:outline-none focus:border-[#800000] transition-colors cursor-pointer appearance-none"
            >
              <option value="Permohonan Doa">Permohonan Doa</option>
              <option value="Konseling Pastoral">Konseling Pastoral</option>
              <option value="Kunjungan Majelis">Kunjungan Majelis</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label
              class="block text-[13px] font-bold text-[#777169] uppercase tracking-[0.96px] mb-2"
              >Pesan / Pokok Doa <span class="text-red-500">*</span></label
            >
            <textarea
              v-model="form.pesan"
              required
              rows="5"
              placeholder="Tuliskan pergumulan, ucapan syukur, atau permohonan Anda..."
              class="w-full bg-[#fcfcfc] border border-[#e7e5e4] rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:border-[#800000] transition-colors resize-none"
            ></textarea>
          </div>

          <!-- Opsi Tampil di Publik -->
          <div
            v-if="form.jenis_layanan === 'Permohonan Doa'"
            class="flex items-start gap-3 bg-[#faf7f2] p-5 rounded-xl border border-[#e7e5e4]"
          >
            <div class="pt-0.5 shrink-0">
              <input
                type="checkbox"
                id="izin_publik"
                v-model="form.izin_publik"
                class="w-5 h-5 text-[#800000] border-[#d6d3d1] rounded focus:ring-[#800000] cursor-pointer"
              />
            </div>
            <div>
              <label
                for="izin_publik"
                class="text-[14px] font-bold text-[#0c0a09] mb-1 cursor-pointer block"
              >
                Bersedia di Unggah ke Tembok Doa?
              </label>
              <p class="text-[13px] text-[#4e4e4e] leading-tight">
                Saya mengizinkan pokok doa ini ditampilkan secara publik.
              </p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[#800000] text-white px-6 py-3.5 rounded-full text-[15px] font-bold hover:bg-[#500000] disabled:opacity-50 transition-colors shadow-md flex justify-center items-center h-12"
          >
            <div v-if="isSubmitting" class="flex flex-row gap-2 justify-center items-center">
              <div class="w-2 h-2 rounded-full bg-white animate-bounce"></div>
              <div
                class="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"
              ></div>
              <div
                class="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"
              ></div>
            </div>
            <span v-else>Kirim Pokok Doa</span>
          </button>
          <p v-if="errorMsg" class="text-[#dc2626] text-[14px] mt-2 text-center">{{ errorMsg }}</p>
        </div>
      </form>
    </section>

    <!-- Prayer Wall -->
    <section>
      <div class="flex items-center gap-4 mb-8">
        <h2 class="font-serif text-[32px] font-light text-[#0c0a09]">Tembok Doa</h2>
        <div class="h-px bg-[#e7e5e4] flex-grow"></div>
      </div>

      <div v-if="store.isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-[#faf7f2] h-48 rounded-[16px] animate-pulse border border-[#e7e5e4]"
        ></div>
      </div>
      <div
        v-else-if="publicRequests.length === 0"
        class="text-center py-16 border border-[#e7e5e4] rounded-[16px] bg-[#ffffff] text-[#777169]"
      >
        Belum ada pokok doa publik saat ini.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
        <DoaCard v-for="(doa, i) in publicRequests" :key="i" :doa="doa" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useChurchStore } from '@/stores/churchStore'
import DoaCard from '@/components/DoaCard.vue'

const store = useChurchStore()
const isSubmitting = ref(false)
const successMsg = ref(false)
const errorMsg = ref('')

const form = ref({
  nama: '',
  no_wa: '',
  jenis_layanan: 'Permohonan Doa',
  pesan: '',
  izin_publik: false,
})

// Memuat data form dari local storage saat halaman pertama kali dirender
onMounted(() => {
  const savedForm = localStorage.getItem('gkjw_doa_form')
  if (savedForm) {
    try {
      const parsed = JSON.parse(savedForm)
      form.value = { ...form.value, ...parsed }
    } catch (e) {
      console.error('Error parsing saved form', e)
    }
  }
})

// Menyimpan otomatis ke local storage setiap kali ada perubahan pada form
let debounceTimer = null
watch(
  form,
  (newVal) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      localStorage.setItem('gkjw_doa_form', JSON.stringify(newVal))
    }, 500)
  },
  { deep: true },
)

const publicRequests = computed(() => {
  return store.doa
    .filter((d) => String(d.is_on_air).toLowerCase() === 'true' || d.is_on_air === true)
    .sort(
      (a, b) =>
        new Date(b.timestamp || b.tanggal || b.date) - new Date(a.timestamp || a.tanggal || a.date),
    )
})

const submitRequest = async () => {
  if (!form.value.pesan.trim()) return

  isSubmitting.value = true
  errorMsg.value = ''
  try {
    const rowId = Date.now().toString()
    const timestamp = new Date().toISOString()
    const nama = form.value.nama.trim() || 'Anonim'
    const noWa = form.value.no_wa.trim() || '-'
    const jenisLayanan = form.value.jenis_layanan || 'Permohonan Doa'

    // Payload Baru (Urutan: id, timestamp, nama, no_wa, jenis_layanan, pesan, status, is_on_air, izin_publik)
    const payloadData = [
      rowId,
      timestamp,
      nama,
      noWa,
      jenisLayanan,
      form.value.pesan,
      'Belum Ditangani',
      false,
      form.value.izin_publik || false,
    ]

    await store.submitDoa(payloadData)
    successMsg.value = true
    form.value = {
      nama: '',
      no_wa: '',
      jenis_layanan: 'Permohonan Doa',
      pesan: '',
      izin_publik: false,
    }
    localStorage.removeItem('gkjw_doa_form')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isSubmitting.value = false
  }
}
</script>
