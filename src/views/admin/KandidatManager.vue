<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h2 class="font-serif text-[32px] font-light text-[#0c0a09]">Kelola Kandidat</h2>
      <button
        @click="openModal()"
        class="bg-[#800000] text-[#ffffff] px-5 py-2 rounded-full text-[15px] font-medium hover:bg-[#500000] shadow-md transition-all shrink-0"
      >
        + Tambah Kandidat
      </button>
    </div>

    <div class="bg-white border border-[#e7e5e4] rounded-[16px] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#f0efed] text-[#777169] text-[12px] uppercase tracking-wider font-bold">
              <th class="p-4 border-b border-[#e7e5e4] w-20 text-center">Foto</th>
              <th class="p-4 border-b border-[#e7e5e4] w-48">Nama Kandidat</th>
              <th class="p-4 border-b border-[#e7e5e4] min-w-[200px]">Visi & Misi</th>
              <th class="p-4 border-b border-[#e7e5e4] w-24 text-center">Wilayah</th>
              <th class="p-4 border-b border-[#e7e5e4] w-24 text-center whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="store.isLoading && store.kandidat.length === 0">
              <tr v-for="i in 3" :key="'skel-' + i" class="animate-pulse border-b border-[#e7e5e4]">
                <td class="p-4 text-center">
                  <div class="h-12 w-12 bg-[#e7e5e4] rounded-full mx-auto"></div>
                </td>
                <td class="p-4"><div class="h-4 bg-[#e7e5e4] rounded w-32"></div></td>
                <td class="p-4">
                  <div class="h-4 bg-[#e7e5e4] rounded w-full max-w-md mb-2"></div>
                  <div class="h-4 bg-[#e7e5e4] rounded w-3/4 max-w-md"></div>
                </td>
                <td class="p-4"><div class="h-8 bg-[#e7e5e4] rounded w-16 mx-auto"></div></td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="item in store.kandidat"
                :key="item.id"
                class="hover:bg-[#fafafa] transition-colors group"
              >
                <td class="p-4 border-b border-[#e7e5e4] align-middle text-center">
                  <div
                    class="w-12 h-12 rounded-full bg-[#f0efed] border border-[#d6d3d1] mx-auto overflow-hidden shrink-0 flex items-center justify-center"
                  >
                    <img
                      v-if="item.url_foto || item.foto"
                      :src="item.url_foto || item.foto"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else
                      class="w-6 h-6 text-[#a8a29e]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </td>
                <td class="p-4 border-b border-[#e7e5e4] align-middle font-bold text-[#0c0a09]">
                  {{ item.nama }}
                </td>
                <td class="p-4 border-b border-[#e7e5e4] align-middle text-[13px] text-[#4e4e4e]">
                  <div class="line-clamp-2" :title="item.visi_misi">{{ item.visi_misi }}</div>
                </td>
                <td
                  class="p-4 border-b border-[#e7e5e4] align-middle text-center text-[13px] text-[#4e4e4e]"
                >
                  {{ item.region || item.wilayah || '-' }}
                </td>
                <td class="p-4 border-b border-[#e7e5e4] align-middle whitespace-nowrap">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="openModal(item)"
                      class="p-2 bg-[#f0efed] text-[#4e4e4e] hover:bg-[#e7e5e4] hover:text-[#800000] rounded-md transition-colors"
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
              <tr v-if="!store.kandidat.length">
                <td colspan="4" class="p-8 text-center text-[#777169]">
                  <span>Data kandidat belum ditambahkan.</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0c0a09]/50 backdrop-blur-sm" @click="closeModal"></div>
      <div
        class="bg-white rounded-[16px] p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
      >
        <h3 class="font-serif text-[24px] mb-6 text-[#0c0a09]">
          {{ isEdit ? 'Edit Kandidat' : 'Tambah Kandidat' }}
        </h3>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Nama Kandidat</label>
            <input
              v-model="form.nama"
              type="text"
              required
              placeholder="Nama lengkap..."
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1">Visi & Misi</label>
            <textarea
              v-model="form.visi_misi"
              rows="4"
              required
              placeholder="Tuliskan visi misi singkat..."
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            ></textarea>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Wilayah Kandidat</label
            >
            <select
              v-model="form.region"
              required
              class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
            >
              <option value="Wilayah 1">Wilayah 1</option>
              <option value="Wilayah 2">Wilayah 2</option>
            </select>
          </div>
          <div>
            <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-1"
              >Upload Foto (Opsional)</label
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
              Mengunggah...
            </div>
            <div
              v-if="form.url_foto && !isUploading"
              class="text-[12px] text-[#16a34a] mt-1 font-medium"
            >
              Gambar disiapkan!
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
              :disabled="isSubmitting || isUploading"
              class="bg-[#800000] text-[#ffffff] px-5 py-2 rounded-full text-[15px] font-medium hover:bg-[#500000] disabled:opacity-50 transition-colors w-36 flex justify-center items-center"
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
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>

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
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const showModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const isUploading = ref(false)
const isDeleting = ref(null)

const form = ref({ id: '', nama: '', visi_misi: '', region: 'Wilayah 1', url_foto: '' })
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

onMounted(() => {
  store.fetchKandidat()

  const saved = localStorage.getItem('gkjw_kandidat_form')
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
        'gkjw_kandidat_form',
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

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true
    form.value = {
      ...item,
      url_foto: item.url_foto || item.foto || '',
      region: item.region || item.wilayah || 'Wilayah 1',
    }
  } else {
    isEdit.value = false
    form.value = { id: '', nama: '', visi_misi: '', region: 'Wilayah 1', url_foto: '' }
    isUploading.value = false
  }
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      formData,
    )
    if (response.data?.data?.url) {
      form.value.url_foto = response.data.data.url
      showToast('Foto diunggah', 'success')
    }
  } catch (err) {
    showToast('Gagal mengunggah foto.', 'error')
  } finally {
    isUploading.value = false
  }
}

const handleSave = async () => {
  isSubmitting.value = true
  try {
    const rowId = isEdit.value ? form.value.id : `KND-${Date.now()}`
    const payload = [
      rowId,
      form.value.nama,
      form.value.visi_misi,
      form.value.url_foto,
      form.value.region,
    ]
    await store.submitGasAction(isEdit.value ? 'update' : 'insert', 'tb_kandidat', payload, rowId)
    await store.fetchKandidat()
    showToast(`Berhasil disave.`)
    localStorage.removeItem('gkjw_kandidat_form')
    closeModal()
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Yakin hapus?')) return
  isDeleting.value = id
  try {
    await store.submitGasAction('delete', 'tb_kandidat', null, id)
    await store.fetchKandidat()
    showToast('Berhasil dihapus.')
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
