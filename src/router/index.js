import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomeView.vue'
import { useChurchStore } from '../stores/churchStore'

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
      ],
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
