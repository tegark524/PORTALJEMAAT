<template>
  <div
    class="bg-[#ffffff] rounded-[16px] overflow-hidden border border-[#e7e5e4] shadow-sm flex flex-col h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group"
    @click="$emit('read-more', warta)"
  >
    <!-- Image / Fallback -->
    <div
      class="w-full h-48 bg-gradient-to-br from-[#800000] to-[#500000] flex items-center justify-center overflow-hidden relative"
    >
      <img
        v-if="(warta.image || warta.gambar) && !imageError"
        :src="warta.image || warta.gambar"
        alt="Cover"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="imageError = true"
      />
      <svg
        v-else
        class="w-12 h-12 text-white/30"
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

      <!-- Category Badge -->
      <div
        v-if="warta.kategori || warta.category"
        class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#800000] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm"
      >
        {{ warta.kategori || warta.category }}
      </div>
    </div>

    <div class="p-6 flex flex-col flex-grow">
      <p class="text-[12px] font-sans tracking-[0.96px] text-[#777169] font-medium mb-3">
        {{ warta.formattedDate || warta.tanggal || warta.date }}
      </p>
      <h3
        class="font-serif text-[20px] font-bold text-[#0c0a09] mb-3 leading-[1.3] group-hover:text-[#800000] transition-colors"
      >
        {{ warta.judul || warta.title }}
      </h3>
      <p
        class="text-[14px] text-[#4e4e4e] font-sans font-normal leading-[1.6] line-clamp-3 mb-6 flex-grow"
      >
        {{ warta.ringkasan || warta.excerpt || warta.isi || warta.content }}
      </p>
      <span
        class="mt-auto self-start text-[#800000] text-[13px] font-bold font-sans flex items-center gap-1 group-hover:underline"
      >
        Baca Selengkapnya &rarr;
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  warta: {
    type: Object,
    required: true,
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
