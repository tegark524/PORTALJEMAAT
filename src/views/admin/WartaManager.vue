<template>
  <div>
    <!-- Header & Search -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h2 class="font-serif text-[32px] font-light text-[#0c0a09]">Kelola Warta</h2>
      <div class="flex gap-3 w-full md:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul warta..."
          class="flex-1 md:w-64 border border-[#d6d3d1] rounded-full px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
        />
        <button
          @click="openModal()"
          class="bg-[#800000] text-[#ffffff] px-5 py-2 rounded-full text-[15px] font-medium hover:bg-[#500000] shadow-md transition-all shrink-0"
        >
          + Tambah Warta
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white border border-[#e7e5e4] rounded-[16px] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#f0efed] text-[#777169] text-[12px] uppercase tracking-wider font-bold">
              <th class="p-4 border-b border-[#e7e5e4] w-32 whitespace-nowrap">Tanggal</th>
              <th class="p-4 border-b border-[#e7e5e4] min-w-[200px]">Judul</th>
              <th class="p-4 border-b border-[#e7e5e4] w-40">Kategori</th>
              <th class="p-4 border-b border-[#e7e5e4] w-24 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredWarta"
              :key="item.id"
              class="hover:bg-[#fafafa] transition-colors group"
            >
              <td
                class="p-4 border-b border-[#e7e5e4] text-[13px] text-[#4e4e4e] align-middle whitespace-nowrap"
              >
                {{ formatDisplayDate(item.tanggal || item.date) }}
              </td>
              <td class="p-4 border-b border-[#e7e5e4] align-middle">
                <div class="flex items-center gap-2">
                  <span class="text-[14px] font-bold text-[#0c0a09]">{{
                    item.judul || item.title
                  }}</span>
                  <span
                    v-if="
                      item.is_headline === true ||
                      item.is_headline === 'TRUE' ||
                      item.is_headline === 'true'
                    "
                    class="bg-[#fef08a] text-[#166534] px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase"
                    title="Warta Headline"
                  >
                    Headline
                  </span>
                </div>
              </td>
              <td class="p-4 border-b border-[#e7e5e4] align-middle">
                <span
                  v-if="item.kategori || item.category"
                  class="bg-[#f0efed] text-[#4e4e4e] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-[#d6d3d1] inline-block whitespace-nowrap"
                >
                  {{ item.kategori || item.category }}
                </span>
                <span v-else class="text-[13px] text-[#a8a29e] italic">-</span>
              </td>
              <td class="p-4 border-b border-[#e7e5e4] align-middle whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <button
                    @click="openModal(item)"
                    class="p-2 bg-[#f0efed] text-[#4e4e4e] hover:bg-[#e7e5e4] hover:text-[#800000] rounded-md transition-colors"
                    title="Edit Data"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    class="p-2 bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] hover:text-[#991b1b] rounded-md transition-colors"
                    title="Hapus Data"
                    :disabled="isDeleting === item.id"
                  >
                    <div
                      v-if="isDeleting === item.id"
                      class="flex flex-row gap-0.5 justify-center items-center w-4 h-4"
                    >
                      <div class="w-1 h-1 rounded-full bg-current animate-bounce"></div>
                      <div
                        class="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-.3s]"
                      ></div>
                      <div
                        class="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-.5s]"
                      ></div>
                    </div>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredWarta.length">
              <td colspan="4" class="p-8 text-center text-[#777169]">
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
                  <span class="text-[14px]">Memuat data warta...</span>
                </div>
                <span v-else>Data warta tidak ditemukan.</span>
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
        class="bg-white rounded-[16px] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
      >
        <h3 class="font-serif text-[24px] mb-6 text-[#0c0a09]">
          {{ isEdit ? 'Edit Warta' : 'Tambah Warta Baru' }}
        </h3>

        <form @submit.prevent="handleSave" class="space-y-4">
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
              <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Kategori</label>
              <input
                v-model="form.kategori"
                type="text"
                placeholder="Misal: Warta Umum"
                class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
              />
            </div>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Judul Warta</label>
            <input
              v-model="form.judul"
              type="text"
              required
              placeholder="Masukkan judul..."
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Isi Lengkap</label>
            <textarea
              v-model="form.isi"
              rows="6"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            ></textarea>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Upload Gambar Warta (Opsional)</label
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
              Jadikan Warta Headline
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
              class="bg-[#800000] text-[#ffffff] px-5 py-2 rounded-full text-[15px] font-medium hover:bg-[#500000] shadow-md disabled:opacity-50 transition-colors w-36 flex justify-center items-center"
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
import { ref, computed } from 'vue'
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
  tanggal: '',
  kategori: '',
  judul: '',
  isi: '',
  url_gambar: '',
  is_headline: false,
  created_at: '',
})

const filteredWarta = computed(() => {
  if (!searchQuery.value) return store.warta
  return store.warta.filter((w) =>
    (w.judul || w.title || '').toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

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

const resetForm = () => {
  form.value = {
    id: '',
    tanggal: new Date().toISOString().slice(0, 10),
    kategori: '',
    judul: '',
    isi: '',
    url_gambar: '',
    is_headline: false,
    created_at: '',
  }
  isEdit.value = false
  isUploading.value = false
}

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true
    // Pre-fill form if editing
    form.value = {
      id: item.id || '',
      tanggal: formatDate(item.tanggal || item.date),
      kategori: item.kategori || item.category || '',
      judul: item.judul || item.title || '',
      isi: item.isi || item.isi_lengkap || item.content || '',
      url_gambar: item.url_gambar || item.gambar || '',
      is_headline:
        item.is_headline === true || item.is_headline === 'TRUE' || item.is_headline === 'true',
      created_at: item.created_at || '',
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

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)

    // Mengambil API Key ImgBB dari .env
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
    )

    if (response.data && response.data.data && response.data.data.url) {
      // Simpan direct URL gambar dari ImgBB ke dalam form untuk di-save ke GAS
      form.value.url_gambar = response.data.data.url
      showToast('Gambar berhasil diunggah', 'success')
    }
  } catch (err) {
    showToast('Gagal mengunggah gambar.', 'error')
  } finally {
    isUploading.value = false
  }
}

const handleSave = async () => {
  isSubmitting.value = true
  try {
    const action = isEdit.value ? 'update' : 'insert'
    const rowId = isEdit.value ? form.value.id : Date.now().toString() // Generate unique ID if new
    const createdAt =
      isEdit.value && form.value.created_at ? form.value.created_at : new Date().toISOString()

    // Format sesuai payload array 2 dimensi untuk Spreadsheet (Google Apps Script)
    const payloadData = [
      rowId,
      form.value.tanggal,
      form.value.kategori,
      form.value.judul,
      form.value.isi,
      form.value.url_gambar,
      form.value.is_headline,
      createdAt,
    ]

    await store.submitGasAction(action, 'tb_warta', payloadData, rowId)
    showToast(`Data warta berhasil di${isEdit.value ? 'perbarui' : 'tambah'}.`)
    closeModal()
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Yakin ingin menghapus data warta ini? Tindakan ini tidak dapat dibatalkan.')) return
  isDeleting.value = id
  try {
    await store.submitGasAction('delete', 'tb_warta', null, id)
    showToast('Data berhasil dihapus.')
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isDeleting.value = null
  }
}
</script>
