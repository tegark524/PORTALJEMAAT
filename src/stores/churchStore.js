import { defineStore } from 'pinia'
import axios from 'axios'

// Helper untuk format tanggal "D MMMM YYYY"
const formatTanggal = (rawDate) => {
  if (!rawDate) return ''
  const d = new Date(rawDate)
  if (isNaN(d.getTime())) return rawDate
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Helper proxy untuk mem-bypass blokir ISP Indonesia (Internet Positif) terhadap ImgBB
const getProxiedImage = (url) => {
  if (!url) return ''
  if (url.includes('i.ibb.co') || url.includes('imgbb.com')) {
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}`
  }
  return url
}

// Helper untuk memparsing waktu (mengatasi format tanggal 1899 dari Google Sheets) khusus untuk pengurutan
const parseWaktuForSort = (timeStr) => {
  if (!timeStr) return '00:00'
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
  return String(timeStr).padStart(5, '0')
}

export const useChurchStore = defineStore('church', {
  state: () => ({
    warta: [],
    renungan: [],
    jadwal: [],
    doa: [],
    kandidat: [], // State untuk Kandidat Voting
    votingConfig: null, // State untuk Konfigurasi Voting
    voters: [], // State untuk Admin: Data Jemaat Pemilih
    suara: [], // State untuk Admin: Data Suara Masuk
    isLoading: false,
    isLoaded: false,
    isAuthenticated: false,
    user: null,

    // State spesifik untuk sistem Voting
    voterSession: null,
    lastUpdated: null,
  }),
  getters: {
    isKPU: (state) => {
      if (!state.user || !state.user.email) return false
      const kpuEmails = (import.meta.env.VITE_KPU_EMAILS || '')
        .toLowerCase()
        .split(',')
        .map((e) => e.trim())
      return kpuEmails.includes(state.user.email.toLowerCase()) || kpuEmails.includes('*')
    },
  },
  actions: {
    async initializeHomeData() {
      if (this.isLoaded) return // "Load Once" Strategy

      // Coba load dari localStorage cache dulu (Stale-While-Revalidate)
      const cached = localStorage.getItem('gkjw_home_cache')
      let hasCache = false
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (parsed && typeof parsed === 'object') {
            this.warta = parsed.warta || []
            this.renungan = parsed.renungan || []
            this.jadwal = parsed.jadwal || []
            this.doa = parsed.doa || []
            this.lastUpdated = parsed.lastUpdated || null
            this.isLoaded = true // Instan hilangkan loading screen!
            hasCache = true
          }
        } catch (e) {
          console.error('Gagal memproses local cache:', e)
        }
      }

      // Jika tidak punya cache, tampilkan loading full-screen
      if (!hasCache) {
        this.isLoading = true
      }

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
          gambar: getProxiedImage(item.url_gambar || item.gambar), // Fallback untuk komponen WartaList & WartaHero
          display_gambar: getProxiedImage(item.url_gambar || item.gambar), // Proxy aman anti-blokir
          formattedDate: formatTanggal(item.tanggal || item.date),
        }))

        this.renungan = r.data?.data || r.data || []
        const jadwalRaw = j.data?.data || j.data || []
        this.jadwal = jadwalRaw
          .map((item) => ({
            ...item,
            gambar: getProxiedImage(item.url_gambar || item.gambar), // Fallback gambar jadwal
            display_gambar: getProxiedImage(item.url_gambar || item.gambar),
          }))
          .sort((a, b) => {
            const dateA = new Date(a.tanggal || a.date || '1970-01-01')
            const dateB = new Date(b.tanggal || b.date || '1970-01-01')
            dateA.setHours(0, 0, 0, 0)
            dateB.setHours(0, 0, 0, 0)

            if (dateA.getTime() === dateB.getTime()) {
              return parseWaktuForSort(a.waktu).localeCompare(parseWaktuForSort(b.waktu))
            }
            return dateA - dateB
          })

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

        // Simpan data terbaru ke cache localStorage
        localStorage.setItem('gkjw_home_cache', JSON.stringify({
          warta: this.warta,
          renungan: this.renungan,
          jadwal: this.jadwal,
          doa: this.doa,
          lastUpdated: this.lastUpdated
        }))
      } catch (err) {
        console.error('Gagal load data:', err)
      } finally {
        this.isLoading = false
      }

      // Jika kita tadi menggunakan cache, trigger pembaruan sunyi setelah halaman ter-load
      if (hasCache) {
        this.silentRefresh()
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
          gambar: getProxiedImage(item.url_gambar || item.gambar), // Fallback untuk komponen WartaList & WartaHero
          display_gambar: getProxiedImage(item.url_gambar || item.gambar),
          formattedDate: formatTanggal(item.tanggal || item.date),
        }))

        this.renungan = r.data?.data || r.data || []
        const jadwalRaw = j.data?.data || j.data || []
        this.jadwal = jadwalRaw
          .map((item) => ({
            ...item,
            gambar: getProxiedImage(item.url_gambar || item.gambar), // Fallback gambar jadwal
            display_gambar: getProxiedImage(item.url_gambar || item.gambar),
          }))
          .sort((a, b) => {
            const dateA = new Date(a.tanggal || a.date || '1970-01-01')
            const dateB = new Date(b.tanggal || b.date || '1970-01-01')
            dateA.setHours(0, 0, 0, 0)
            dateB.setHours(0, 0, 0, 0)

            if (dateA.getTime() === dateB.getTime()) {
              return parseWaktuForSort(a.waktu).localeCompare(parseWaktuForSort(b.waktu))
            }
            return dateA - dateB
          })

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

        // Perbarui cache localStorage dengan data segar
        localStorage.setItem('gkjw_home_cache', JSON.stringify({
          warta: this.warta,
          renungan: this.renungan,
          jadwal: this.jadwal,
          doa: this.doa,
          lastUpdated: this.lastUpdated
        }))
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

    // ============================================
    // MODULE VOTING (Sistem Pemilihan)
    // ============================================

    // Fetch konfigurasi utama (judul, status aktif)
    async fetchVotingConfig() {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const response = await axios.get(`${url}?table=tb_voting_config&mode=public`)
        const data = response.data?.data || response.data || []
        this.votingConfig = data.length > 0 ? data[0] : null
      } catch (err) {
        console.error('Gagal memuat konfigurasi voting:', err)
      }
    },

    // Fetch data pemilih untuk Admin
    async fetchVoters() {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const response = await axios.get(`${url}?table=tb_voter`)
        this.voters = response.data?.data || response.data || []
      } catch (err) {
        console.error('Gagal memuat daftar pemilih:', err)
      }
    },

    // Fetch data suara untuk Live Count Admin
    async fetchSuara() {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const response = await axios.get(`${url}?table=tb_suara`)
        this.suara = response.data?.data || response.data || []
      } catch (err) {
        console.error('Gagal memuat daftar suara:', err)
      }
    },

    checkVoterAuth() {
      const session = localStorage.getItem('gkjw_voter_session')
      if (session) {
        try {
          this.voterSession = JSON.parse(session)
        } catch (e) {
          this.logoutVoter()
        }
      }
    },

    async fetchKandidat() {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const response = await axios.get(`${url}?table=tb_kandidat&mode=public`)
        this.kandidat = response.data?.data || response.data || []
      } catch (err) {
        console.error('Gagal memuat daftar kandidat:', err)
      }
    },

    async verifyVoter(voterId) {
      const url = import.meta.env.VITE_GAS_API_URL
      try {
        const response = await axios.post(
          url,
          JSON.stringify({ action: 'verify_voter', voter_id: voterId }),
          { headers: { 'Content-Type': 'text/plain' } },
        )
        if (response.data && response.data.status === 'success') {
          this.voterSession = {
            ...response.data.voter,
            regions_voted: response.data.regions_voted || [],
            votes_cast: Number(response.data.votes_cast || 0),
            votes_remaining: Number(response.data.votes_remaining || 0),
          }
          localStorage.setItem('gkjw_voter_session', JSON.stringify(this.voterSession))
          return { success: true, votes_remaining: Number(response.data.votes_remaining || 0) }
        } else {
          throw new Error(response.data?.message || 'Gagal memverifikasi data jemaat.')
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || 'Terjadi kesalahan jaringan.',
        )
      }
    },

    async submitVote(candidateIdOrIds) {
      if (!this.voterSession) throw new Error('Sesi pemilih tidak ditemukan.')
      const url = import.meta.env.VITE_GAS_API_URL
      const payload = {
        action: 'submit_vote',
        voter_id: this.voterSession.id,
      }
      if (Array.isArray(candidateIdOrIds)) {
        payload.candidate_ids = candidateIdOrIds.map((id) => id.toString())
      } else {
        payload.candidate_id = candidateIdOrIds.toString()
      }

      try {
        const response = await axios.post(url, JSON.stringify(payload), {
          headers: { 'Content-Type': 'text/plain' },
        })
        if (response.data && response.data.status === 'success') {
          const votesRemaining = Number(response.data.votes_remaining || 0)
          const regionsVoted = response.data.regions_voted || []
          if (this.voterSession) {
            this.voterSession.regions_voted = regionsVoted
            this.voterSession.votes_remaining = votesRemaining
            this.voterSession.votes_cast = Math.max(0, 2 - votesRemaining)
            localStorage.setItem('gkjw_voter_session', JSON.stringify(this.voterSession))
          }
          if (votesRemaining <= 0) {
            this.logoutVoter()
          }
          return {
            success: true,
            message: response.data.message,
            votes_remaining: votesRemaining,
            regions_voted: regionsVoted,
          }
        } else {
          throw new Error(response.data?.message || 'Gagal merekam suara.')
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message || error.message || 'Terjadi kesalahan jaringan.',
        )
      }
    },

    logoutVoter() {
      this.voterSession = null
      localStorage.removeItem('gkjw_voter_session')
    },
  },
})
