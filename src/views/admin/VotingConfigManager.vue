<template>
  <div>
    <h2 class="font-serif text-[32px] font-light text-[#0c0a09] mb-8">Konfigurasi Voting</h2>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-[#e7e5e4] max-w-2xl">
      <form @submit.prevent="handleSave" class="space-y-6">
        <div
          class="flex items-center justify-between bg-[#f5f5f5] p-5 rounded-lg border border-[#d6d3d1]"
        >
          <div>
            <h4 class="font-bold text-[#0c0a09] text-[15px]">Status Event Pemilihan</h4>
            <p class="text-[13px] text-[#777169] mt-1">
              Saat aktif, seluruh menu manajemen voting bisa diakses dan bilik suara muncul di
              website jemaat.
            </p>
          </div>
          <button
            type="button"
            @click="form.is_active = !form.is_active"
            class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="form.is_active ? 'bg-[#16a34a]' : 'bg-[#d6d3d1]'"
          >
            <span
              class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="form.is_active ? 'translate-x-5' : 'translate-x-0'"
            ></span>
          </button>
        </div>

        <div>
          <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-2">Judul Pemilihan</label>
          <input
            v-model="form.judul_pemilihan"
            type="text"
            required
            placeholder="Contoh: Pemilihan Majelis 2026-2029"
            class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
          />
        </div>

        <div>
          <label class="block text-[13px] font-semibold text-[#4e4e4e] mb-2"
            >Deskripsi / Instruksi</label
          >
          <textarea
            v-model="form.deskripsi"
            rows="4"
            placeholder="Penjelasan singkat untuk jemaat..."
            class="w-full border border-[#d6d3d1] rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]"
          ></textarea>
        </div>

        <div class="pt-4 border-t border-[#e7e5e4] flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-[#800000] text-white px-8 py-3 rounded-full font-bold text-[15px] hover:bg-[#500000] transition-colors flex items-center justify-center"
          >
            <div
              v-if="isSubmitting"
              class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            <span v-else>Simpan Konfigurasi</span>
          </button>
        </div>
      </form>
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
import { ref, onMounted } from 'vue'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const isSubmitting = ref(false)
const isEditing = ref(false)

const form = ref({ id: 'conf_01', is_active: false, judul_pemilihan: '', deskripsi: '' })
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

onMounted(async () => {
  await store.fetchVotingConfig()
  if (store.votingConfig) {
    isEditing.value = true
    form.value.id = store.votingConfig.id || 'conf_01'
    form.value.judul_pemilihan = store.votingConfig.judul_pemilihan || ''
    form.value.deskripsi = store.votingConfig.deskripsi || ''
    const activeVal = store.votingConfig.is_active
    form.value.is_active =
      activeVal === true || activeVal === 'TRUE' || String(activeVal).toLowerCase() === 'true'
  }
})

const handleSave = async () => {
  isSubmitting.value = true
  try {
    const payloadData = [
      form.value.id,
      form.value.is_active,
      form.value.judul_pemilihan,
      form.value.deskripsi,
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
