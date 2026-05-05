import { defineStore } from 'pinia'
import axios from 'axios'

// Helper untuk format tanggal "D MMMM YYYY"
const formatTanggal = (rawDate) => {
  if (!rawDate) return ''
  const d = new Date(rawDate)
  if (isNaN(d.getTime())) return rawDate
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const useChurchStore = defineStore('church', {
  state: () => ({
    warta: [],
    renungan: [],
    jadwal: [],
    doa: [],
    isLoading: false,
    isLoaded: false,
    isAuthenticated: false,
    user: null,
    lastUpdated: null,
  }),
  actions: {
    async initializeHomeData() {
      if (this.isLoaded) return // "Load Once" Strategy

      this.isLoading = true
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const [w, r, j, d] = await Promise.all([
          axios.get(`${url}?table=tb_warta&mode=public`),
          axios.get(`${url}?table=tb_renungan&mode=public`),
          axios.get(`${url}?table=tb_jadwal_ibadah&mode=public`),
          axios.get(`${url}?table=tb_request&mode=public`),
        ])

        const wartaRaw = w.data?.data || w.data || []
        this.warta = wartaRaw.map((item) => ({
          ...item,
          gambar: item.url_gambar || item.gambar, // Fallback untuk komponen WartaList & WartaHero
          formattedDate: formatTanggal(item.tanggal || item.date),
        }))

        this.renungan = r.data?.data || r.data || []
        const jadwalRaw = j.data?.data || j.data || []
        this.jadwal = jadwalRaw.map((item) => ({
          ...item,
          gambar: item.url_gambar || item.gambar, // Fallback gambar jadwal
        }))

        const doaRaw = d.data?.data || d.data || []
        this.doa = doaRaw.map((item) => ({
          ...item,
          no_wa: item.no_wa ?? item['no wa'] ?? item.nowa ?? '-',
          jenis_layanan: item.jenis_layanan ?? item['jenis layanan'] ?? 'Permohonan Doa',
          is_on_air: item.is_on_air ?? item['on air'] ?? item.on_air ?? false,
          izin_publik:
            item.izin_publik ??
            item['DIIJIKAN/TIDAK'] ??
            item['diijinkan/tidak'] ??
            item['diijikan/tidak'] ??
            false,
          isi_doa: item.pesan || item.isi_doa, // Backward compatibility untuk komponen DoaCard
          formattedDate: formatTanggal(item.timestamp || item.tanggal || item.date),
        }))

        this.isLoaded = true
        this.lastUpdated = new Date().toISOString()
      } catch (err) {
        console.error('Gagal load data:', err)
      } finally {
        this.isLoading = false
      }
    },

    // Silent refresh: update data di latar belakang tanpa memicu layar loading
    async silentRefresh() {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const [w, r, j, d] = await Promise.all([
          axios.get(`${url}?table=tb_warta&mode=public`),
          axios.get(`${url}?table=tb_renungan&mode=public`),
          axios.get(`${url}?table=tb_jadwal_ibadah&mode=public`),
          axios.get(`${url}?table=tb_request&mode=public`),
        ])

        const wartaRaw = w.data?.data || w.data || []
        this.warta = wartaRaw.map((item) => ({
          ...item,
          gambar: item.url_gambar || item.gambar, // Fallback untuk komponen WartaList & WartaHero
          formattedDate: formatTanggal(item.tanggal || item.date),
        }))

        this.renungan = r.data?.data || r.data || []
        const jadwalRaw = j.data?.data || j.data || []
        this.jadwal = jadwalRaw.map((item) => ({
          ...item,
          gambar: item.url_gambar || item.gambar, // Fallback gambar jadwal
        }))

        const doaRaw = d.data?.data || d.data || []
        this.doa = doaRaw.map((item) => ({
          ...item,
          no_wa: item.no_wa ?? item['no wa'] ?? item.nowa ?? '-',
          jenis_layanan: item.jenis_layanan ?? item['jenis layanan'] ?? 'Permohonan Doa',
          is_on_air: item.is_on_air ?? item['on air'] ?? item.on_air ?? false,
          izin_publik:
            item.izin_publik ??
            item['DIIJIKAN/TIDAK'] ??
            item['diijinkan/tidak'] ??
            item['diijikan/tidak'] ??
            false,
          isi_doa: item.pesan || item.isi_doa,
          formattedDate: formatTanggal(item.timestamp || item.tanggal || item.date),
        }))

        this.lastUpdated = new Date().toISOString()
      } catch (err) {
        console.error('Gagal silent refresh data:', err)
      }
    },

    // Submit new Prayer Request
    async submitDoa(payload) {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const response = await axios.post(
          url,
          JSON.stringify({ action: 'insert', table: 'tb_request', data: payload }),
          { headers: { 'Content-Type': 'text/plain' } },
        )
        if (response.data && response.data.status === 'success') {
          await this.silentRefresh() // Sync data quietly
          return { success: true, message: response.data.message }
        } else {
          throw new Error(response.data?.message || 'Gagal mengirim permohonan doa.')
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || 'Terjadi kesalahan jaringan.',
        )
      }
    },

    // Generic CRUD Action for Admin
    async submitGasAction(action, table, data = null, id = null) {
      const url = import.meta.env.VITE_GAS_API_URL
      const payload = { action, table }
      if (data) payload.data = data
      if (id) payload.id = id

      try {
        const response = await axios.post(url, JSON.stringify(payload), {
          headers: { 'Content-Type': 'text/plain' },
        })
        if (response.data && response.data.status === 'success') {
          await this.silentRefresh() // Re-sync local state after change
          return { success: true, message: response.data.message }
        } else {
          throw new Error(response.data?.message || 'Operasi gagal di sisi server.')
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || 'Terjadi kesalahan jaringan.',
        )
      }
    },

    checkAuth() {
      const session = localStorage.getItem('gkjw_session')
      if (session) {
        try {
          const userData = JSON.parse(session)
          // Validasi objek untuk mencegah bypass apabila localStorage hanya berisi value kosong seperti "{}"
          if (userData && typeof userData === 'object' && Object.keys(userData).length > 0) {
            this.isAuthenticated = true
            this.user = userData
          } else {
            this.logout()
          }
        } catch (e) {
          this.logout()
        }
      }
    },

    async login(id_token) {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const response = await axios.post(
          url,
          JSON.stringify({
            action: 'verify_login',
            id_token: id_token,
          }),
          { headers: { 'Content-Type': 'text/plain' } },
        )

        if (response.data && response.data.status === 'success') {
          const userData = response.data.user
          this.isAuthenticated = true
          this.user = userData
          localStorage.setItem('gkjw_session', JSON.stringify(userData))
          return { success: true }
        } else {
          throw new Error(response.data?.message || 'Verifikasi gagal.')
        }
      } catch (error) {
        this.logout() // Ensure clean state on failure

        if (axios.isAxiosError(error) && error.response?.status === 403) {
          throw new Error('Akses Ditolak. Email Anda tidak terdaftar dalam whitelist Majelis.')
        }
        if (!axios.isAxiosError(error)) {
          throw error // Throw the custom message generated in the try block
        }
        throw new Error(
          error.response?.data?.message || 'Terjadi kesalahan saat menghubungi server otentikasi.',
        )
      }
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('gkjw_session')
    },
  },
})
