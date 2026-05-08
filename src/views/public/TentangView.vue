<template>
  <main class="relative overflow-hidden w-full pb-24 pt-24 md:pt-32 bg-[#f5f5f5] min-h-screen">
    <!-- Atmospheric Gradient Orb -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(244,197,168,0.2)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none md:w-[700px] md:h-[700px]"
    ></div>

    <div class="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
      <!-- Page Header -->
      <div class="text-center mb-16">
        <h1
          class="font-serif text-[48px] md:text-[64px] font-light text-[#0c0a09] tracking-[-1.92px] leading-[1.05] mb-6"
        >
          Tentang Kami
        </h1>
        <p class="text-[16px] text-[#4e4e4e] font-sans max-w-2xl mx-auto leading-[1.6]">
          Mengenal lebih dekat perjalanan pelayanan, struktur kemajelisan, dan jadwal kegiatan
          rutinan di GKJW Jemaat Sukolilo.
        </p>
      </div>

      <!-- 1. Sejarah Section -->
      <section id="sejarah" class="scroll-mt-32 mb-24">
        <h2
          class="font-serif text-[32px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px] mb-6"
        >
          Sejarah Pelayanan
        </h2>
        <div
          class="bg-[#ffffff] rounded-[24px] p-8 md:p-12 border border-[#e7e5e4] shadow-sm relative overflow-hidden"
        >
          <p class="text-[16px] text-[#4e4e4e] font-sans leading-[1.7] mb-5">
            Gereja Kristen Jawi Wetan (GKJW) Jemaat Sukolilo hadir sebagai wujud nyata dari
            pelayanan kasih di tengah masyarakat. Sejak awal berdirinya, gereja ini telah menjadi
            tempat bernaung, bertumbuh, dan melayani bagi banyak keluarga Kristen di wilayah
            Sukolilo dan sekitarnya.
          </p>
          <p class="text-[16px] text-[#4e4e4e] font-sans leading-[1.7] mb-8">
            Melalui berbagai dinamika zaman, GKJW Sukolilo terus berkomitmen untuk menjaga warisan
            teologi dan kebudayaan, sambil tetap relevan dengan kebutuhan jemaat masa kini. Kami
            percaya bahwa setiap langkah perjalanan sejarah gereja ini adalah bagian dari
            manifestasi karya Tuhan yang indah bagi umat-Nya.
          </p>
          <blockquote
            class="border-l-[3px] border-[#800000] pl-6 italic font-serif text-[22px] md:text-[24px] text-[#292524] leading-[1.4] bg-[#fafafa] p-6 rounded-r-2xl"
          >
            "Ebenezer: Sampai di sini TUHAN telah menolong kita."
            <span
              class="block mt-2 text-[15px] font-sans font-bold text-[#800000] not-italic uppercase tracking-widest"
              >1 Samuel 7:12</span
            >
          </blockquote>
        </div>
      </section>

      <!-- 2. Jadwal Pelayanan Static -->
      <section id="jadwal-pelayanan" class="scroll-mt-32 mb-24">
        <h2
          class="font-serif text-[32px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px] mb-6"
        >
          Jadwal Pelayanan Rutin
        </h2>
        <div class="bg-[#ffffff] rounded-[24px] border border-[#e7e5e4] shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr
                  class="bg-[#f0efed] text-[#777169] text-[12px] uppercase tracking-[0.96px] font-bold"
                >
                  <th class="p-6 border-b border-[#e7e5e4] w-[40%]">Nama Ibadah</th>
                  <th class="p-6 border-b border-[#e7e5e4] w-[30%]">Waktu</th>
                  <th class="p-6 border-b border-[#e7e5e4] w-[30%]">Lokasi</th>
                </tr>
              </thead>
              <tbody class="text-[#0c0a09] text-[15px] font-medium font-sans">
                <tr class="hover:bg-[#fafafa] transition-colors">
                  <td class="p-6 border-b border-[#e7e5e4]">Ibadah Minggu Umum (Pagi)</td>
                  <td class="p-6 border-b border-[#e7e5e4] text-[#800000]">
                    Setiap Minggu, 06:00 WIB
                  </td>
                  <td class="p-6 border-b border-[#e7e5e4]">Gedung Gereja Induk</td>
                </tr>
                <tr class="hover:bg-[#fafafa] transition-colors">
                  <td class="p-6 border-b border-[#e7e5e4]">Ibadah Minggu Umum (Sore)</td>
                  <td class="p-6 border-b border-[#e7e5e4] text-[#800000]">
                    Setiap Minggu, 18:00 WIB
                  </td>
                  <td class="p-6 border-b border-[#e7e5e4]">Gedung Gereja Induk</td>
                </tr>
                <tr class="hover:bg-[#fafafa] transition-colors">
                  <td class="p-6 border-b border-[#e7e5e4]">Ibadah Anak & Remaja</td>
                  <td class="p-6 border-b border-[#e7e5e4] text-[#800000]">
                    Setiap Minggu, 08:00 WIB
                  </td>
                  <td class="p-6 border-b border-[#e7e5e4]">Gedung Pendapa / Ruang Kelas</td>
                </tr>
                <tr class="hover:bg-[#fafafa] transition-colors">
                  <td class="p-6 border-b border-[#e7e5e4]">Ibadah Pemahaman Alkitab (PA)</td>
                  <td class="p-6 border-b border-[#e7e5e4] text-[#800000]">
                    Setiap Rabu, 18:00 WIB
                  </td>
                  <td class="p-6 border-b border-[#e7e5e4]">Keluarga (Sesuai Wilayah)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 3. Struktur Organisasi -->
      <section id="organisasi" class="scroll-mt-32 mb-24">
        <h2
          class="font-serif text-[32px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px] mb-12 text-center"
        >
          Struktur Organisasi
        </h2>
        <div class="flex flex-col items-center">
          <!-- Level 1: Pendeta -->
          <div
            class="bg-[#ffffff] rounded-[24px] p-6 border border-[#e7e5e4] shadow-sm text-center w-full max-w-[280px] hover:shadow-md transition-all"
          >
            <h3 class="font-sans font-bold text-[18px] text-[#0c0a09] leading-tight mb-1">
              PENDETA
            </h3>
            <p class="text-[12px] text-[#800000] font-bold uppercase tracking-wider">
              Pimpinan Gereja
            </p>
            <div class="mt-4 pt-4 border-t border-[#e7e5e4]">
              <p class="text-[14px] text-[#a8a29e] italic">Nama belum tersedia</p>
            </div>
          </div>

          <!-- Connector -->
          <div class="w-px h-10 bg-[#d6d3d1]"></div>

          <!-- Level 2: Ketua PHMJ -->
          <div
            class="bg-[#ffffff] rounded-[24px] p-6 border border-[#e7e5e4] shadow-sm text-center w-full max-w-[280px] hover:shadow-md transition-all"
          >
            <h3 class="font-sans font-bold text-[18px] text-[#0c0a09] leading-tight mb-1">
              KETUA PHMJ
            </h3>
            <p class="text-[12px] text-[#800000] font-bold uppercase tracking-wider">
              Majelis Jemaat
            </p>
            <div class="mt-4 pt-4 border-t border-[#e7e5e4]">
              <p class="text-[14px] text-[#a8a29e] italic">Nama belum tersedia</p>
            </div>
          </div>

          <!-- Connector -->
          <div class="w-px h-10 bg-[#d6d3d1]"></div>

          <!-- Level 3: Komisi A - J -->
          <div class="w-full bg-[#f0efed] rounded-[32px] p-8 border border-[#e7e5e4]">
            <h3 class="font-serif text-[24px] font-bold text-[#0c0a09] text-center mb-8">
              Ketua Komisi
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div
                v-for="letter in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']"
                :key="letter"
                class="bg-[#ffffff] rounded-[16px] p-5 border border-[#e7e5e4] shadow-sm text-center hover:shadow-md transition-all"
              >
                <h4 class="font-sans font-bold text-[16px] text-[#0c0a09] leading-tight mb-1">
                  Komisi {{ letter }}
                </h4>
                <div class="mt-3 pt-3 border-t border-[#e7e5e4]">
                  <p class="text-[13px] text-[#a8a29e] italic">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Donasi & Persembahan Section -->
      <section id="donasi" class="scroll-mt-32 mb-24">
        <h2
          class="font-serif text-[32px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px] mb-6"
        >
          Donasi & Persembahan
        </h2>
        <div
          class="bg-[#ffffff] rounded-[24px] p-8 md:p-12 border border-[#e7e5e4] shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden"
        >
          <div class="flex-1">
            <p class="text-[16px] text-[#4e4e4e] font-sans leading-[1.7] mb-6">
              Bagi Jemaat yang rindu untuk memberikan persembahan syukur, persepuluhan, atau donasi
              guna mendukung pelayanan GKJW Jemaat Sukolilo, dapat menyalurkannya melalui rekening
              resmi gereja di bawah ini.
            </p>
            <div
              class="bg-[#f0efed] p-6 rounded-xl inline-block w-full max-w-md border border-[#e7e5e4]"
            >
              <p class="text-[12px] font-bold tracking-wider uppercase text-[#777169] mb-1">
                Bank BCA
              </p>
              <p
                class="font-serif text-[28px] md:text-[32px] font-bold text-[#800000] tracking-widest mb-2"
              >
                123 456 7890
              </p>
              <p class="text-[14px] font-medium text-[#0c0a09]">a.n. GKJW Sukolilo</p>
            </div>
          </div>

          <!-- Ikon Hati / Kasih -->
          <div class="w-full md:w-1/3 flex justify-center shrink-0 mt-6 md:mt-0">
            <div
              class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#faf7f2] flex items-center justify-center border-[6px] md:border-8 border-[#ffffff] shadow-md"
            >
              <svg
                class="w-10 h-10 md:w-12 md:h-12 text-[#800000]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Kontak Section -->
      <section id="kontak" class="scroll-mt-32 mb-12">
        <h2
          class="font-serif text-[32px] md:text-[36px] font-bold text-[#0c0a09] tracking-[-0.36px] mb-6"
        >
          Hubungi Kami
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Contact Info -->
          <div
            class="bg-[#ffffff] rounded-[24px] p-8 md:p-12 border border-[#e7e5e4] shadow-sm flex flex-col gap-8 justify-center"
          >
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              class="flex items-center gap-5 text-[#0c0a09] hover:text-[#800000] transition-colors group"
            >
              <div
                class="w-14 h-14 shrink-0 rounded-full bg-[#f0efed] group-hover:bg-[#800000]/10 flex items-center justify-center transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </div>
              <div>
                <p class="text-[12px] font-bold tracking-wider uppercase text-[#777169] mb-1">
                  Telepon / WhatsApp
                </p>
                <p class="font-medium text-[16px]">+62 812-3456-7890</p>
              </div>
            </a>

            <a
              href="mailto:sekretariat@gkjwsukolilo.org"
              class="flex items-center gap-5 text-[#0c0a09] hover:text-[#800000] transition-colors group"
            >
              <div
                class="w-14 h-14 shrink-0 rounded-full bg-[#f0efed] group-hover:bg-[#800000]/10 flex items-center justify-center transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <p class="text-[12px] font-bold tracking-wider uppercase text-[#777169] mb-1">
                  Email Resmi
                </p>
                <p class="font-medium text-[16px]">sekretariat@gkjwsukolilo.org</p>
              </div>
            </a>

            <!-- Social Icons -->
            <div class="social-wrapper flex gap-4 pt-6 border-t border-[#e7e5e4]">
              <a href="#" target="_blank" class="icon instagram">
                <span class="tooltip">Instagram</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="#" target="_blank" class="icon youtube">
                <span class="tooltip">YouTube</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Map Frame -->
          <div
            class="h-[350px] md:h-full bg-[#e7e5e4] rounded-[24px] overflow-hidden border border-[#e7e5e4] shadow-sm"
          >
            <!-- Google Maps iframe (Menggunakan Titik Koordinat Sukolilo Surabaya / placeholder) -->
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6534573177726!2d112.77583681477508!3d-7.280206194745367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa689e4726cd%3A0xc3c5f5a2a22238fc!2sGKJW%20Jemaat%20Sukolilo!5e0!3m2!1sen!2sid!4v1680000000000!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Menangani auto-scroll jika diakses via link /tentang#sejarah dll
onMounted(() => {
  const route = useRoute()
  if (route.hash) {
    const el = document.querySelector(route.hash)
    if (el) {
      // Jeda tipis untuk memastikan layout berhasil di-render
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }
  document.title = 'Tentang Kami | GKJW Sukolilo'
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc)
    metaDesc.setAttribute(
      'content',
      'Sejarah pelayanan, jadwal ibadah rutin, struktur organisasi, dan kontak resmi GKJW Jemaat Sukolilo Surabaya.',
    )
})
</script>

<style scoped>
.social-wrapper {
  display: inline-flex;
  list-style: none;
}

.social-wrapper .icon {
  position: relative;
  background: #0c0a09;
  color: #fff;
  z-index: 0;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  text-decoration: none;
}

.social-wrapper .icon::after {
  content: '';
  position: absolute;
  display: inline-block;
  height: 100%;
  width: 100%;
  background-color: transparent;
  z-index: -1;
  border-radius: 50%;
  top: 100%;
}

.social-wrapper .icon:hover:after {
  animation: bg-pos 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1 both;
  animation-timing-function: ease-in-out;
}

.social-wrapper .icon:hover {
  color: #fff;
  overflow: unset;
  transition: color 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation: overflow-toggle 0.7s;
}

.social-wrapper .tooltip {
  position: absolute;
  top: 0;
  font-size: 13px;
  font-weight: 600;
  background: #fff;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  white-space: nowrap;
}

.social-wrapper .tooltip::before {
  position: absolute;
  content: '';
  height: 8px;
  width: 8px;
  background: #fff;
  bottom: -3px;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  transition: all 0.3s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.social-wrapper .icon:hover .tooltip {
  top: -45px;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.social-wrapper .icon:hover span,
.social-wrapper .icon:hover .tooltip {
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}

.social-wrapper .instagram::after {
  background-color: #e4405f;
}
.social-wrapper .youtube::after {
  background-color: #ff0000;
}

.social-wrapper .instagram:hover .tooltip,
.social-wrapper .instagram:hover .tooltip::before {
  background: #e4405f;
  color: #fff;
}

.social-wrapper .youtube:hover .tooltip,
.social-wrapper .youtube:hover .tooltip::before {
  background: #ff0000;
  color: #fff;
}

@keyframes bg-pos {
  0% {
    top: 100%;
  }
  100% {
    top: 0;
  }
}

@keyframes overflow-toggle {
  0% {
    overflow: hidden;
  }
  100% {
    overflow: visible;
  }
}
</style>
