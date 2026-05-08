<template>
  <div>
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-[#ffffff] rounded-[16px] p-8 border border-[#e7e5e4] h-[280px] flex flex-col animate-pulse"
      >
        <div class="h-3 w-24 bg-[#e7e5e4] rounded mb-6"></div>
        <div class="h-6 w-full bg-[#e7e5e4] rounded mb-3"></div>
        <div class="h-6 w-2/3 bg-[#e7e5e4] rounded mb-6"></div>
        <div class="h-4 w-full bg-[#e7e5e4] rounded mb-2"></div>
        <div class="h-4 w-4/5 bg-[#e7e5e4] rounded mb-8"></div>
        <div class="mt-auto h-8 w-36 bg-[#e7e5e4] rounded-full"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="wartas.length === 0"
      class="py-16 text-center text-[#777169] font-sans text-[16px] bg-[#ffffff] rounded-[16px] border border-[#e7e5e4]"
    >
      Informasi warta belum tersedia atau tidak ditemukan.
    </div>

    <!-- Content Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in wartas"
          :key="index"
          @click="$emit('read-more', item)"
          class="relative bg-[#ffffff] border border-[#e7e5e4] rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex-col group min-h-[260px]"
          :class="showAll ? 'flex' : index === 0 ? 'flex' : index < 3 ? 'hidden md:flex' : 'hidden'"
        >
          <!-- Background Image Handling -->
          <div v-if="item.gambar" class="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <img
              :src="item.gambar"
              alt="Gambar Warta"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <!-- Overlay putih semi-transparan agar teks tetap terbaca jelas -->
            <div
              class="absolute inset-0 bg-white/90 group-hover:bg-white/80 transition-colors duration-500"
            ></div>
          </div>

          <!-- Card Content -->
          <div class="p-6 flex flex-col flex-1 relative z-10">
            <p class="text-[12px] font-bold text-[#800000] uppercase tracking-wider mb-2">
              {{ item.formattedDate || item.tanggal || item.date }}
            </p>
            <h3 class="font-serif text-[20px] font-bold text-[#0c0a09] leading-tight mb-3">
              {{ item.judul || item.title }}
            </h3>
            <p class="text-[#4e4e4e] font-medium text-[14px] line-clamp-3 mb-4 flex-1">
              {{ item.isi || item.content || item.ringkasan }}
            </p>
            <span class="selengkapnya-link text-[13px] mt-auto self-start mr-2">
              Baca Selengkapnya
            </span>
          </div>
        </div>
      </div>

      <!-- Tombol Selengkapnya -->
      <div
        v-if="wartas.length > 1"
        class="mt-8 flex justify-center"
        :class="wartas.length <= 3 ? 'md:hidden' : ''"
      >
        <button
          @click="showAll = !showAll"
          class="bg-transparent border border-[#d6d3d1] text-[#0c0a09] px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#f0efed] transition-colors"
        >
          {{ showAll ? 'Tutup Daftar' : 'Lihat Selengkapnya' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  wartas: Array,
  isLoading: Boolean,
})

defineEmits(['read-more'])

const showAll = ref(false)
</script>

<style scoped>
.selengkapnya-link {
  color: var(--link-color, #800000);
  line-height: 2;
  position: relative;
  padding-right: 4px;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: none;
  display: inline-block;
  text-decoration: none;
}

.selengkapnya-link:hover,
.group:hover .selengkapnya-link {
  text-decoration: underline;
}

.selengkapnya-link::before {
  content: '';
  width: 6px;
  height: 6px;
  border-top: solid 2px var(--link-color, #800000);
  border-right: solid 2px var(--link-color, #800000);
  border-radius: 1px;
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%) rotate(45deg);
  transition: transform 0.4s;
}

.selengkapnya-link:hover::before,
.group:hover .selengkapnya-link::before {
  transform: translateX(4px) translateY(-50%) rotate(45deg);
}
</style>
