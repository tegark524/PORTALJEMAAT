<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h2 class="font-serif text-[32px] font-light text-[#0c0a09]">Kelola Renungan</h2>
      <div class="flex w-full sm:w-auto justify-end">
        <button
          @click="openModal()"
          class="bg-[#800000] text-[#ffffff] px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[13px] sm:text-[15px] font-medium hover:bg-[#500000] shadow-md transition-all shrink-0 whitespace-nowrap"
        >
          <span class="sm:hidden">+ Tambah</span>
          <span class="hidden sm:inline">+ Tambah Renungan</span>
        </button>
      </div>
    </div>

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
                Judul
              </th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-32 sm:w-48">Nats</th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-24 sm:w-40">Penulis</th>
              <th
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-20 sm:w-24 text-center whitespace-nowrap"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in store.renungan"
              :key="item.id"
              class="hover:bg-[#fafafa] transition-colors group"
            >
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] text-xs sm:text-[13px] text-[#4e4e4e] align-middle whitespace-nowrap"
              >
                {{ formatDisplayDate(item.tanggal_tayang || item.date || item.tanggal) }}
              </td>
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-xs sm:text-[14px] font-bold text-[#0c0a09]"
              >
                {{ item.judul || item.tema || item.title }}
              </td>
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-xs sm:text-[13px] text-[#4e4e4e] italic"
              >
                {{ item.nats }}
              </td>
              <td
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-xs sm:text-[13px] text-[#4e4e4e]"
              >
                {{ item.penulis || '-' }}
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
                    class="p-1.5 sm:p-2 bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca] hover:text-[#991b1b] rounded-md transition-colors"
                    title="Hapus Data"
                    :disabled="isDeleting === item.id"
                  >
                    <div
                      v-if="isDeleting === item.id"
                      class="flex flex-row gap-0.5 justify-center items-center w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
            <tr v-if="!store.renungan.length">
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
                  <span class="text-[14px]">Memuat data renungan...</span>
                </div>
                <span v-else>Data renungan tidak ditemukan.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0c0a09]/50 backdrop-blur-sm" @click="closeModal"></div>
      <div
        class="bg-white rounded-[16px] p-6 md:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
      >
        <h3 class="font-serif text-[24px] mb-6 text-[#0c0a09]">
          {{ isEdit ? 'Edit Renungan' : 'Tambah Renungan Baru' }}
        </h3>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Tanggal Tayang</label
            >
            <input
              v-model="form.tanggal_tayang"
              type="date"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Judul Renungan</label
            >
            <input
              v-model="form.judul"
              type="text"
              required
              placeholder="Masukkan judul renungan..."
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[16px] font-serif focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Nats (Ayat)</label>
            <input
              v-model="form.nats"
              type="text"
              required
              placeholder="Contoh: Matius 5:1-12"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] italic focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Isi Renungan</label>
            <textarea
              v-model="form.isi_renungan"
              rows="10"
              required
              placeholder="Ketik detail isi renungan atau khotbah di sini..."
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] resize-y focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            ></textarea>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Penulis</label>
            <input
              v-model="form.penulis"
              type="text"
              placeholder="Nama penulis (Opsional)"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
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
              :disabled="isSubmitting"
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
import { ref } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const showModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(null)

const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

const form = ref({
  id: '',
  tanggal_tayang: '',
  judul: '',
  nats: '',
  isi_renungan: '',
  penulis: '',
  created_at: '',
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
    tanggal_tayang: new Date().toISOString().slice(0, 10),
    judul: '',
    nats: '',
    isi_renungan: '',
    penulis: '',
    created_at: '',
  }
  isEdit.value = false
}

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true
    form.value = {
      id: item.id,
      tanggal_tayang: formatDate(item.tanggal_tayang || item.date || item.tanggal),
      judul: item.judul || item.tema || item.title || '',
      nats: item.nats || '',
      isi_renungan: item.isi_renungan || item.isi || item.content || '',
      penulis: item.penulis || '',
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

const handleSave = async () => {
  isSubmitting.value = true
  try {
    const action = isEdit.value ? 'update' : 'insert'
    const rowId = isEdit.value ? form.value.id : Date.now().toString()
    const createdAt =
      isEdit.value && form.value.created_at ? form.value.created_at : new Date().toISOString()

    // Strict Mapping Array: A-G
    const payloadData = [
      rowId, // A: id
      form.value.tanggal_tayang, // B: tanggal_tayang
      form.value.judul, // C: judul
      form.value.nats, // D: nats
      form.value.isi_renungan, // E: isi_renungan
      form.value.penulis, // F: penulis
      createdAt, // G: created_at
    ]

    await store.submitGasAction(action, 'tb_renungan', payloadData, rowId)
    showToast(`Data renungan berhasil di${isEdit.value ? 'perbarui' : 'tambah'}.`)
    closeModal()
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Yakin ingin menghapus data renungan ini?')) return
  isDeleting.value = id
  try {
    await store.submitGasAction('delete', 'tb_renungan', null, id)
    showToast('Data berhasil dihapus.')
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isDeleting.value = null
  }
}
</script>
