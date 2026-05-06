<template>
  <main class="min-h-screen bg-[#f5f5f5] pb-24 pt-8 md:pt-12 px-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header Bilik Suara -->
      <header
        class="flex justify-between items-start md:items-center mb-10 flex-col md:flex-row gap-4"
      >
        <div>
          <h1 class="font-serif text-[32px] md:text-[36px] font-bold text-[#0c0a09]">
            Bilik Suara
          </h1>
          <p class="text-[#4e4e4e] text-[15px]">
            Halo, <span class="font-bold text-[#800000]">{{ store.voterSession?.nama }}</span>
          </p>
        </div>
        <button
          @click="logout"
          class="bg-[#ffffff] border border-[#d6d3d1] text-[#0c0a09] px-5 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#f0efed] transition-colors shadow-sm"
        >
          Batalkan & Keluar
        </button>
      </header>

      <!-- Tampilan Loading -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-[#e7e5e4]"
      >
        <div
          class="w-10 h-10 border-4 border-[#800000]/30 border-t-[#800000] rounded-full animate-spin mb-4"
        ></div>
        <p class="text-[#777169] font-medium">Memuat daftar kandidat...</p>
      </div>

      <!-- Tampilan Sukses -->
      <div
        v-else-if="successMsg"
        class="bg-[#fafafa] border border-[#16a34a]/30 p-10 md:p-16 rounded-[24px] text-center shadow-sm relative overflow-hidden"
      >
        <div
          class="absolute inset-0 w-full h-full bg-[radial-gradient(circle,rgba(22,163,74,0.05)_0%,transparent_70%)] pointer-events-none"
        ></div>
        <div
          class="w-20 h-20 bg-[#16a34a] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"
        >
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 class="font-serif text-[32px] font-bold mb-3 text-[#0c0a09]">Suara Berhasil Direkam</h2>
        <p class="text-[#4e4e4e] text-[16px] max-w-md mx-auto">
          Terima kasih atas partisipasi Anda dalam pemilihan. Sesi Anda akan otomatis diakhiri dalam
          beberapa detik...
        </p>
      </div>

      <!-- Pilihan Kandidat -->
      <div v-else>
        <div class="bg-[#ffffff] rounded-[24px] p-6 md:p-10 border border-[#e7e5e4] shadow-sm">
          <h2 class="font-serif text-[24px] font-bold text-[#0c0a09] mb-8">
            Pilih Kandidat Majelis
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="kandidat in store.kandidat"
              :key="kandidat.id"
              @click="selectedId = kandidat.id"
              class="rounded-2xl p-5 border-2 cursor-pointer transition-all relative overflow-hidden group"
              :class="
                selectedId === kandidat.id
                  ? 'border-[#800000] bg-[#faf7f2] shadow-md'
                  : 'border-[#e7e5e4] bg-[#ffffff] hover:border-[#a8a29e] hover:shadow-sm'
              "
            >
              <div class="flex items-center gap-5">
                <!-- Foto Fallback -->
                <div
                  class="w-16 h-16 rounded-full bg-[#f0efed] border border-[#d6d3d1] flex items-center justify-center overflow-hidden shrink-0"
                >
                  <img
                    v-if="kandidat.foto"
                    :src="kandidat.foto"
                    alt="Foto"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
                    class="w-8 h-8 text-[#a8a29e]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>

                <div class="flex-1">
                  <h3
                    class="font-sans font-bold text-[18px] text-[#0c0a09] leading-tight group-hover:text-[#800000] transition-colors"
                  >
                    {{ kandidat.nama }}
                  </h3>
                  <p v-if="kandidat.visi_misi" class="text-[13px] text-[#777169] line-clamp-2 mt-1">
                    {{ kandidat.visi_misi }}
                  </p>
                </div>

                <!-- Radio Button Indicator -->
                <div class="shrink-0">
                  <div
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="
                      selectedId === kandidat.id
                        ? 'border-[#800000] bg-[#800000]'
                        : 'border-[#d6d3d1] bg-white group-hover:border-[#a8a29e]'
                    "
                  >
                    <svg
                      v-if="selectedId === kandidat.id"
                      class="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Konfirmasi Pengiriman -->
          <div
            class="mt-10 pt-8 border-t border-[#e7e5e4] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-[#800000] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p class="text-[#4e4e4e] text-[13px] md:text-[14px] leading-snug">
                Pastikan pilihan Anda sudah benar. Suara yang dikirim
                <strong class="text-[#0c0a09]">tidak dapat diubah atau ditarik kembali</strong>.
              </p>
            </div>

            <button
              @click="submitVote"
              :disabled="!selectedId || isSubmitting"
              class="w-full md:w-auto shrink-0 bg-[#800000] text-white px-8 py-3.5 rounded-full text-[15px] font-bold hover:bg-[#500000] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <div
                v-if="isSubmitting"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
              <span v-else>Kirim Suara Sekarang</span>
            </button>
          </div>

          <p
            v-if="errorMsg"
            class="mt-6 text-[#dc2626] text-[14px] text-center font-medium bg-[#fee2e2] p-3 rounded-lg border border-[#fca5a5]"
          >
            {{ errorMsg }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const router = useRouter()
const isLoading = ref(true)
const isSubmitting = ref(false)
const selectedId = ref(null)
const errorMsg = ref('')
const successMsg = ref(false)

onMounted(async () => {
  store.checkVoterAuth()
  if (!store.voterSession) {
    router.push('/voting/login')
    return
  }
  await store.fetchKandidat()
  isLoading.value = false
})

const logout = () => {
  store.logoutVoter()
  router.push('/voting/login')
}

const submitVote = async () => {
  if (!selectedId.value) return
  isSubmitting.value = true
  errorMsg.value = ''
  try {
    await store.submitVote(selectedId.value)
    successMsg.value = true
    // Tunggu 3 detik agar user melihat pesan sukses, lalu arahkan kembali ke menu login
    setTimeout(() => {
      router.push('/voting/login')
    }, 3000)
  } catch (err) {
    errorMsg.value = err.message
    isSubmitting.value = false
  }
}
</script>
