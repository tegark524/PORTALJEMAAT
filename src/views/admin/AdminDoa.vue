<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h2 class="font-serif text-[32px] font-light text-[#0c0a09]">Moderasi Doa</h2>
      <div class="flex gap-3 w-full md:w-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pengirim atau pesan..."
          class="flex-1 md:w-64 border border-[#d6d3d1] rounded-full px-4 py-2 text-[14px] focus:outline-none focus:border-[#292524]"
        />
        <button
          @click="openModal()"
          class="bg-[#800000] text-[#ffffff] px-5 py-2 rounded-full text-[15px] font-medium hover:bg-[#500000] shadow-md transition-all shrink-0"
        >
          + Tambah Doa
        </button>
      </div>
    </div>

    <div class="bg-white border border-[#e7e5e4] rounded-[16px] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#f0efed] text-[#777169] text-[12px] uppercase tracking-wider font-bold">
              <th class="p-4 border-b border-[#e7e5e4] w-28 whitespace-nowrap">Waktu</th>
              <th class="p-4 border-b border-[#e7e5e4] w-48">Pengirim</th>
              <th class="p-4 border-b border-[#e7e5e4] w-40">Layanan</th>
              <th class="p-4 border-b border-[#e7e5e4] min-w-[200px]">Pesan</th>
              <th class="p-4 border-b border-[#e7e5e4] w-32 text-center">Tindak Lanjut</th>
              <th class="p-4 border-b border-[#e7e5e4] w-24 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredDoa"
              :key="item.id"
              class="hover:bg-[#fafafa] transition-colors group"
            >
              <td
                class="p-4 border-b border-[#e7e5e4] text-[13px] text-[#4e4e4e] align-middle whitespace-nowrap"
              >
                {{ formatDisplayDate(item.timestamp || item.tanggal || item.date) }}
              </td>
              <td class="p-4 border-b border-[#e7e5e4] align-middle">
                <div class="flex items-center gap-2">
                  <span class="text-[14px] font-bold text-[#0c0a09]">{{
                    item.nama || item.name || 'Anonim'
                  }}</span>
                  <span
                    v-if="
                      item.izin_publik === true ||
                      item.izin_publik === 'TRUE' ||
                      String(item.izin_publik).toLowerCase() === 'true'
                    "
                    class="bg-[#dcfce7] text-[#166534] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    title="Diizinkan tampil di Tembok Doa"
                  >
                    Publik
                  </span>
                </div>
                <div
                  v-if="item.no_wa && item.no_wa !== '-'"
                  class="text-[12px] text-[#777169] mt-0.5 font-mono"
                >
                  {{ item.no_wa }}
                </div>
              </td>
              <td class="p-4 border-b border-[#e7e5e4] align-middle">
                <span
                  class="bg-[#f0efed] text-[#4e4e4e] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border border-[#d6d3d1] inline-block whitespace-nowrap"
                  >{{ item.jenis_layanan || 'Permohonan Doa' }}</span
                >
              </td>
              <td class="p-4 border-b border-[#e7e5e4] align-middle">
                <div
                  class="text-[14px] text-[#4e4e4e] line-clamp-2 min-w-[200px]"
                  :title="item.pesan || item.isi_doa"
                >
                  {{ item.pesan || item.isi_doa || item.content }}
                </div>
              </td>
              <td class="p-4 border-b border-[#e7e5e4] align-middle text-center">
                <button
                  @click="toggleStatus(item)"
                  class="px-4 py-1.5 rounded-full font-bold uppercase tracking-wide text-[10px] transition-colors w-20 text-center"
                  :class="
                    item.status === 'Sudah Ditangani'
                      ? 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]'
                      : 'bg-[#fce7e7] text-[#800000] hover:bg-[#fad4d4]'
                  "
                  :disabled="isUpdating === item.id"
                >
                  <div
                    v-if="isUpdating === item.id"
                    class="flex flex-row gap-1 justify-center items-center h-3.5"
                  >
                    <div class="w-1 h-1 rounded-full bg-current animate-bounce"></div>
                    <div
                      class="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-.3s]"
                    ></div>
                    <div
                      class="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-.5s]"
                    ></div>
                  </div>
                  <span v-else>{{ item.status === 'Sudah Ditangani' ? 'Selesai' : 'Belum' }}</span>
                </button>
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
                    @click="deleteDoa(item.id)"
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
            <tr v-if="!filteredDoa.length">
              <td colspan="6" class="p-8 text-center text-[#777169]">
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
                  <span class="text-[14px]">Memuat data doa...</span>
                </div>
                <span v-else>Belum ada permohonan doa.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah Doa Mandiri -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0c0a09]/50 backdrop-blur-sm" @click="closeModal"></div>
      <div
        class="bg-white rounded-[16px] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
      >
        <h3 class="font-serif text-[24px] mb-6 text-[#0c0a09]">
          {{ isEdit ? 'Edit Data Doa' : 'Tambah Doa ke Tembok Publik' }}
        </h3>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div v-if="isEdit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
                >Nama Pengirim</label
              >
              <input
                v-model="form.nama"
                type="text"
                disabled
                class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none disabled:bg-[#f5f5f5] disabled:text-[#a8a29e]"
              />
            </div>
            <div>
              <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
                >No. WhatsApp</label
              >
              <input
                v-model="form.no_wa"
                type="text"
                disabled
                class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none disabled:bg-[#f5f5f5] disabled:text-[#a8a29e]"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="isEdit">
              <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
                >Jenis Layanan</label
              >
              <input
                v-model="form.jenis_layanan"
                type="text"
                disabled
                class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none disabled:bg-[#f5f5f5] disabled:text-[#a8a29e]"
              />
            </div>
            <div :class="{ 'md:col-span-2': !isEdit }">
              <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
                >Status Penanganan</label
              >
              <select
                v-model="form.status"
                class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000]"
              >
                <option value="Belum Ditangani">Belum Ditangani</option>
                <option value="Sudah Ditangani">Sudah Ditangani</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Pesan / Pokok Doa</label
            >
            <textarea
              v-model="form.pesan"
              rows="4"
              :disabled="isEdit"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] resize-y focus:outline-none focus:border-[#800000] disabled:bg-[#f5f5f5] disabled:text-[#a8a29e]"
              required
              :placeholder="!isEdit ? 'Tuliskan permohonan doa dari Majelis...' : ''"
            ></textarea>
          </div>

          <div class="mt-4 p-5 bg-[#f5f5f5] rounded-xl border border-[#e7e5e4] flex flex-col gap-5">
            <!-- Izin Publik (Hanya Muncul Saat Edit) -->
            <div v-if="isEdit" class="flex items-center justify-between">
              <div>
                <h4 class="text-[14px] font-bold text-[#0c0a09]">Izin Publik (Dari Pengirim)</h4>
                <p class="text-[12px] text-[#777169] mt-0.5">
                  Kesediaan pengirim agar doa tampil di Tembok Doa.
                </p>
              </div>
              <div
                class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                :class="
                  form.izin_publik ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#dc2626]'
                "
              >
                {{ form.izin_publik ? 'Diizinkan' : 'Tidak Diizinkan' }}
              </div>
            </div>

            <div v-if="isEdit" class="h-px w-full bg-[#e7e5e4]"></div>

            <!-- Toggle On Air -->
            <div
              class="flex items-center justify-between"
              :class="{ 'opacity-50': isEdit && !form.izin_publik }"
            >
              <div>
                <h4 class="text-[14px] font-bold text-[#0c0a09]">Status On Air</h4>
                <p class="text-[12px] text-[#777169] mt-0.5">
                  Tampilkan doa ini di Tembok Doa web.
                  <span
                    v-if="isEdit && !form.izin_publik"
                    class="text-[#dc2626] font-semibold block sm:inline"
                  >
                    Terkunci (Ditolak Pengirim)
                  </span>
                </p>
              </div>
              <button
                type="button"
                @click="(!isEdit || form.izin_publik) && (form.is_on_air = !form.is_on_air)"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed"
                :class="
                  form.is_on_air && (!isEdit || form.izin_publik) ? 'bg-[#1e40af]' : 'bg-[#d6d3d1]'
                "
                :disabled="isEdit && !form.izin_publik"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="
                    form.is_on_air && (!isEdit || form.izin_publik)
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  "
                ></span>
              </button>
            </div>
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
import { ref, computed } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const searchQuery = ref('')
const isUpdating = ref(null)
const showModal = ref(false)
const isSubmitting = ref(false)
const isEdit = ref(false)
const isDeleting = ref(null)

const form = ref({
  id: '',
  timestamp: '',
  nama: 'Majelis Jemaat',
  no_wa: '-',
  jenis_layanan: 'Permohonan Doa',
  pesan: '',
  status: 'Sudah Ditangani',
  is_on_air: true,
  izin_publik: true,
})

const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => (toast.value.show = false), 3000)
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
    timestamp: new Date().toISOString(),
    nama: 'Majelis Jemaat',
    no_wa: '-',
    jenis_layanan: 'Permohonan Doa',
    pesan: '',
    status: 'Sudah Ditangani',
    is_on_air: true,
    izin_publik: true,
  }
  isEdit.value = false
}

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true
    form.value = {
      id: item.id,
      timestamp: item.timestamp || item.tanggal || item.date || new Date().toISOString(),
      nama: item.nama || item.name || '',
      no_wa: item.no_wa || '-',
      jenis_layanan: item.jenis_layanan || 'Permohonan Doa',
      pesan: item.pesan || item.isi_doa || item.content || '',
      status: item.status || 'Belum Ditangani',
      is_on_air:
        item.is_on_air === true ||
        item.is_on_air === 'TRUE' ||
        String(item.is_on_air).toLowerCase() === 'true',
      izin_publik:
        item.izin_publik === true ||
        item.izin_publik === 'TRUE' ||
        String(item.izin_publik).toLowerCase() === 'true',
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

const filteredDoa = computed(() => {
  if (!searchQuery.value) return store.doa
  return store.doa.filter((d) =>
    (d.nama || d.pesan || d.isi_doa || d.jenis_layanan || '')
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase()),
  )
})

const toggleStatus = async (item) => {
  isUpdating.value = item.id
  try {
    const newStatus = item.status === 'Sudah Ditangani' ? 'Belum Ditangani' : 'Sudah Ditangani'
    const payload = [
      item.id,
      item.timestamp || item.tanggal || new Date().toISOString(),
      item.nama || 'Anonim',
      item.no_wa || '-',
      item.jenis_layanan || 'Permohonan Doa',
      item.pesan || item.isi_doa,
      newStatus,
      item.is_on_air || false,
      item.izin_publik || false,
    ]
    await store.submitGasAction('update', 'tb_request', payload, item.id)
    showToast(`Status penanganan diubah menjadi: ${newStatus}.`)
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isUpdating.value = null
  }
}

const handleSave = async () => {
  isSubmitting.value = true
  try {
    const action = isEdit.value ? 'update' : 'insert'
    const rowId = isEdit.value ? form.value.id : Date.now().toString()
    const payloadData = [
      rowId,
      form.value.timestamp || new Date().toISOString(),
      isEdit.value ? form.value.nama || 'Anonim' : 'Majelis Jemaat',
      isEdit.value ? form.value.no_wa || '-' : '-',
      isEdit.value ? form.value.jenis_layanan || 'Permohonan Doa' : 'Permohonan Doa',
      form.value.pesan,
      form.value.status || 'Belum Ditangani',
      form.value.is_on_air || false,
      isEdit.value ? form.value.izin_publik || false : true,
    ]
    await store.submitGasAction(action, 'tb_request', payloadData, rowId)
    showToast(
      isEdit.value
        ? 'Data doa berhasil diperbarui.'
        : 'Pokok doa berhasil ditambahkan ke Tembok Publik.',
    )
    closeModal()
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const deleteDoa = async (id) => {
  if (!confirm('Yakin ingin menghapus permohonan doa ini?')) return
  isDeleting.value = id
  try {
    await store.submitGasAction('delete', 'tb_request', null, id)
    showToast('Permohonan doa dihapus.')
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isDeleting.value = null
  }
}
</script>
