<template>
  <div
    class="bg-[#faf7f2] rounded-[16px] p-8 border border-[#e7e5e4] shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
  >
    <!-- Minimalist ribbon graphic -->
    <div class="absolute top-0 left-0 w-1.5 h-full bg-[#800000] opacity-80"></div>

    <p class="text-[12px] font-semibold tracking-[0.96px] text-[#777169] uppercase mb-4">
      {{ doa.formattedDate || doa.tanggal || doa.date }}
    </p>

    <p class="text-[16px] text-[#0c0a09] font-serif italic leading-[1.6] mb-8 flex-grow">
      "{{ doa.isi_doa || doa.content }}"
    </p>

    <p class="mt-auto self-start text-[#800000] text-[14px] font-medium font-sans">
      &mdash; {{ doa.nama || doa.name || 'Hamba Tuhan' }}
    </p>
  </div>
</template>

<script setup>
defineProps({ doa: { type: Object, required: true } })
</script>
