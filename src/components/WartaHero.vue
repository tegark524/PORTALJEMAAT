<template>
  <section class="py-12 px-6 md:px-12 max-w-6xl mx-auto">
    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="bg-[#e7e5e4] animate-pulse h-[400px] rounded-[24px] w-full"></div>

    <!-- Featured Warta -->
    <div
      v-else-if="warta"
      class="bg-gradient-to-br from-[#800000] to-[#500000] text-white rounded-[24px] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 relative overflow-hidden shadow-[0_8px_32px_rgba(128,0,0,0.25)] hover:shadow-lg transition-shadow duration-300 group"
    >
      <!-- Image / Fallback -->
      <div
        class="w-full md:w-2/5 aspect-video md:aspect-[4/3] bg-black/20 rounded-[16px] flex items-center justify-center overflow-hidden border border-white/10 shrink-0 relative"
      >
        <img
          v-if="(warta.image || warta.gambar) && !imageError"
          :src="warta.image || warta.gambar"
          alt="Warta Image"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          @error="imageError = true"
        />
        <svg
          v-else
          class="w-16 h-16 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 4v16m-4-8h8"
          ></path>
        </svg>
      </div>

      <!-- Content -->
      <div class="flex flex-col items-center md:items-start w-full z-10 flex-grow py-2">
        <div class="flex items-center gap-3 mb-4">
          <span
            class="text-[10px] font-bold tracking-[0.96px] uppercase bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1"
          >
            Warta Utama
          </span>
          <span class="text-[12px] font-sans font-medium opacity-80">{{
            warta.formattedDate || warta.tanggal || warta.date
          }}</span>
        </div>

        <h1
          class="font-serif text-3xl md:text-[42px] font-semibold leading-[1.2] tracking-[-0.32px] mb-4"
        >
          {{ warta.judul || warta.title }}
        </h1>

        <p class="text-[15px] font-sans leading-[1.6] opacity-80 line-clamp-3 mb-8 max-w-xl">
          {{ warta.ringkasan || warta.excerpt || warta.isi || warta.content }}
        </p>

        <div class="mt-auto flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            @click="$emit('read-more', warta)"
            class="bg-[#ffffff] text-[#800000] px-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#f5f5f5] transition-colors w-full md:w-auto shadow-md"
          >
            Baca Selengkapnya
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  warta: Object,
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const imageError = ref(false)
watch(
  () => props.warta,
  () => {
    imageError.value = false
  },
)
</script>
