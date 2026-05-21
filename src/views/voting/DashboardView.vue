<template>
  <main class="min-h-screen bg-[#f5f5f5] pb-24 pt-24 md:pt-32 px-6">
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
        class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#e7e5e4]"
      >
        <div
          class="w-10 h-10 border-4 border-[#800000]/30 border-t-[#800000] rounded-full animate-spin mb-4"
        ></div>
        <p class="text-[#777169] font-medium">Memuat daftar kandidat...</p>
      </div>

      <!-- Tampilan Sukses -->
      <div
        v-else-if="votingComplete"
        class="bg-[#fafafa] border border-[#16a34a]/30 p-10 md:p-16 rounded-3xl text-center shadow-sm relative overflow-hidden"
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
          {{ successMsg }}
          <span v-if="votesRemaining > 0"
            ><br />Anda masih memiliki {{ votesRemaining }} suara tersisa untuk wilayah lain.</span
          >
        </p>
      </div>

      <!-- Pilihan Kandidat -->
      <div v-else>
        <div class="bg-[#ffffff] rounded-3xl p-6 md:p-10 border border-[#e7e5e4] shadow-sm">
          <h2 class="font-serif text-[24px] font-bold text-[#0c0a09] mb-4">
            Pilih Kandidat Majelis
          </h2>

          <div
            v-if="successMsg && votesRemaining > 0"
            class="mb-6 rounded-2xl border border-[#d1fae5] bg-[#ecfdf5] p-5 text-[#166534]"
          >
            <p class="font-medium">{{ successMsg }}</p>
            <p class="text-sm mt-1">
              Anda masih memiliki {{ votesRemaining }} suara tersisa untuk wilayah lain.
            </p>
          </div>

          <div class="space-y-6">
            <div class="rounded-2xl border border-[#e7e5e4] bg-[#f8fafc] p-5 text-[#0f5132]">
              <p class="font-semibold">Aturan Pilihan</p>
              <p class="text-sm mt-2">
                Anda dapat memilih total <strong>2 suara</strong>,
                <strong>1 kandidat untuk setiap wilayah</strong>.
              </p>
              <p class="text-sm mt-2">
                Sudah memilih: <strong>{{ selectedIds.length }}</strong> dari
                <strong>{{ requiredSelectionCount }}</strong> kandidat.
              </p>
              <p v-if="usedRegions.length" class="text-sm mt-2">
                Wilayah yang sudah dipilih: <strong>{{ usedRegions.join(', ') }}</strong
                >.
              </p>
              <p v-if="inProgressMessage" class="text-sm mt-2 text-[#14532d]">
                {{ inProgressMessage }}
              </p>
            </div>
            <div v-for="group in kandidatByRegion" :key="group.region" class="space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 class="text-[22px] font-bold text-[#0c0a09]">{{ group.region }}</h3>
                  <p class="text-sm text-[#777169]">Pilih kandidat untuk {{ group.region }}.</p>
                </div>
                <span
                  class="inline-flex items-center rounded-full bg-[#f8fafc] text-[#166534] px-4 py-2 text-sm font-semibold border border-[#d1fae5]"
                >
                  {{ group.items.length }} Kandidat
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="kandidat in group.items"
                  :key="kandidat.id"
                  @click="selectCandidate(kandidat.id, kandidat)"
                  class="rounded-2xl p-5 border-2 transition-all relative overflow-hidden group"
                  :class="[
                    isCandidateSelected(kandidat)
                      ? 'border-[#800000] bg-[#faf7f2] shadow-md'
                      : 'border-[#e7e5e4] bg-[#ffffff] hover:border-[#a8a29e] hover:shadow-sm',
                    isCandidateDisabled(kandidat)
                      ? 'opacity-60 cursor-not-allowed hover:border-[#e7e5e4] hover:shadow-none'
                      : 'cursor-pointer',
                  ]"
                >
                  <div class="flex items-start gap-5">
                    <div class="relative">
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
                      <div
                        v-if="isCandidateDisabled(kandidat)"
                        class="absolute -top-1 -right-1 rounded-full bg-[#fde8e8] text-[#9f1239] text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-1 border border-[#fecdd3] shadow-sm"
                      >
                        Wilayah dipilih
                      </div>
                    </div>

                    <div class="flex-1">
                      <h3
                        class="font-sans font-bold text-[18px] text-[#0c0a09] leading-tight group-hover:text-[#800000] transition-colors"
                      >
                        {{ kandidat.nama }}
                      </h3>
                      <p
                        v-if="kandidat.visi_misi"
                        class="text-[13px] text-[#777169] line-clamp-2 mt-1"
                      >
                        {{ kandidat.visi_misi }}
                      </p>
                    </div>

                    <!-- Radio Button Indicator -->
                    <div class="shrink-0">
                      <div
                        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                        :class="
                          isCandidateSelected(kandidat)
                            ? 'border-[#800000] bg-[#800000]'
                            : 'border-[#d6d3d1] bg-white group-hover:border-[#a8a29e]'
                        "
                      >
                        <svg
                          v-if="isCandidateSelected(kandidat)"
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
              :disabled="selectedIds.length !== requiredSelectionCount || isSubmitting"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const store = useChurchStore()
const router = useRouter()
const isLoading = ref(true)
const isSubmitting = ref(false)
const selectedIds = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const votesRemaining = ref(0)

const normalizeRegion = (region) => region?.toString?.().trim().toLowerCase() || ''

const usedRegions = computed(() => {
  if (!store.voterSession?.regions_voted) return []
  return store.voterSession.regions_voted.map((region) => normalizeRegion(region)).filter(Boolean)
})

const selectedRegions = computed(() => {
  return selectedIds.value
    .map((id) => store.kandidat.find((kandidat) => kandidat.id === id))
    .filter(Boolean)
    .map((kandidat) => normalizeRegion(getCandidateRegion(kandidat)))
})

const requiredSelectionCount = computed(() => {
  if (votesRemaining.value <= 0) return 0
  return votesRemaining.value
})

const kandidatByRegion = computed(() => {
  const normalized = store.kandidat.map((kandidat) => ({
    ...kandidat,
    region: (kandidat.region || kandidat.wilayah || 'Lainnya').toString().trim() || 'Lainnya',
  }))

  const grouped = normalized.reduce((acc, kandidat) => {
    const key = kandidat.region
    if (!acc[key]) acc[key] = []
    acc[key].push(kandidat)
    return acc
  }, {})

  return Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base', numeric: true }))
    .map((region) => ({
      region,
      items: grouped[region].sort((a, b) =>
        (a.nama || '').toString().localeCompare((b.nama || '').toString(), 'id', {
          sensitivity: 'base',
          numeric: true,
        }),
      ),
    }))
})

const getCandidateRegion = (kandidat) =>
  (kandidat.region || kandidat.wilayah || 'Lainnya').toString().trim()

const isCandidateSelected = (kandidat) => selectedIds.value.includes(kandidat.id)

const isCandidateDisabled = (kandidat) => {
  const region = normalizeRegion(getCandidateRegion(kandidat))
  if (isCandidateSelected(kandidat)) return false
  return usedRegions.value.includes(region) || selectedRegions.value.includes(region)
}

const selectCandidate = (candidateId, kandidat) => {
  const region = normalizeRegion(getCandidateRegion(kandidat))
  if (isCandidateSelected(kandidat)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== candidateId)
    errorMsg.value = ''
    return
  }

  if (usedRegions.value.includes(region)) {
    errorMsg.value = `Wilayah ${getCandidateRegion(kandidat)} sudah dipilih sebelumnya. Pilih wilayah lain.`
    return
  }

  if (selectedRegions.value.includes(region)) {
    selectedIds.value = selectedIds.value.filter((id) => {
      const selected = store.kandidat.find((item) => item.id === id)
      return normalizeRegion(getCandidateRegion(selected)) !== region
    })
    selectedIds.value.push(candidateId)
    errorMsg.value = ''
    return
  }

  if (selectedIds.value.length >= requiredSelectionCount.value) {
    errorMsg.value = `Anda hanya dapat memilih ${requiredSelectionCount.value} kandidat.`
    return
  }

  selectedIds.value.push(candidateId)
  errorMsg.value = ''
}

const inProgressMessage = computed(() => {
  const remaining = votesRemaining.value
  if (remaining <= 0) return ''
  if (remaining === 1) return 'Anda memiliki 1 suara tersisa, pilih kandidat dari wilayah lain.'
  return 'Anda dapat memilih 2 kandidat, masing-masing 1 untuk wilayah berbeda.'
})

onMounted(async () => {
  store.checkVoterAuth()
  if (!store.voterSession) {
    router.push('/voting/login')
    return
  }

  votesRemaining.value = Number(
    store.voterSession?.votes_remaining ??
      Math.max(0, 2 - (Number(store.voterSession?.votes_cast) || 0)),
  )

  await store.fetchKandidat()
  isLoading.value = false
})

const logout = () => {
  store.logoutVoter()
  router.push('/voting/login')
}

const votingComplete = computed(() => !!successMsg.value && votesRemaining.value <= 0)

const submitVote = async () => {
  if (selectedIds.value.length !== requiredSelectionCount.value) {
    errorMsg.value = `Anda harus memilih ${requiredSelectionCount.value} kandidat sebelum mengirim.`
    return
  }
  isSubmitting.value = true
  errorMsg.value = ''
  try {
    const result = await store.submitVote(selectedIds.value)
    successMsg.value = result.message
    votesRemaining.value = Number(result.votes_remaining || 0)
    selectedIds.value = []
    if (votesRemaining.value <= 0) {
      // Setelah semua hak suara terpakai, arahkan kembali ke login setelah beberapa detik
      setTimeout(() => {
        router.push('/voting/login')
      }, 3000)
    } else {
      isSubmitting.value = false
    }
  } catch (err) {
    errorMsg.value = err.message
    isSubmitting.value = false
  }
}
</script>
