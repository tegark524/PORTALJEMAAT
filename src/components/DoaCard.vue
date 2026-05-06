<template>
  <div class="book w-full h-[300px]">
    <!-- Halaman Dalam (Isi Doa) -->
    <div
      class="inside-page w-full h-full p-6 flex flex-col justify-center items-center text-center overflow-y-auto custom-scrollbar"
    >
      <svg
        class="w-8 h-8 text-[#800000] opacity-20 mb-4 shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
        />
      </svg>
      <p class="text-[14px] text-[#4e4e4e] italic leading-relaxed">
        "{{ doa.isi_doa || doa.pesan }}"
      </p>
    </div>

    <!-- Sampul Depan (Cover Buku) -->
    <div class="cover">
      <p class="text-[12px] text-[#e7e5e4] font-bold uppercase tracking-widest mb-4 m-0">
        Tembok Doa
      </p>

      <h3 class="font-serif text-[24px] font-bold text-white mb-2 leading-tight">
        {{ doa.nama || 'Hamba Tuhan' }}
      </h3>

      <div class="w-12 h-0.5 bg-[#d6d3d1] opacity-50 my-4"></div>

      <p class="text-[13px] text-[#d6d3d1] m-0 font-normal">
        {{ doa.formattedDate }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  doa: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.book {
  position: relative;
  border-radius: 10px;
  background-color: #faf7f2; /* Warna Whitesmoke khas GKJW */
  -webkit-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.15);
  box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.15);
  -webkit-transform: preserve-3d;
  -ms-transform: preserve-3d;
  transform: preserve-3d;
  -webkit-perspective: 2000px;
  perspective: 2000px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #0c0a09;
}

.cover {
  top: 0;
  position: absolute;
  background-color: #800000; /* Maroon utama GKJW */
  width: 100%;
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  -webkit-transform-origin: 0;
  -ms-transform-origin: 0;
  transform-origin: 0;
  -webkit-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.2);
  box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.2);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
}

.book:hover .cover {
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  -webkit-transform: rotatey(-80deg);
  -ms-transform: rotatey(-80deg);
  transform: rotatey(-80deg);
}

/* Kustomisasi scrollbar mini agar rapi di dalam bagian buku */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d6d3d1;
  border-radius: 4px;
}
</style>
