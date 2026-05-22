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
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-20 sm:w-28 text-center whitespace-nowrap">
                Notifikasi
              </th>
              <th
                class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-20 sm:w-24 text-center whitespace-nowrap"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="store.isLoading && store.renungan.length === 0">
              <tr v-for="i in 5" :key="'skel-' + i" class="animate-pulse border-b border-[#e7e5e4]">
                <td class="px-2 py-3 sm:p-4"><div class="h-4 bg-[#e7e5e4] rounded w-24"></div></td>
                <td class="px-2 py-3 sm:p-4"><div class="h-4 bg-[#e7e5e4] rounded w-48"></div></td>
                <td class="px-2 py-3 sm:p-4"><div class="h-4 bg-[#e7e5e4] rounded w-32"></div></td>
                <td class="px-2 py-3 sm:p-4"><div class="h-4 bg-[#e7e5e4] rounded w-24"></div></td>
                <td class="px-2 py-3 sm:p-4"><div class="h-4 bg-[#e7e5e4] rounded w-16 mx-auto"></div></td>
                <td class="px-2 py-3 sm:p-4">
                  <div class="h-8 bg-[#e7e5e4] rounded w-16 mx-auto"></div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="item in sortedRenungan"
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
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span>{{ item.judul || item.tema || item.title }}</span>
                    <span
                      v-if="item.tipe_renungan === 'REKAT'"
                      class="bg-[#ffedd5] text-[#c2410c] px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0"
                    >
                      Rekat
                    </span>
                    <span
                      v-if="item.tipe_renungan === 'PENGHARAPAN'"
                      class="bg-[#dbeafe] text-[#1d4ed8] px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0"
                    >
                      Hidup dalam Pengharapan
                    </span>
                    <span
                      v-if="item.tipe_renungan !== 'REKAT' && item.tipe_renungan !== 'PENGHARAPAN'"
                      class="bg-[#f3f4f6] text-[#374151] px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 border border-[#e5e7eb]"
                    >
                      {{ formatLainnyaShort(item.tipe_renungan) }}
                    </span>
                  </div>
                </td>
                <td
                  class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-xs sm:text-[13px] text-[#4e4e4e] italic"
                >
                  {{ item.nats || '-' }}
                </td>
                <td
                  class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-xs sm:text-[13px] text-[#4e4e4e]"
                >
                  {{ item.penulis || '-' }}
                </td>
                <td
                  class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] align-middle text-center whitespace-nowrap"
                >
                  <span
                    v-if="item.status_notif === 'SUDAH' || item.status_notif === 'true' || item.status_notif === true"
                    class="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0"
                  >
                    ✓ Terkirim
                  </span>
                  <span
                    v-else
                    class="bg-[#f3f4f6] text-[#4b5563] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0"
                  >
                    ⏳ Menunggu
                  </span>
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
              <tr v-if="!store.renungan.length">
                <td colspan="5" class="p-4 sm:p-8 text-center text-[#777169]">
                  <span>Data renungan tidak ditemukan.</span>
                </td>
              </tr>
            </template>
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
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Nats (Referensi singkat)</label
            >
            <input
              v-model="form.nats"
              type="text"
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
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Kategori / Waktu Tayang</label>
            <select
              v-model="form.tipe_renungan"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            >
              <option value="REKAT">REKAT (Otomatis pukul 05:00 Pagi)</option>
              <option value="PENGHARAPAN">Hidup dalam Pengharapan (Otomatis pukul 21:00 Malam)</option>
              <option value="LAINNYA_CUSTOM">Lainnya (bisa pilih jam tayang)</option>
            </select>
          </div>
          <div v-if="form.tipe_renungan === 'LAINNYA_CUSTOM'">
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Pilih Jam Tayang Custom</label>
            <select
              v-model="form.jam_custom"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            >
              <option v-for="h in 24" :key="h" :value="formatHourOption(h - 1)">
                Pukul {{ formatHourOption(h - 1) }}
              </option>
            </select>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const showModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(null)

const sortedRenungan = computed(() => {
  return [...store.renungan].sort((a, b) => {
    const dateA = new Date(a.tanggal_tayang || a.date || a.tanggal || 0)
    const dateB = new Date(b.tanggal_tayang || b.date || b.tanggal || 0)
    return dateB - dateA
  })
})

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
  tipe_renungan: 'LAINNYA_CUSTOM',
  jam_custom: '06:00',
  status_notif: 'BELUM',
  created_at: '',
})

onMounted(async () => {
  const saved = localStorage.getItem('gkjw_renungan_form')
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
        'gkjw_renungan_form',
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

const formatHourOption = (hour) => {
  const hStr = String(hour).padStart(2, '0')
  return `${hStr}:00`
}

const formatLainnyaShort = (tipe) => {
  if (!tipe) return ''
  if (tipe === 'UMUM') return 'Lainnya (06:00)'
  if (tipe === 'FOKUS') return 'Lainnya (12:00)'
  if (tipe === 'KELUARGA') return 'Lainnya (18:00)'
  
  if (tipe.startsWith('LAINNYA')) {
    const parts = tipe.split(' - ')
    const time = parts[1] || '06:00'
    return `Lainnya (${time})`
  }
  return tipe
}

const resetForm = () => {
  form.value = {
    id: '',
    tanggal_tayang: new Date().toISOString().slice(0, 10),
    judul: '',
    nats: '',
    isi_renungan: '',
    penulis: '',
    tipe_renungan: 'LAINNYA_CUSTOM',
    jam_custom: '06:00',
    status_notif: 'BELUM',
    created_at: '',
  }
  isEdit.value = false
}

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true
    let tipeVal = item.tipe_renungan || 'LAINNYA - 06:00'
    let jamVal = '08:00'
    
    if (tipeVal === 'REKAT' || tipeVal === 'PENGHARAPAN') {
      // Keep as is
    } else if (tipeVal === 'UMUM' || tipeVal === 'LAINNYA - 06:00' || tipeVal === 'LAINNYA_PAGI') {
      tipeVal = 'LAINNYA_CUSTOM'
      jamVal = '06:00'
    } else if (tipeVal === 'FOKUS' || tipeVal === 'LAINNYA - 12:00' || tipeVal === 'LAINNYA_SIANG') {
      tipeVal = 'LAINNYA_CUSTOM'
      jamVal = '12:00'
    } else if (tipeVal === 'KELUARGA' || tipeVal === 'LAINNYA - 18:00' || tipeVal === 'LAINNYA_SORE') {
      tipeVal = 'LAINNYA_CUSTOM'
      jamVal = '18:00'
    } else if (tipeVal.startsWith('LAINNYA')) {
      const parts = tipeVal.split(' - ')
      tipeVal = 'LAINNYA_CUSTOM'
      jamVal = parts[1] || '08:00'
    } else {
      tipeVal = 'LAINNYA_CUSTOM'
      jamVal = '08:00'
    }

    form.value = {
      id: item.id,
      tanggal_tayang: formatDate(item.tanggal_tayang || item.date || item.tanggal),
      judul: item.judul || item.tema || item.title || '',
      nats: item.nats || '',
      isi_renungan: item.isi_renungan || item.isi || item.content || '',
      penulis: item.penulis || '',
      tipe_renungan: tipeVal,
      jam_custom: jamVal,
      status_notif: item.status_notif || 'BELUM',
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

    let finalTipe = form.value.tipe_renungan
    if (finalTipe === 'LAINNYA_PAGI') {
      finalTipe = 'LAINNYA - 06:00'
    } else if (finalTipe === 'LAINNYA_SIANG') {
      finalTipe = 'LAINNYA - 12:00'
    } else if (finalTipe === 'LAINNYA_SORE') {
      finalTipe = 'LAINNYA - 18:00'
    } else if (finalTipe === 'LAINNYA_CUSTOM') {
      finalTipe = `LAINNYA - ${form.value.jam_custom}`
    }

    // Strict Mapping Array: A-I
    const payloadData = [
      rowId, // A: id
      form.value.tanggal_tayang, // B: tanggal_tayang
      form.value.judul, // C: judul
      form.value.nats, // D: nats
      form.value.isi_renungan, // E: isi_renungan
      form.value.penulis, // F: penulis
      createdAt, // G: created_at
      finalTipe, // H: tipe_renungan
      form.value.status_notif, // I: status_notif
    ]

    await store.submitGasAction(action, 'tb_renungan', payloadData, rowId)
    showToast(`Data renungan berhasil di${isEdit.value ? 'perbarui' : 'tambah'}.`)
    localStorage.removeItem('gkjw_renungan_form')
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
