<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h2 class="font-serif text-[32px] font-light text-[#0c0a09]">Konfigurasi E-Voting</h2>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Card 1: Info Umum -->
      <div class="bg-white p-6 md:p-8 rounded-[16px] border border-[#e7e5e4] shadow-sm">
        <h3 class="text-[18px] font-bold text-[#0c0a09] mb-6 border-b border-[#e7e5e4] pb-4">
          1. Informasi Umum
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Judul Pemilihan</label
            >
            <input
              v-model="form.judul_pemilihan"
              type="text"
              required
              placeholder="Contoh: Pemilihan Majelis 2026-2029"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Deskripsi Singkat</label
            >
            <textarea
              v-model="form.deskripsi"
              rows="3"
              required
              placeholder="Sampaikan pesan kepada jemaat..."
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Card 2: Penjadwalan -->
      <div class="bg-white p-6 md:p-8 rounded-[16px] border border-[#e7e5e4] shadow-sm">
        <h3 class="text-[18px] font-bold text-[#0c0a09] mb-6 border-b border-[#e7e5e4] pb-4">
          2. Jadwal Akses Bilik Suara
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Waktu Mulai</label>
            <input
              v-model="form.waktu_mulai"
              type="datetime-local"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Waktu Selesai</label>
            <input
              v-model="form.waktu_selesai"
              type="datetime-local"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
        </div>
        <p
          class="text-[12px] text-[#777169] mt-4 bg-[#f0efed] p-3 rounded-lg border border-[#e7e5e4] flex items-center gap-2"
        >
          <svg class="w-5 h-5 text-[#f59e0b] shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span
            >Tombol <b>"Masuk Bilik Suara"</b> hanya bisa diakses oleh jemaat saat waktu
            komputer/server berada di antara jadwal di atas.</span
          >
        </p>
      </div>

      <!-- Card 3: Visibilitas & Publikasi -->
      <div class="bg-white p-6 md:p-8 rounded-[16px] border border-[#e7e5e4] shadow-sm">
        <h3 class="text-[18px] font-bold text-[#0c0a09] mb-6 border-b border-[#e7e5e4] pb-4">
          3. Pengaturan Tampilan Jemaat (Beranda Publik)
        </h3>
        <div class="space-y-6">
          <!-- Switch Aktifkan Portal -->
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-[15px] font-bold text-[#0c0a09]">Tampilkan Portal Voting di Web</h4>
              <p class="text-[13px] text-[#777169] mt-0.5 max-w-xl">
                Jika dimatikan, seluruh menu dan halaman "Voting Majelis" akan disembunyikan dari
                jemaat umum.
              </p>
            </div>
            <button
              type="button"
              @click="form.is_active = !form.is_active"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="form.is_active ? 'bg-[#166534]' : 'bg-[#d6d3d1]'"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="form.is_active ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>

          <!-- Switch Publikasi Hasil -->
          <div class="flex items-center justify-between pt-4 border-t border-[#f0efed]">
            <div>
              <h4 class="text-[15px] font-bold text-[#0c0a09]">Publikasikan Hasil (Live Count)</h4>
              <p class="text-[13px] text-[#777169] mt-0.5 max-w-xl">
                Hanya nyalakan ini jika jadwal pemilihan <b>sudah selesai/ditutup</b>. Jika
                dinyalakan, jemaat dapat melihat grafik hasil akhir di Beranda Voting.
              </p>
            </div>
            <button
              type="button"
              @click="form.is_result_published = !form.is_result_published"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="form.is_result_published ? 'bg-[#1e40af]' : 'bg-[#d6d3d1]'"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="form.is_result_published ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 mt-8">
        <button
          type="button"
          @click="loadData"
          class="px-6 py-2.5 text-[#4e4e4e] font-medium text-[14px] hover:bg-[#f5f5f5] rounded-full transition-colors border border-[#d6d3d1]"
        >
          Reset Perubahan
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-[#800000] text-[#ffffff] px-8 py-2.5 rounded-full text-[15px] font-bold hover:bg-[#500000] shadow-md disabled:opacity-50 transition-colors flex justify-center items-center min-w-[200px]"
        >
          <span v-if="!isSubmitting">Simpan Konfigurasi</span>
          <div v-else class="flex flex-row gap-1.5 justify-center items-center h-5">
            <div class="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
            <div
              class="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.3s]"
            ></div>
            <div
              class="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.5s]"
            ></div>
          </div>
        </button>
      </div>
    </form>

    <transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="transition duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl font-sans text-white z-[150] font-medium',
          toast.type === 'error' ? 'bg-[#dc2626]' : 'bg-[#16a34a]',
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const isSubmitting = ref(false)
const isEditing = ref(false)

const form = ref({
  id: 'conf_01',
  judul_pemilihan: '',
  deskripsi: '',
  is_active: false,
  waktu_mulai: '',
  waktu_selesai: '',
  is_result_published: false,
})

const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

// Mengubah format ISO Date ke format yang diterima oleh input datetime-local
const formatToDateTimeLocal = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  // Sesuaikan dengan Timezone Lokal
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const loadData = async () => {
  await store.fetchVotingConfig()
  const cfg = store.votingConfig
  if (cfg) {
    isEditing.value = true
    form.value.id = cfg.id || 'conf_01'
    form.value.judul_pemilihan = cfg.judul_pemilihan || cfg.nama_event || ''
    form.value.deskripsi = cfg.deskripsi || cfg.deskripsi_event || ''
    const activeVal = cfg.is_active
    form.value.is_active =
      activeVal === true || activeVal === 'TRUE' || String(activeVal).toLowerCase() === 'true'
    form.value.waktu_mulai = formatToDateTimeLocal(cfg.waktu_mulai)
    form.value.waktu_selesai = formatToDateTimeLocal(cfg.waktu_selesai)
    const pubVal = cfg.is_result_published
    form.value.is_result_published =
      pubVal === true || pubVal === 'TRUE' || String(pubVal).toLowerCase() === 'true'
  }
}

onMounted(() => {
  loadData()
})

const handleSave = async () => {
  isSubmitting.value = true
  try {
    // Array Payload harus sesuai dengan urutan Kolom di Spreadsheet (A - G)
    const payloadData = [
      form.value.id,
      form.value.judul_pemilihan,
      form.value.deskripsi,
      form.value.is_active,
      form.value.waktu_mulai ? new Date(form.value.waktu_mulai).toISOString() : '',
      form.value.waktu_selesai ? new Date(form.value.waktu_selesai).toISOString() : '',
      form.value.is_result_published,
    ]
    await store.submitGasAction(
      isEditing.value ? 'update' : 'insert',
      'tb_voting_config',
      payloadData,
      form.value.id,
    )
    await store.fetchVotingConfig()
    showToast('Konfigurasi berhasil disimpan!')
    isEditing.value = true
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
