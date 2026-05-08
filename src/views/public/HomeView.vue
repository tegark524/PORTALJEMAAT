<template>
  <main id="beranda" class="relative overflow-hidden w-full pb-24 pt-20 md:pt-24">
    <!-- Atmospheric Gradient Orb -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(200,184,224,0.3)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none md:w-[900px] md:h-[900px]"
    ></div>

    <!-- Unified Headline Slider Section -->
    <section
      class="max-w-6xl mx-auto px-6 md:px-12 mb-12 relative z-10"
      @mouseenter="stopSlide"
      @mouseleave="startSlide"
    >
      <h2
        class="font-serif text-[24px] sm:text-[28px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px] mb-6 text-center uppercase"
      >
        Warta Jemaat
      </h2>
      <div
        v-if="store.isLoading"
        class="relative w-full rounded-[24px] bg-[#e7e5e4] min-h-[350px] md:min-h-[450px] animate-pulse"
      ></div>
      <div
        v-else-if="combinedHeadlines.length > 0"
        class="relative w-full overflow-hidden rounded-[24px] bg-[#0c0a09] text-white min-h-[350px] md:min-h-[450px] shadow-2xl flex group"
      >
        <div
          v-for="(item, index) in combinedHeadlines"
          :key="item.id"
          class="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform flex"
          :class="
            currentSlide === index
              ? 'opacity-100 translate-x-0 z-10'
              : 'opacity-0 translate-x-12 z-0 pointer-events-none'
          "
        >
          <!-- Background Image -->
          <div
            v-if="item.image"
            class="absolute inset-0 w-full h-full z-0 cursor-pointer overflow-hidden"
            @click="openModal(item.raw)"
          >
            <img
              :src="item.image"
              class="w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
              alt="Media Headline"
            />
            <!-- Added overlay for better text readability as requested -->
            <div class="absolute inset-0 bg-black/50"></div>
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/80 to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- Content -->
          <div
            class="relative z-20 p-8 md:p-12 lg:p-16 flex flex-col justify-end h-full w-full max-w-4xl"
          >
            <h2
              class="font-serif text-3xl md:text-5xl leading-[1.1] mb-4 text-white drop-shadow-lg line-clamp-2 hover:text-gray-300 cursor-pointer transition-colors"
              @click="openModal(item.raw)"
            >
              {{ item.title }}
            </h2>

            <div
              v-if="item.type === 'jadwal'"
              class="text-[14px] md:text-[16px] text-gray-300 mb-6 flex flex-wrap items-center gap-2 md:gap-3"
            >
              <span class="flex items-center gap-1.5">
                <svg
                  class="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {{ formatDate(item.date) }}
              </span>
              <span class="hidden md:inline">&bull;</span>
              <span>{{ formatWaktu(item.time) }} WIB</span>
              <span class="hidden md:inline">&bull;</span>
              <span class="truncate max-w-[200px] md:max-w-none">{{ item.location }}</span>
            </div>
            <div
              v-else
              class="text-[14px] md:text-[16px] text-gray-300 mb-6 flex items-center gap-2 md:gap-3"
            >
              <span class="flex items-center gap-1.5">
                <svg
                  class="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {{ formatDate(item.date) }}
              </span>
            </div>

            <p
              class="text-[14px] md:text-[16px] text-gray-400 line-clamp-3 md:line-clamp-4 max-w-3xl mb-8"
            >
              {{ item.desc }}
            </p>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-6">
              <button @click="openModal(item.raw)" class="selengkapnya-link white text-[14px]">
                Baca Selengkapnya
              </button>
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="tautan-button white-mode w-full sm:w-auto justify-center"
                style="--clr: #ffffff"
              >
                <span>Buka Tautan</span>
                <span class="tautan-button__icon-wrapper">
                  <svg
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="tautan-button__icon-svg"
                    width="10"
                  >
                    <path
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.28-9.224-.048 6.912 2.456.024z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <svg
                    viewBox="0 0 14 15"
                    fill="none"
                    width="10"
                    xmlns="http://www.w3.org/2000/svg"
                    class="tautan-button__icon-svg tautan-button__icon-svg--copy"
                  >
                    <path
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.28-9.224-.048 6.912 2.456.024z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- Controls (Prev/Next) -->
        <button
          v-if="combinedHeadlines.length > 1"
          @click="prevSlide"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-black/80 hover:scale-110"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <button
          v-if="combinedHeadlines.length > 1"
          @click="nextSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-30 hover:bg-black/80 hover:scale-110"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>

        <!-- Slide Indicators -->
        <div
          v-if="combinedHeadlines.length > 1"
          class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20"
        >
          <button
            v-for="(_, index) in combinedHeadlines"
            :key="index"
            @click="currentSlide = index"
            class="h-1.5 rounded-full transition-all duration-500 ease-out"
            :class="
              currentSlide === index ? 'bg-[#a7e5d3] w-8' : 'bg-white/40 w-2 hover:bg-white/60'
            "
          ></button>
        </div>
      </div>
    </section>

    <!-- Renungan Harian Banner Section -->
    <section id="renungan" class="py-12 px-6 md:px-12 max-w-6xl mx-auto scroll-mt-24">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2
          class="font-serif text-[24px] sm:text-[28px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px]"
        >
          Renungan Harian
        </h2>
      </div>

      <div
        class="bg-[#ffffff] rounded-[24px] p-8 md:p-12 border border-[#e7e5e4] shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-shadow duration-300 mb-8"
      >
        <!-- Decorative Background Orb -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(200,184,224,0.15)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none"
        ></div>

        <div class="flex-1 w-full relative z-10">
          <div class="flex items-center gap-2 mb-5">
            <span
              class="bg-[#f5f5f5] text-[#0c0a09] text-[10px] font-bold uppercase tracking-[0.96px] px-3 py-1.5 rounded-full border border-[#e7e5e4] shrink-0"
              >Terbaru</span
            >
            <span
              v-if="latestRenungan"
              class="text-[#777169] text-[12px] sm:text-[13px] font-medium tracking-wide truncate"
            >
              {{
                formatDate(
                  latestRenungan.tanggal_tayang || latestRenungan.tanggal || latestRenungan.date,
                )
              }}
            </span>
          </div>

          <div
            v-if="store.isLoading"
            class="animate-pulse flex flex-col h-full justify-center py-2"
          >
            <div class="h-10 w-3/4 bg-[#e7e5e4] rounded mb-6"></div>
            <div class="h-4 w-full bg-[#e7e5e4] rounded mb-3"></div>
            <div class="h-4 w-full bg-[#e7e5e4] rounded mb-3"></div>
            <div class="h-4 w-5/6 bg-[#e7e5e4] rounded"></div>
          </div>
          <div v-else-if="latestRenungan" class="flex flex-col h-full">
            <h3
              class="font-serif text-[28px] md:text-[36px] font-bold text-[#0c0a09] mb-4 leading-[1.2]"
            >
              {{ latestRenungan.judul || latestRenungan.tema || latestRenungan.title }}
            </h3>
            <p v-if="latestRenungan.nats" class="text-[15px] text-[#800000] italic mb-4">
              {{ latestRenungan.nats }}
            </p>
            <p
              class="text-[16px] text-[#4e4e4e] font-normal leading-[1.6] line-clamp-3 mb-8 max-w-3xl"
            >
              {{ latestRenungan.isi_renungan || latestRenungan.isi || latestRenungan.content }}
            </p>
            <button
              @click="openModal(latestRenungan)"
              class="selengkapnya-link text-[14px] self-start mt-2"
              style="--link-color: #0c0a09"
            >
              Baca Selengkapnya
            </button>
          </div>
          <div v-else class="text-[#777169] text-[16px]">Belum ada renungan tersedia.</div>
        </div>
      </div>

      <!-- Arsip Renungan Card Grid -->
      <div v-if="store.isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-[#faf7f2] rounded-[16px] p-6 border border-[#e7e5e4] shadow-sm flex flex-col h-[260px] animate-pulse"
        >
          <div class="h-3 w-24 bg-[#e7e5e4] rounded mb-4"></div>
          <div class="h-6 w-full bg-[#e7e5e4] rounded mb-2"></div>
          <div class="h-6 w-3/4 bg-[#e7e5e4] rounded mb-6"></div>
          <div class="mt-auto space-y-3">
            <div class="h-3 w-full bg-[#e7e5e4] rounded"></div>
            <div class="h-3 w-full bg-[#e7e5e4] rounded"></div>
            <div class="h-3 w-4/5 bg-[#e7e5e4] rounded"></div>
          </div>
        </div>
      </div>
      <div v-else-if="pastRenungan.length > 0">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6"
          :class="!showAllRenungan ? 'hidden md:grid' : ''"
        >
          <div
            v-for="(renungan, index) in pastRenungan"
            :key="index"
            @click="openModal(renungan)"
            class="bg-[#faf7f2] rounded-[16px] p-6 border border-[#e7e5e4] shadow-sm flex flex-col h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <p class="text-[12px] font-sans tracking-[0.96px] text-[#777169] font-medium mb-3">
              {{ formatDate(renungan.tanggal_tayang || renungan.tanggal || renungan.date) }}
            </p>
            <h4
              class="font-serif text-[20px] font-bold text-[#0c0a09] mb-2 leading-[1.3] group-hover:text-[#800000] transition-colors"
            >
              {{ renungan.judul || renungan.tema || renungan.title }}
            </h4>
            <p v-if="renungan.nats" class="text-[13px] text-[#800000] italic mb-3">
              {{ renungan.nats }}
            </p>
            <p
              class="text-[14px] text-[#4e4e4e] font-sans font-normal leading-[1.6] line-clamp-3 mb-4 flex-grow"
            >
              {{ renungan.isi_renungan || renungan.isi || renungan.content }}
            </p>
            <span class="selengkapnya-link text-[13px] mt-auto self-start mr-2">
              Baca Selengkapnya
            </span>
          </div>
        </div>

        <!-- Tombol Selengkapnya (Hanya Mobile) -->
        <div class="mt-8 flex justify-center md:hidden">
          <button
            @click="showAllRenungan = !showAllRenungan"
            class="bg-transparent border border-[#d6d3d1] text-[#0c0a09] px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#f0efed] transition-colors"
          >
            {{ showAllRenungan ? 'Tutup Arsip' : 'Lihat Arsip Lainnya' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Jadwal Ibadah Section -->
    <section id="jadwal" class="py-12 px-6 md:px-12 max-w-6xl mx-auto relative scroll-mt-24">
      <div
        class="absolute top-1/2 -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(167,229,211,0.25)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none"
      ></div>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2
          class="font-serif text-[24px] sm:text-[28px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px]"
        >
          Jadwal Ibadah
        </h2>
      </div>

      <JadwalList :jadwals="listJadwal" :isLoading="store.isLoading" @read-more="openModal" />
    </section>

    <!-- Warta Jemaat List Section -->
    <section id="warta-list" class="py-12 px-6 md:px-12 max-w-6xl mx-auto scroll-mt-24">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2
          class="font-serif text-[24px] sm:text-[28px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px]"
        >
          Warta Lainnya
        </h2>

        <!-- Search Bar -->
        <div class="relative w-full md:w-72">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari warta..."
            class="w-full bg-[#ffffff] border border-[#d6d3d1] rounded-full px-5 py-2.5 text-[15px] font-sans text-[#0c0a09] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-shadow"
          />
          <svg
            class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <WartaList :wartas="listWarta" :isLoading="store.isLoading" @read-more="openModal" />
    </section>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-[#0c0a09]/60 backdrop-blur-sm" @click="closeModal"></div>

          <!-- Modal Content -->
          <div
            class="bg-[#ffffff] rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl scale-100 transition-transform"
            @click.stop
          >
            <div class="p-8 overflow-y-auto">
              <div class="absolute top-6 right-6 flex gap-2">
                <button
                  @click="shareContent(selectedItem)"
                  class="text-[#a8a29e] hover:text-[#0c0a09] bg-[#f5f5f5] hover:bg-[#e7e5e4] rounded-full p-2 transition-colors"
                  title="Bagikan"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="closeModal"
                  class="text-[#a8a29e] hover:text-[#0c0a09] bg-[#f5f5f5] hover:bg-[#e7e5e4] rounded-full p-2 transition-colors"
                >
                  <span class="sr-only">Close</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <p class="text-[12px] font-semibold tracking-[0.96px] text-[#800000] uppercase mb-4">
                {{
                  selectedItem?.formattedDate ||
                  formatDate(
                    selectedItem?.tanggal_tayang || selectedItem?.tanggal || selectedItem?.date,
                  )
                }}
              </p>
              <h2
                class="font-serif text-[32px] md:text-[40px] font-bold text-[#0c0a09] leading-[1.1] mb-3 pr-8"
              >
                {{
                  selectedItem?.judul ||
                  selectedItem?.tema ||
                  selectedItem?.title ||
                  selectedItem?.nama_ibadah ||
                  selectedItem?.kategori
                }}
              </h2>
              <p
                v-if="selectedItem?.nats"
                class="text-[#800000] italic text-[16px] mb-6 font-serif"
              >
                {{ selectedItem.nats }}
              </p>

              <!-- Tambahan Informasi untuk Jadwal Ibadah -->
              <div
                v-else-if="selectedItem?.lokasi"
                class="flex flex-wrap gap-4 text-[#4e4e4e] text-[14px] mb-6 bg-[#f5f5f5] p-4 rounded-xl border border-[#e7e5e4]"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-[#800000]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="font-medium">{{ formatWaktu(selectedItem.waktu) }} WIB</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-[#800000]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span class="font-medium">{{ selectedItem.lokasi }}</span>
                </div>
              </div>
              <div v-else class="mb-4"></div>

              <!-- Gambar Warta di dalam Modal Detail -->
              <div
                v-if="
                  selectedItem?.display_gambar || selectedItem?.url_gambar || selectedItem?.gambar
                "
                class="mb-6 rounded-xl overflow-hidden shadow-sm border border-[#e7e5e4]"
              >
                <img
                  :src="
                    selectedItem?.display_gambar || selectedItem?.url_gambar || selectedItem?.gambar
                  "
                  alt="Media Warta"
                  class="w-full h-auto max-h-[400px] object-cover"
                />
              </div>

              <div class="text-[#4e4e4e] text-[16px] leading-[1.6] space-y-4 whitespace-pre-wrap">
                {{
                  selectedItem?.isi_renungan ||
                  selectedItem?.isi ||
                  selectedItem?.content ||
                  selectedItem?.ringkasan ||
                  selectedItem?.excerpt ||
                  selectedItem?.keterangan
                }}
              </div>

              <!-- Tombol Buka Tautan -->
              <div v-if="selectedItem?.link" class="mt-8 flex justify-start">
                <a
                  :href="selectedItem.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="tautan-button"
                  style="--clr: #800000"
                >
                  <span>Buka Tautan</span>
                  <span class="tautan-button__icon-wrapper">
                    <svg
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="tautan-button__icon-svg"
                      width="10"
                    >
                      <path
                        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.28-9.224-.048 6.912 2.456.024z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <svg
                      viewBox="0 0 14 15"
                      fill="none"
                      width="10"
                      xmlns="http://www.w3.org/2000/svg"
                      class="tautan-button__icon-svg tautan-button__icon-svg--copy"
                    >
                      <path
                        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.28-9.224-.048 6.912 2.456.024z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Floating Prayer Widget (Dynamic Island Style) -->
    <Teleport to="body">
      <!-- KHUSUS MOBILE: Dynamic Island di Kanan Bawah -->
      <div class="fixed bottom-5 right-5 z-[90] md:hidden pointer-events-auto">
        <div
          class="bg-[#800000] text-white rounded-full shadow-2xl flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-2 border-[#eab308]"
          :class="showPrayerPopup ? 'w-[190px] h-12' : 'w-12 h-12'"
        >
          <!-- Icon Doa Icons8 -->
          <router-link
            to="/doa"
            class="w-[44px] h-[44px] shrink-0 flex items-center justify-center hover:bg-[#500000] transition-colors rounded-full"
          >
            <img
              src="https://img.icons8.com/fluent-systems-regular/96/ffffff/pray.png"
              alt="pray"
              class="w-[26px] h-[26px] object-contain animate-pulse"
            />
          </router-link>

          <!-- Teks Notifikasi -->
          <router-link
            to="/doa"
            class="flex-1 whitespace-nowrap text-[13px] font-bold tracking-wide transition-opacity duration-300 flex items-center text-[#fef08a]"
            :class="showPrayerPopup ? 'opacity-100 delay-200' : 'opacity-0'"
          >
            Butuh didoakan?
          </router-link>

          <!-- Tombol Close -->
          <button
            v-show="showPrayerPopup"
            @click.prevent="closePrayerPopup"
            class="w-[36px] h-[44px] mr-2 shrink-0 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- KHUSUS DESKTOP: Notifikasi Panah ke arah Navbar -->
      <div
        class="fixed top-[80px] z-[90] hidden md:flex pointer-events-auto transition-all duration-500"
        :class="isVotingActive ? 'right-[18%] lg:right-[20%]' : 'right-[5%] lg:right-[10%]'"
      >
        <transition
          appear
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="-translate-y-4 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="-translate-y-4 opacity-0"
        >
          <div
            v-if="showPrayerPopup"
            class="bg-[#800000] text-white p-3 pr-12 rounded-xl shadow-2xl relative border-2 border-[#eab308]"
          >
            <!-- Segitiga Panah Menunjuk ke Atas -->
            <div
              class="absolute -top-3 right-[40px] w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-transparent border-b-[#eab308]"
            ></div>
            <div
              class="absolute -top-[9px] right-[41px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[9px] border-transparent border-b-[#800000] z-10"
            ></div>

            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20"
              >
                <img
                  src="https://img.icons8.com/fluent-systems-regular/96/ffffff/pray.png"
                  alt="pray"
                  class="w-[22px] h-[22px] object-contain animate-pulse"
                />
              </div>
              <div>
                <p class="text-[14px] font-bold text-[#fef08a] leading-tight mb-0.5">
                  Butuh didoakan?
                </p>
                <p class="text-[12px] text-white/90 font-medium">Klik menu Layanan Doa di atas</p>
              </div>
            </div>

            <!-- Tombol Close Desktop -->
            <button
              @click.prevent="closePrayerPopup"
              class="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </transition>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useChurchStore } from '@/stores/churchStore'
import WartaList from '@/components/WartaList.vue'
import JadwalList from '@/components/JadwalList.vue'

// Fungsi untuk memformat tanggal ISO menjadi "Hari, Tanggal Bulan Tahun"
const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString // return original jika format tidak valid
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const getHari = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
  })
}

const getTanggalOnly = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString // return original jika format tidak valid
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const store = useChurchStore()
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedItem = ref(null)
const showAllRenungan = ref(false)
const showPrayerPopup = ref(false)
let autoCloseTimer = null

const closePrayerPopup = () => {
  showPrayerPopup.value = false
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
}

// Memberikan delay 3 detik setelah semua data ter-load agar notifikasi melebar
// dan otomatis mengecil (hilang) jika tidak diklik setelah 5 detik.
watch(
  () => store.isLoading,
  (loading) => {
    if (!loading) {
      setTimeout(() => {
        showPrayerPopup.value = true

        autoCloseTimer = setTimeout(() => {
          showPrayerPopup.value = false
        }, 5000)
      }, 3000)
    }
  },
  { immediate: true },
)

onMounted(() => {
  store.fetchVotingConfig()
  document.title = 'GKJW Sukolilo | Beranda Jemaat'
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc)
    metaDesc.setAttribute(
      'content',
      'Website resmi Gereja Kristen Jawi Wetan (GKJW) Jemaat Sukolilo. Temukan jadwal ibadah, renungan harian, dan warta jemaat terbaru.',
    )
})

const isVotingActive = computed(() => {
  const activeConfig = store.votingConfig?.is_active
  return (
    activeConfig === true ||
    activeConfig === 'TRUE' ||
    String(activeConfig).toLowerCase() === 'true'
  )
})

// --- Warta Logic ---
// Sort data by date descending
const sortedWarta = computed(() => {
  if (!store.warta.length) return []
  return [...store.warta].sort(
    (a, b) => new Date(b.tanggal || b.date) - new Date(a.tanggal || a.date),
  )
})

// Filter sorted data by search
const filteredWarta = computed(() => {
  if (!searchQuery.value) return sortedWarta.value
  const query = searchQuery.value.toLowerCase()
  return sortedWarta.value.filter((w) => (w.judul || w.title || '').toLowerCase().includes(query))
})

// List Warta (Reguler) di bawah: Menampilkan semua warta termasuk headline
const listWarta = computed(() => {
  return filteredWarta.value
})

// --- Modal Logic ---
const openModal = (item) => {
  selectedItem.value = item
  isModalOpen.value = true
  document.body.style.overflow = 'hidden' // Prevent scrolling behind modal
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedItem.value = null
  }, 200) // Clear after exit animation
  document.body.style.overflow = 'auto'
}

const shareContent = async (item) => {
  if (!item) return

  const url = window.location.origin // Mengambil link website utama (misal: https://gkjwsukolilo.org)
  const dateStr = item.tanggal_tayang || item.tanggal || item.date
  const formattedDate = formatDate(dateStr)

  let shareText = `${url}\n`

  // 1. Format untuk Renungan
  if (item.nats !== undefined) {
    shareText += `${formattedDate}\n\n`
    shareText += `${item.nats}\n\n`
    shareText += `${item.isi_renungan || item.isi || item.content || ''}`
  }
  // 2. Format untuk Jadwal Ibadah
  else if (item.waktu !== undefined || item.lokasi !== undefined) {
    shareText += `Hari, Tanggal : ${formattedDate}\n`
    if (item.waktu) shareText += `Waktu : Pk. ${formatWaktu(item.waktu)} WIB\n`
    if (item.lokasi) shareText += `Tempat : ${item.lokasi}\n`
    shareText += `Tema / Ibadah : ${item.judul || item.nama_ibadah || item.kategori || ''}\n`

    const catatan = item.keterangan || item.desc || item.isi || ''
    if (catatan) {
      shareText += `Catatan : \n${catatan}\n`
    }
  }
  // 3. Format untuk Warta Umum
  else {
    shareText += `Hari, Tanggal : ${formattedDate}\n`
    shareText += `Warta : ${item.judul || item.title || item.kategori || ''}\n\n`
    shareText += `${item.isi || item.content || item.ringkasan || item.excerpt || ''}`
  }

  if (navigator.share) {
    try {
      // Hanya mengirimkan 'text' saja agar layoutnya persis seperti contoh yang Anda berikan
      await navigator.share({
        text: shareText,
      })
    } catch (err) {
      console.error('Gagal membagikan:', err)
    }
  } else {
    // Fallback untuk browser yang tidak mendukung Web Share API (seperti desktop lama)
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert('Informasi berhasil disalin ke clipboard! Silakan paste (tempel) di chat.')
      })
      .catch((err) => {
        console.error('Gagal menyalin teks: ', err)
      })
  }
}

// Schedule Logic: Filter schedules that haven't passed
const validJadwal = computed(() => {
  if (!store.jadwal.length) return []
  const now = new Date()
  now.setHours(0, 0, 0, 0) // Atur filter agar jadwal hari ini tetap tampil sampai ganti hari
  return store.jadwal
    .filter((j) => {
      const jadwalDate = new Date(j.tanggal || j.date || new Date().toISOString())
      return jadwalDate >= now
    })
    .sort((a, b) => new Date(a.tanggal || a.date) - new Date(b.tanggal || b.date))
})

// List Jadwal (Reguler) di bawah: Menampilkan semua jadwal termasuk headline
const listJadwal = computed(() => {
  return validJadwal.value
})

// Format Waktu untuk Jadwal Headline
const formatWaktu = (timeStr) => {
  if (!timeStr) return ''
  if (typeof timeStr === 'string' && timeStr.includes('1899')) {
    const d = new Date(timeStr)
    if (!isNaN(d.getTime())) {
      d.setMinutes(d.getMinutes() + 7)
      d.setSeconds(d.getSeconds() + 12)
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }
  }
  if (typeof timeStr === 'string' && /^\d{2}:\d{2}/.test(timeStr)) {
    return timeStr.substring(0, 5)
  }
  return timeStr
}

// --- Unified Headline Logic ---
const combinedHeadlines = computed(() => {
  const headlines = []

  store.warta.forEach((w) => {
    if (w.is_headline === true || w.is_headline === 'TRUE' || w.is_headline === 'true') {
      headlines.push({
        id: 'warta-' + w.id,
        type: 'warta',
        label: 'Warta Penting',
        title: w.judul || w.title,
        date: w.tanggal || w.date,
        image: w.display_gambar || w.url_gambar || w.gambar,
        desc: w.isi || w.isi_lengkap || w.content || w.ringkasan,
        raw: w,
      })
    }
  })

  validJadwal.value.forEach((j) => {
    if (j.is_headline === true || j.is_headline === 'TRUE' || j.is_headline === 'true') {
      headlines.push({
        id: 'jadwal-' + j.id,
        type: 'jadwal',
        label: 'Jadwal Spesial',
        title: j.nama_ibadah || j.kategori,
        date: j.tanggal || j.date,
        time: j.waktu,
        location: j.lokasi,
        desc: j.keterangan,
        link: j.link,
        image: j.display_gambar || j.url_gambar || j.gambar, // Fallback gambar jadwal
        raw: j,
      })
    }
  })

  // Fallback: Jika admin lupa mencentang satupun headline, kita tampilkan warta terbaru
  if (headlines.length === 0 && sortedWarta.value.length > 0) {
    const w = sortedWarta.value[0]
    headlines.push({
      id: 'warta-' + w.id,
      type: 'warta',
      label: 'Warta Terbaru',
      title: w.judul || w.title,
      date: w.tanggal || w.date,
      image: w.display_gambar || w.url_gambar || w.gambar,
      desc: w.isi || w.isi_lengkap || w.content || w.ringkasan,
      raw: w,
    })
  }

  return headlines.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const currentSlide = ref(0)
let slideInterval

const startSlide = () => {
  slideInterval = setInterval(() => {
    if (combinedHeadlines.value.length > 1) {
      currentSlide.value = (currentSlide.value + 1) % combinedHeadlines.value.length
    }
  }, 5000) // 5 Detik per slide
}
const stopSlide = () => {
  clearInterval(slideInterval)
}
const nextSlide = () =>
  (currentSlide.value = (currentSlide.value + 1) % combinedHeadlines.value.length)
const prevSlide = () =>
  (currentSlide.value =
    (currentSlide.value - 1 + combinedHeadlines.value.length) % combinedHeadlines.value.length)

onMounted(() => startSlide())
onUnmounted(() => stopSlide())

// --- Renungan Logic ---
const sortedRenungan = computed(() => {
  if (!store.renungan.length) return []
  return [...store.renungan].sort(
    (a, b) =>
      new Date(b.tanggal_tayang || b.date || b.tanggal) -
      new Date(a.tanggal_tayang || a.date || a.tanggal),
  )
})

const latestRenungan = computed(() => {
  return sortedRenungan.value.length ? sortedRenungan.value[0] : null
})

const pastRenungan = computed(() => {
  return sortedRenungan.value.slice(1)
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>

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

.selengkapnya-link.white {
  --link-color: #ffffff;
}

.tautan-button {
  line-height: 1.5;
  text-decoration: none;
  display: inline-flex;
  border: none;
  cursor: pointer;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--clr);
  color: #fff;
  border-radius: 10rem;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.3s;
  font-size: 14px;
}

.tautan-button.white-mode {
  color: #0c0a09;
}

.tautan-button.white-mode .tautan-button__icon-wrapper {
  background-color: #0c0a09;
  color: #ffffff;
}

.tautan-button.white-mode:hover {
  background-color: #e7e5e4;
}

.tautan-button__icon-wrapper {
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;
  color: var(--clr);
  background-color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.tautan-button:hover {
  background-color: #000;
}

.tautan-button:hover .tautan-button__icon-wrapper {
  color: #000;
}

.tautan-button.white-mode:hover .tautan-button__icon-wrapper {
  color: #ffffff;
}

.tautan-button__icon-svg--copy {
  position: absolute;
  transform: translate(-150%, 150%);
}

.tautan-button:hover .tautan-button__icon-svg:first-child {
  transition: transform 0.3s ease-in-out;
  transform: translate(150%, -150%);
}

.tautan-button:hover .tautan-button__icon-svg--copy {
  transition: transform 0.3s ease-in-out 0.1s;
  transform: translate(0);
}
</style>
