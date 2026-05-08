import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import { useChurchStore } from '../stores/churchStore'

// Navigation Guard untuk memblokir akses ke fitur voting jika statusnya sedang tidak aktif
const requireVotingActive = async (to, from, next) => {
  const store = useChurchStore()
  if (!store.votingConfig) {
    await store.fetchVotingConfig()
  }
  const activeConfig = store.votingConfig?.is_active
  const isVotingActive =
    activeConfig === true ||
    activeConfig === 'TRUE' ||
    String(activeConfig).toLowerCase() === 'true'
  if (!isVotingActive) {
    next('/') // Lempar ke Beranda Publik (karena ini hanya dipakai untuk URL Jemaat)
  } else {
    next()
  }
}

// Navigation Guard untuk memblokir akses KPU (Hak Akses Spesial)
const requireKPU = (to, from, next) => {
  const store = useChurchStore()
  if (!store.isKPU) {
    next('/admin') // Lempar kembali ke halaman depan Admin
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Beranda' },
    },
    {
      path: '/doa',
      name: 'doa',
      component: () => import('@/views/public/DoaView.vue'),
      meta: { title: 'Layanan Doa' },
    },
    {
      path: '/tentang',
      name: 'tentang',
      component: () => import('@/views/public/TentangView.vue'),
      meta: { title: 'Tentang Kami' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: { title: 'Login Majelis' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'Portal Admin' },
      children: [
        {
          path: 'warta',
          name: 'admin-warta',
          component: () => import('@/views/admin/WartaManager.vue'),
          meta: { title: 'Kelola Warta' },
        },
        {
          path: 'renungan',
          name: 'admin-renungan',
          component: () => import('@/views/admin/RenunganManager.vue'),
          meta: { title: 'Kelola Renungan' },
        },
        {
          path: 'jadwal',
          name: 'admin-jadwal',
          component: () => import('@/views/admin/JadwalManager.vue'),
          meta: { title: 'Kelola Jadwal' },
        },
        {
          path: 'doa',
          name: 'admin-doa',
          component: () => import('@/views/admin/AdminDoa.vue'),
          meta: { title: 'Moderasi Doa' },
        },
        {
          path: 'voter',
          name: 'admin-voter',
          component: () => import('@/views/admin/VoterManager.vue'),
          meta: { title: 'Manajemen Pemilih' },
          beforeEnter: requireKPU,
        },
        {
          path: 'kandidat',
          name: 'admin-kandidat',
          component: () => import('@/views/admin/KandidatManager.vue'),
          meta: { title: 'Kelola Kandidat' },
          beforeEnter: requireKPU,
        },
        {
          path: 'voting-config',
          name: 'admin-voting-config',
          component: () => import('@/views/admin/VotingConfigManager.vue'),
          meta: { title: 'Konfigurasi Voting' },
          beforeEnter: requireKPU,
        },
        {
          path: 'live-count',
          name: 'admin-live-count',
          component: () => import('@/views/admin/LiveCount.vue'),
          meta: { title: 'Live Count Pemilihan' },
          beforeEnter: requireKPU,
        },
      ],
    },
    {
      path: '/voting',
      name: 'voting-home',
      component: () => import('@/views/voting/VotingHomeView.vue'),
      meta: { title: 'Portal Pemilihan Majelis' },
      beforeEnter: requireVotingActive,
    },
    {
      path: '/voting/login',
      name: 'voting-login',
      component: () => import('@/views/voting/LoginView.vue'),
      meta: { title: 'Login Bilik Suara' },
      beforeEnter: requireVotingActive,
    },
    {
      path: '/voting/dashboard',
      name: 'voting-dashboard',
      component: () => import('@/views/voting/DashboardView.vue'),
      meta: { title: 'Bilik Suara Digital' },
      beforeEnter: requireVotingActive,
    },
  ],
})

router.beforeEach((to, from) => {
  const store = useChurchStore()

  // Ensure auth state is loaded from localStorage before protecting routes
  if (!store.isAuthenticated && to.name !== 'login') {
    store.checkAuth()
  }

  // Menggunakan matched.some() agar sub-route/route berlapis tetap terproteksi
  if (to.matched.some((record) => record.meta.requiresAuth) && !store.isAuthenticated) {
    return { name: 'login' }
  }
})

router.afterEach((to) => {
  // Mengganti judul tab browser secara dinamis mengikuti halaman
  const baseTitle = 'GKJW Jemaat Sukolilo'
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
})

export default router
