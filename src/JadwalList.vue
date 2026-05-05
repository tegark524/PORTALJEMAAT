<template>
  <div>
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-[#ffffff] rounded-[16px] p-6 border border-[#e7e5e4] h-[200px] flex flex-col animate-pulse"
      >
        <div class="flex justify-between mb-6">
          <div class="h-6 w-20 bg-[#e7e5e4] rounded-full"></div>
          <div class="h-6 w-16 bg-[#e7e5e4] rounded-full"></div>
        </div>
        <div class="h-8 w-3/4 bg-[#e7e5e4] rounded mb-4"></div>
        <div class="mt-auto space-y-3">
          <div class="h-4 w-full bg-[#e7e5e4] rounded"></div>
          <div class="h-4 w-2/3 bg-[#e7e5e4] rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="jadwals.length === 0"
      class="py-16 text-center text-[#777169] font-sans text-[16px] bg-[#ffffff] rounded-[16px] border border-[#e7e5e4]"
    >
      Belum ada jadwal ibadah mendatang.
    </div>

    <!-- Content Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <JadwalCard v-for="(j, index) in jadwals" :key="index" :jadwal="j" />
    </div>
  </div>
</template>

<script setup>
import JadwalCard from './JadwalCard.vue'
defineProps({ jadwals: Array, isLoading: Boolean })
</script>
