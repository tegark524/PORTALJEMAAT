<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-2xl font-serif font-bold text-[#0c0a09]">Manajemen Pemilih</h1>
      <div class="flex gap-2 sm:gap-3 w-full sm:w-auto">
        <!-- Tombol Hapus Massal -->
        <button
          v-if="selectedVoters.length > 0"
          @click="handleMassDelete"
          :disabled="isDeletingMass"
          class="bg-[#dc2626] text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-bold hover:bg-[#991b1b] disabled:opacity-50 transition-colors flex flex-1 sm:flex-none justify-center items-center gap-1.5 sm:gap-2"
        >
          <div
            v-if="isDeletingMass"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
          <span v-else>
            <span class="sm:hidden">Hapus ({{ selectedVoters.length }})</span>
            <span class="hidden sm:inline">Hapus Terpilih ({{ selectedVoters.length }})</span>
          </span>
        </button>

        <button
          @click="showImportModal = true"
          class="bg-[#800000] text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-bold hover:bg-[#500000] transition-colors flex flex-1 sm:flex-none justify-center items-center gap-1.5 sm:gap-2 whitespace-nowrap"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            ></path>
          </svg>
          <span class="sm:hidden">Import</span>
          <span class="hidden sm:inline">Import Data (Excel)</span>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white p-3 sm:p-4 rounded-xl border border-[#e7e5e4] shadow-sm">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari ID atau Nama Jemaat..."
        class="w-full sm:max-w-md bg-[#fcfcfc] border border-[#e7e5e4] rounded-lg px-3 py-1.5 sm:px-4 sm:py-2.5 text-[13px] sm:text-[15px] focus:outline-none focus:border-[#800000]"
      />
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl border border-[#e7e5e4] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-[#f5f5f5] text-[#777169] text-[10px] sm:text-[12px] uppercase tracking-wider font-bold"
            >
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] w-10 sm:w-12 text-center">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#800000] border-[#d6d3d1] rounded focus:ring-[#800000] cursor-pointer"
                />
              </th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] whitespace-nowrap">
                ID Jemaat (NIK/NIJ)
              </th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] min-w-[120px]">Nama Lengkap</th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] text-center w-24 sm:w-auto">
                <span class="sm:hidden">Status</span>
                <span class="hidden sm:inline">Status Pemilihan</span>
              </th>
              <th class="px-2 py-3 sm:p-4 border-b border-[#e7e5e4] text-center w-20 sm:w-24">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="text-[#4e4e4e] text-xs sm:text-[14px]">
            <template v-if="store.isLoading && store.voters.length === 0">
              <tr v-for="i in 5" :key="'skel-' + i" class="animate-pulse border-b border-[#e7e5e4]">
                <td class="px-2 py-3 sm:p-4 text-center">
                  <div class="h-4 w-4 bg-[#e7e5e4] rounded mx-auto"></div>
                </td>
                <td class="px-2 py-3 sm:p-4"><div class="h-4 bg-[#e7e5e4] rounded w-24"></div></td>
                <td class="px-2 py-3 sm:p-4"><div class="h-4 bg-[#e7e5e4] rounded w-48"></div></td>
                <td class="px-2 py-3 sm:p-4">
                  <div class="h-6 bg-[#e7e5e4] rounded-full w-24 mx-auto"></div>
                </td>
                <td class="px-2 py-3 sm:p-4">
                  <div class="h-8 bg-[#e7e5e4] rounded w-16 mx-auto"></div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="voter in filteredVoters"
                :key="voter.id || voter.ID"
                class="hover:bg-[#fafafa] border-b border-[#e7e5e4] last:border-0"
              >
                <td class="px-2 py-3 sm:p-4 text-center">
                  <input
                    type="checkbox"
                    :value="voter.id || voter.ID"
                    v-model="selectedVoters"
                    class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#800000] border-[#d6d3d1] rounded focus:ring-[#800000] cursor-pointer"
                  />
                </td>
                <td class="px-2 py-3 sm:p-4 font-mono text-[#0c0a09] whitespace-nowrap">
                  {{ voter.id || voter.ID }}
                </td>
                <td class="px-2 py-3 sm:p-4 font-medium text-[#0c0a09]">
                  {{ voter.nama || voter.Nama }}
                </td>
                <td class="px-2 py-3 sm:p-4 text-center">
                  <span
                    class="px-2 sm:px-3 py-1 text-[10px] sm:text-[12px] font-bold rounded-full whitespace-nowrap"
                    :class="
                      hasVoted(voter)
                        ? 'bg-[#dcfce7] text-[#166534]'
                        : 'bg-[#f3f4f6] text-[#4b5563]'
                    "
                  >
                    {{ hasVoted(voter) ? 'Sudah Memilih' : 'Belum Memilih' }}
                  </span>
                </td>
                <td class="px-2 py-3 sm:p-4 text-center whitespace-nowrap">
                  <div class="flex justify-center gap-1.5 sm:gap-2">
                    <button
                      @click="openEditModal(voter)"
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
                      @click="handleDelete(voter.id || voter.ID)"
                      class="bin-button"
                      title="Hapus Data"
                      :disabled="isDeleting === (voter.id || voter.ID)"
                    >
                      <div
                        v-if="isDeleting === (voter.id || voter.ID)"
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
              <tr v-if="filteredVoters.length === 0">
                <td colspan="5" class="p-4 sm:p-8 text-center text-[#a8a29e]">
                  Tidak ada data pemilih ditemukan.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Bulk Import -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl relative">
        <h2 class="text-xl font-serif font-bold text-[#0c0a09] mb-2">Import Data Pemilih</h2>
        <p class="text-[14px] text-[#4e4e4e] mb-6">
          Copy data dari Excel (Kolom A: ID Jemaat, Kolom B: Nama Lengkap) dan Paste ke dalam kotak
          di bawah ini.
        </p>

        <textarea
          v-model="pasteData"
          rows="10"
          placeholder="1234567890   Budi Santoso&#10;0987654321   Siti Aminah"
          class="w-full bg-[#fcfcfc] border border-[#e7e5e4] rounded-lg p-4 font-mono text-[13px] whitespace-pre focus:outline-none focus:border-[#800000]"
        ></textarea>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="closeImportModal"
            class="px-5 py-2.5 rounded-lg text-sm font-bold text-[#4e4e4e] hover:bg-[#f5f5f5]"
          >
            Batal
          </button>
          <button
            @click="handleImport"
            :disabled="isImporting || !pasteData.trim()"
            class="bg-[#800000] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#500000] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <div
              v-if="isImporting"
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            <span>Mulai Import</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Edit Pemilih -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        <h2 class="text-xl font-serif font-bold text-[#0c0a09] mb-4">Edit Data Pemilih</h2>

        <form @submit.prevent="handleEditSave" class="space-y-4">
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >ID Jemaat (NIK/NIJ)</label
            >
            <input
              v-model="editForm.id"
              type="text"
              disabled
              class="w-full bg-[#f5f5f5] border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[14px] text-[#a8a29e] cursor-not-allowed focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Nama Lengkap</label>
            <input
              v-model="editForm.nama"
              type="text"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Status Pemilihan</label
            >
            <select
              v-model="editForm.sudah_memilih"
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            >
              <option :value="false">Belum Memilih</option>
              <option :value="true">Sudah Memilih</option>
            </select>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-5 py-2.5 rounded-lg text-sm font-bold text-[#4e4e4e] hover:bg-[#f5f5f5]"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSavingEdit"
              class="bg-[#800000] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#500000] disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <div
                v-if="isSavingEdit"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const searchQuery = ref('')
const showImportModal = ref(false)
const pasteData = ref('')
const isImporting = ref(false)
const selectedVoters = ref([])
const isDeleting = ref(null)
const isDeletingMass = ref(false)

const showEditModal = ref(false)
const isSavingEdit = ref(false)
const editForm = ref({ id: '', nama: '', sudah_memilih: false })

onMounted(() => {
  store.fetchVoters()

  const saved = localStorage.getItem('gkjw_voter_form')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.showImportModal) {
        pasteData.value = parsed.pasteData
        showImportModal.value = parsed.showImportModal
      }
      if (parsed.showEditModal) {
        editForm.value = parsed.editForm
        showEditModal.value = parsed.showEditModal
      }
    } catch (e) {
      console.error('Error parsing saved form', e)
    }
  }
})

let debounceTimer = null
watch(
  [showImportModal, pasteData, showEditModal, editForm],
  ([newShowImportModal, newPasteData, newShowEditModal, newEditForm]) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      localStorage.setItem(
        'gkjw_voter_form',
        JSON.stringify({
          showImportModal: newShowImportModal,
          pasteData: newPasteData,
          showEditModal: newShowEditModal,
          editForm: newEditForm,
        }),
      )
    }, 500)
  },
  { deep: true },
)

// Computed setter & getter untuk "Select All" checkbox
const selectAll = computed({
  get: () =>
    filteredVoters.value.length > 0 && selectedVoters.value.length === filteredVoters.value.length,
  set: (val) => {
    if (val) {
      selectedVoters.value = filteredVoters.value.map((v) => v.id || v.ID)
    } else {
      selectedVoters.value = []
    }
  },
})

const openEditModal = (voter) => {
  editForm.value = {
    id: String(voter.id || voter.ID),
    nama: voter.nama || voter.Nama,
    sudah_memilih: hasVoted(voter),
  }
  showEditModal.value = true
}

const handleEditSave = async () => {
  isSavingEdit.value = true
  try {
    // API Google Apps Script akan mencari ID ini dan mengganti datanya
    const payload = [editForm.value.id, editForm.value.nama, editForm.value.sudah_memilih]
    await store.submitGasAction('update', 'tb_voter', payload, editForm.value.id)
    localStorage.removeItem('gkjw_voter_form')
    await store.fetchVoters() // Refresh data
    showEditModal.value = false
  } catch (err) {
    alert('Gagal menyimpan data: ' + err.message)
  } finally {
    isSavingEdit.value = false
  }
}

const closeImportModal = () => {
  showImportModal.value = false
  pasteData.value = ''
}

// Standarisasi format field "sudah_memilih" / "status"
const hasVoted = (voter) => {
  const status = voter.sudah_memilih ?? voter['Sudah Memilih'] ?? voter.status ?? false
  return status === true || status === 'TRUE' || String(status).toLowerCase() === 'true'
}

const filteredVoters = computed(() => {
  if (!searchQuery.value) return store.voters
  const q = searchQuery.value.toLowerCase()
  return store.voters.filter((v) => {
    const id = String(v.id || v.ID || '')
    const nama = String(v.nama || v.Nama || '').toLowerCase()
    return id.includes(q) || nama.includes(q)
  })
})

const handleImport = async () => {
  if (!pasteData.value.trim()) return
  isImporting.value = true
  try {
    // Split baris dengan newline, lalu split kolom dengan tab (default format copy dari Excel)
    const rows = pasteData.value.split(/\r?\n/).filter((r) => r.trim())
    const payloadData = rows
      .map((r) => {
        const cols = r.split('\t')
        // Sesuai struktur GAS: [id, nama, status_memilih]
        return [cols[0]?.trim() || '', cols[1]?.trim() || 'Tanpa Nama', false]
      })
      .filter((row) => row[0]) // Pastikan kolom ID tidak kosong

    if (payloadData.length > 0) {
      await store.submitGasAction('bulk_insert', 'tb_voter', payloadData)
      localStorage.removeItem('gkjw_voter_form')
      await store.fetchVoters() // Refresh data
      showImportModal.value = false
      pasteData.value = ''
      alert(`${payloadData.length} Data Pemilih Berhasil Diimpor!`)
    }
  } catch (err) {
    alert('Gagal mengimpor data: ' + err.message)
  } finally {
    isImporting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Yakin ingin menghapus data pemilih ini?')) return
  isDeleting.value = id
  try {
    await store.submitGasAction('delete', 'tb_voter', null, id)
    // Jika yang dihapus ada di array yang diselect, kita singkirkan sekalian
    selectedVoters.value = selectedVoters.value.filter((vId) => vId !== id)
    await store.fetchVoters()
  } catch (err) {
    alert('Gagal menghapus data: ' + err.message)
  } finally {
    isDeleting.value = null
  }
}

const handleMassDelete = async () => {
  if (!confirm(`Yakin ingin menghapus ${selectedVoters.value.length} data pemilih yang dipilih?`))
    return
  isDeletingMass.value = true
  try {
    // Menghapus data secara berurutan agar tidak overload Google Apps Script Limits
    for (const id of selectedVoters.value) {
      await store.submitGasAction('delete', 'tb_voter', null, id)
    }
    alert(`${selectedVoters.value.length} data pemilih berhasil dihapus!`)
    selectedVoters.value = []
    await store.fetchVoters()
  } catch (err) {
    alert('Terjadi kesalahan saat menghapus beberapa data: ' + err.message)
    // Kita muat ulang tabel untuk memastikan record mana yang berhasil terhapus
    await store.fetchVoters()
  } finally {
    isDeletingMass.value = false
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
