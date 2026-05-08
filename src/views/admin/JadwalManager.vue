<template>
  <div>
    <!-- Header & Search -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h2 class="font-serif text-[32px] font-light text-[#0c0a09]">Kelola Jadwal Ibadah</h2>
      <div class="flex gap-2 sm:gap-3 w-full md:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama ibadah..."
          class="flex-1 md:w-64 border border-[#d6d3d1] rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[13px] sm:text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
        />
        <button
          @click="openModal()"
          class="bg-[#800000] text-[#ffffff] px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[13px] sm:text-[15px] font-medium hover:bg-[#500000] shadow-md transition-all shrink-0 whitespace-nowrap"
        >
          <span class="sm:hidden">+ Tambah</span>
          <span class="hidden sm:inline">+ Tambah Jadwal</span>
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white border border-[#e7e5e4] rounded-[16px] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-[#f0efed] text-[#777169] text-[10px] sm:text-[12px] uppercase tracking-wider font-bold"
            >
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-24 sm:w-32 whitespace-nowrap">
                Tanggal
              </th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] min-w-[120px] sm:min-w-[200px]">
                Nama Ibadah
              </th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-20 sm:w-28">Waktu</th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-32 sm:w-48">Lokasi</th>
              <th
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-20 sm:w-24 text-center whitespace-nowrap"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredJadwal"
              :key="item.id"
              class="hover:bg-[#fafafa] transition-colors group"
            >
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] text-xs sm:text-[13px] text-[#4e4e4e] align-middle whitespace-nowrap"
              >
                {{ formatDisplayDate(item.tanggal) }}
              </td>
              <td class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle">
                <div class="flex items-center gap-2">
                  <span class="text-xs sm:text-[14px] font-bold text-[#0c0a09]">{{
                    item.nama_ibadah || item.kategori
                  }}</span>
                  <span
                    v-if="
                      item.is_headline === true ||
                      item.is_headline === 'TRUE' ||
                      item.is_headline === 'true'
                    "
                    class="bg-[#fef08a] text-[#166534] px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase"
                    title="Jadwal Headline"
                  >
                    Headline
                  </span>
                </div>
              </td>
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-xs sm:text-[13px] text-[#4e4e4e] whitespace-nowrap"
              >
                {{ formatWaktu(item.waktu) }} WIB
              </td>
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-xs sm:text-[13px] text-[#4e4e4e]"
              >
                {{ item.lokasi }}
              </td>
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle whitespace-nowrap text-center"
              >
                <div class="flex justify-center gap-1.5 sm:gap-2">
                  <button
                    @click="openModal(item)"
                    class="p-1.5 sm:p-2 bg-[#f0efed] text-[#4e4e4e] hover:bg-[#e7e5e4] hover:text-[#800000] rounded-md transition-colors"
                    title="Edit Data"
                  >
                    <svg
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="handleDelete(item.id)"
                    class="bin-button"
                    title="Hapus Data"
                    :disabled="isDeleting === item.id"
                  >
                    <div
                      v-if="isDeleting === item.id"
                      class="flex flex-row gap-0.5 justify-center items-center w-full h-full"
                    >
                      <div class="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.3s]"
                      ></div>
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.5s]"
                      ></div>
                    </div>
                    <template v-else>
                      <svg
                        class="bin-top"
                        viewBox="0 0 39 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
                        <line
                          x1="12"
                          y1="1.5"
                          x2="26.0357"
                          y2="1.5"
                          stroke="white"
                          stroke-width="3"
                        ></line>
                      </svg>
                      <svg
                        class="bin-bottom"
                        viewBox="0 0 33 39"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask id="path-1-inside-1_8_19" fill="white">
                          <path
                            d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                          ></path>
                        </mask>
                        <path
                          d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                          fill="white"
                          mask="url(#path-1-inside-1_8_19)"
                        ></path>
                        <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
                        <path d="M21 6V29" stroke="white" stroke-width="4"></path>
                      </svg>
                    </template>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredJadwal.length">
              <td colspan="5" class="p-4 sm:p-8 text-center text-[#777169]">
                <div v-if="store.isLoading" class="flex flex-col items-center justify-center gap-3">
                  <div class="flex flex-row gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#800000] animate-bounce"></div>
                    <div
                      class="w-3 h-3 rounded-full bg-[#800000] animate-bounce [animation-delay:-.3s]"
                    ></div>
                    <div
                      class="w-3 h-3 rounded-full bg-[#800000] animate-bounce [animation-delay:-.5s]"
                    ></div>
                  </div>
                  <span class="text-[14px]">Memuat data jadwal...</span>
                </div>
                <span v-else>Data jadwal tidak ditemukan.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal (Create / Edit) -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0c0a09]/50 backdrop-blur-sm" @click="closeModal"></div>
      <div
        class="bg-white rounded-[16px] p-6 md:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
      >
        <h3 class="font-serif text-[24px] mb-6 text-[#0c0a09]">
          {{ isEdit ? 'Edit Jadwal' : 'Tambah Jadwal Baru' }}
        </h3>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Nama Ibadah</label>
            <select
              v-model="form.nama_ibadah_preset"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[16px] font-serif focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              :class="{ 'mb-3': form.nama_ibadah_preset === 'LAINNYA' }"
            >
              <option value="IBADAH MINGGU UMUM">IBADAH MINGGU UMUM</option>
              <option value="IBADAH ANAK & REMAJA">IBADAH ANAK & REMAJA</option>
              <option value="IBADAH KRW">IBADAH KRW</option>
              <option value="IBADAH ADHIYUSWA">IBADAH ADHIYUSWA</option>
              <option value="IBADAH KPPM">IBADAH KPPM</option>
              <option value="IBADAH KPPW">IBADAH KPPW</option>
              <option value="LAINNYA">LAINNYA (Tulis Bebas)</option>
            </select>
            <input
              v-if="form.nama_ibadah_preset === 'LAINNYA'"
              v-model="form.nama_ibadah_custom"
              type="text"
              required
              placeholder="Tulis nama ibadah atau event..."
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[16px] font-serif focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Tanggal</label>
              <input
                v-model="form.tanggal"
                type="date"
                required
                class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              />
            </div>
            <div>
              <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Waktu</label>
              <input
                v-model="form.waktu"
                type="time"
                required
                class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              />
            </div>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Lokasi</label>
            <input
              v-model="form.lokasi"
              type="text"
              required
              placeholder="Contoh: Gedung Gereja Induk"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Link Tautan (Opsional)</label
            >
            <input
              v-model="form.link"
              type="text"
              placeholder="Link Streaming / Zoom / Maps"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Keterangan</label>
            <textarea
              v-model="form.keterangan"
              rows="3"
              placeholder="Info pelayan firman, perjamuan, dsb"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] resize-y focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            ></textarea>
          </div>

          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Upload Gambar / Poster Jadwal (Opsional)</label
            >
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
            <div
              v-if="isUploading"
              class="text-[12px] text-[#f59e0b] mt-1 font-medium flex items-center gap-2"
            >
              <div class="flex flex-row gap-1">
                <div class="w-1 h-1 rounded-full bg-[#f59e0b] animate-bounce"></div>
                <div
                  class="w-1 h-1 rounded-full bg-[#f59e0b] animate-bounce [animation-delay:-.3s]"
                ></div>
                <div
                  class="w-1 h-1 rounded-full bg-[#f59e0b] animate-bounce [animation-delay:-.5s]"
                ></div>
              </div>
              Sedang mengunggah gambar...
            </div>
            <div
              v-if="form.url_gambar && !isUploading"
              class="text-[12px] text-[#16a34a] mt-1 font-medium"
            >
              Gambar berhasil disiapkan!
            </div>
          </div>

          <div class="flex items-center gap-2 mt-2">
            <input
              id="isHeadline"
              v-model="form.is_headline"
              type="checkbox"
              class="w-4 h-4 text-[#800000] bg-white border-[#d6d3d1] rounded focus:ring-[#800000]"
            />
            <label for="isHeadline" class="text-[13px] font-semibold text-[#4e4e4e] cursor-pointer">
              Jadikan Jadwal Headline
            </label>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2 text-[#4e4e4e] font-medium text-[14px] hover:bg-[#f5f5f5] rounded-full transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || isUploading"
              class="bg-[#800000] text-[#ffffff] px-5 py-2 rounded-full text-[15px] font-medium hover:bg-[#500000] disabled:opacity-50 transition-colors shadow-md w-36 flex justify-center items-center"
            >
              <div
                v-if="isSubmitting"
                class="flex flex-row gap-1.5 justify-center items-center h-6"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
                <div
                  class="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.3s]"
                ></div>
                <div
                  class="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.5s]"
                ></div>
              </div>
              <span v-else>Simpan Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
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
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const searchQuery = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const isUploading = ref(false)
const isDeleting = ref(null)

const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

const form = ref({
  id: '',
  nama_ibadah_preset: 'IBADAH MINGGU UMUM',
  nama_ibadah_custom: '',
  tanggal: '',
  waktu: '',
  lokasi: '',
  link: '',
  keterangan: '',
  is_headline: false,
  url_gambar: '',
})

onMounted(() => {
  const saved = localStorage.getItem('gkjw_jadwal_form')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.showModal) {
        form.value = parsed.form
        isEdit.value = parsed.isEdit
        showModal.value = parsed.showModal
      }
    } catch (e) {
      console.error('Error parsing saved form', e)
    }
  }
})

let debounceTimer = null
watch(
  [form, showModal, isEdit],
  ([newForm, newShowModal, newIsEdit]) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      localStorage.setItem(
        'gkjw_jadwal_form',
        JSON.stringify({
          form: newForm,
          showModal: newShowModal,
          isEdit: newIsEdit,
        }),
      )
    }, 500)
  },
  { deep: true },
)

const formatWaktu = (timeStr) => {
  if (!timeStr) return ''
  // Mengatasi offset LMT (Local Mean Time) Google Sheets pada tahun 1899 (+07:07:12)
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

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toISOString().split('T')[0]
  } catch (e) {
    return dateStr
  }
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch (e) {
    return dateStr
  }
}

const filteredJadwal = computed(() => {
  if (!searchQuery.value) return store.jadwal
  return store.jadwal.filter((j) =>
    (j.nama_ibadah || j.kategori || '').toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const resetForm = () => {
  form.value = {
    id: '',
    nama_ibadah_preset: 'IBADAH MINGGU UMUM',
    nama_ibadah_custom: '',
    tanggal: new Date().toISOString().slice(0, 10),
    waktu: '06:00',
    lokasi: '',
    link: '',
    keterangan: '',
    is_headline: false,
    url_gambar: '',
  }
  isEdit.value = false
  isUploading.value = false
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)

    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
    )

    if (response.data && response.data.data && response.data.data.url) {
      form.value.url_gambar = response.data.data.url
      showToast('Gambar poster jadwal berhasil diunggah', 'success')
    }
  } catch (err) {
    showToast('Gagal mengunggah gambar.', 'error')
  } finally {
    isUploading.value = false
  }
}

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true

    const existingName = item.nama_ibadah || item.kategori || item.category || ''
    const presets = [
      'IBADAH MINGGU UMUM',
      'IBADAH ANAK & REMAJA',
      'IBADAH ADHIYUSWA',
      'IBADAH KPPM',
      'IBADAH KPPW',
    ]
    let preset = 'LAINNYA'
    let custom = existingName

    const matchedPreset = presets.find((p) => p.toLowerCase() === existingName.toLowerCase())
    if (matchedPreset) {
      preset = matchedPreset
      custom = ''
    }

    form.value = {
      id: item.id,
      nama_ibadah_preset: preset,
      nama_ibadah_custom: custom,
      tanggal: formatDate(item.tanggal || item.date),
      waktu: formatWaktu(item.waktu || item.time || ''),
      lokasi: item.lokasi || item.location || '',
      link: item.link || '',
      keterangan: item.keterangan || item.description || '',
      is_headline:
        item.is_headline === true || item.is_headline === 'TRUE' || item.is_headline === 'true',
      url_gambar: item.url_gambar || item.gambar || '',
    }
  } else {
    resetForm()
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const handleSave = async () => {
  isSubmitting.value = true
  try {
    const action = isEdit.value ? 'update' : 'insert'
    const rowId = isEdit.value ? form.value.id : Date.now().toString()

    const finalNamaIbadah =
      form.value.nama_ibadah_preset === 'LAINNYA'
        ? form.value.nama_ibadah_custom
        : form.value.nama_ibadah_preset

    const payloadData = [
      rowId,
      finalNamaIbadah,
      form.value.tanggal,
      form.value.waktu,
      form.value.lokasi,
      form.value.link,
      form.value.keterangan,
      form.value.is_headline,
      form.value.url_gambar,
    ]
    await store.submitGasAction(action, 'tb_jadwal_ibadah', payloadData, rowId)
    showToast(`Data jadwal berhasil di${isEdit.value ? 'perbarui' : 'tambah'}.`)
    localStorage.removeItem('gkjw_jadwal_form')
    closeModal()
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Yakin ingin menghapus data jadwal ini?')) return
  isDeleting.value = id
  try {
    await store.submitGasAction('delete', 'tb_jadwal_ibadah', null, id)
    showToast('Data berhasil dihapus.')
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isDeleting.value = null
  }
}
</script>

<style scoped>
.bin-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: rgb(255, 95, 95);
  cursor: pointer;
  border: 2px solid rgb(255, 201, 201);
  transition-duration: 0.3s;
}
.bin-bottom {
  width: 11px;
}
.bin-top {
  width: 12px;
  transform-origin: right;
  transition-duration: 0.3s;
}
.bin-button:hover:not(:disabled) .bin-top {
  transform: rotate(45deg);
}
.bin-button:hover:not(:disabled) {
  background-color: rgb(255, 0, 0);
}
.bin-button:active:not(:disabled) {
  transform: scale(0.9);
}
.bin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
