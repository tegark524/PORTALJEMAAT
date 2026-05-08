<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
      <!-- Branding -->
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-light text-gray-800">GKJW Sukolilo</h1>
        <h2 class="text-xl font-semibold text-[#800000]">Portal Admin Majelis</h2>
      </div>

      <!-- Login Prompt -->
      <div class="mb-8">
        <p class="text-gray-600">
          Silakan login menggunakan akun Google Majelis yang telah terdaftar.
        </p>
      </div>

      <!-- Google Login Button -->
      <div class="flex justify-center items-center min-h-[44px] mb-6">
        <div v-if="isLoading" class="flex flex-row gap-2 justify-center items-center">
          <div class="w-2.5 h-2.5 rounded-full bg-[#800000] animate-bounce"></div>
          <div
            class="w-2.5 h-2.5 rounded-full bg-[#800000] animate-bounce [animation-delay:-.3s]"
          ></div>
          <div
            class="w-2.5 h-2.5 rounded-full bg-[#800000] animate-bounce [animation-delay:-.5s]"
          ></div>
          <span class="ml-2 text-[#4e4e4e] font-medium text-[14px]">Memverifikasi akses...</span>
        </div>
        <div v-show="!isLoading">
          <GoogleLogin :callback="handleGoogleCallback" popup-type="TOKEN">
            <button class="button" type="button">
              <svg class="svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  class="blue"
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  class="green"
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  class="yellow"
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  class="red"
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span class="text">Login dengan Google</span>
            </button>
          </GoogleLogin>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMsg" class="text-red-600 text-sm font-medium p-3 bg-red-100 rounded-lg">
        <p>{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChurchStore } from '@/stores/churchStore'

const router = useRouter()
const store = useChurchStore()
const errorMsg = ref('')
const isLoading = ref(false)

const handleGoogleCallback = async (response) => {
  errorMsg.value = '' // Clear previous errors
  isLoading.value = true
  try {
    const token = response.credential || response.access_token || response.code
    if (!token) {
      throw new Error('Login gagal. Tidak ada token: ' + JSON.stringify(response))
    }

    await store.login(token)

    router.push('/admin')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Fancy Google hover button made by: csozi | Website: www.csozi.hu*/
.button {
  padding: 10px 20px;
  font-weight: bold;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 35px;
  align-items: center;
  border: solid #0c0a09 2px;
  outline: none;
  background: #ffffff;
  cursor: pointer;
}

.svg {
  height: 25px;
  margin-right: 10px;
  z-index: 6;
}

.button .text {
  z-index: 10;
  font-size: 14px;
}

.button:hover .text {
  animation: text forwards 0.3s;
}

@keyframes text {
  from {
    color: black;
  }
  to {
    color: white;
  }
}

.button:hover::before {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 9%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  opacity: 0;
  border-radius: 300px;
  animation: wave1 2.5s ease-in-out forwards;
}

.button:hover::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 9%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  opacity: 0;
  border-radius: 300px;
  animation: wave2 2.5s ease-in-out forwards;
}

@keyframes wave1 {
  0% {
    z-index: 1;
    background: #eb4335;
    width: 0;
    height: 0;
    opacity: 1;
  }
  1% {
    z-index: 1;
    background: #eb4335;
    width: 0;
    height: 0;
    opacity: 1;
  }
  25% {
    z-index: 1;
    background: #eb4335;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
  26% {
    z-index: 3;
    background: #34a853;
    width: 0;
    height: 0;
    opacity: 1;
  }
  50% {
    z-index: 3;
    background: #34a853;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
  70% {
    z-index: 3;
    background: #34a853;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
  100% {
    z-index: 3;
    background: #34a853;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
}

@keyframes wave2 {
  0% {
    z-index: 2;
    background: #fbbc05;
    width: 0;
    height: 0;
    opacity: 1;
  }
  11% {
    z-index: 2;
    background: #fbbc05;
    width: 0;
    height: 0;
    opacity: 1;
  }
  35% {
    z-index: 2;
    background: #fbbc05;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
  39% {
    z-index: 2;
    background: #fbbc05;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
  40% {
    z-index: 4;
    background: #4285f4;
    width: 0;
    height: 0;
    opacity: 1;
  }
  64% {
    z-index: 4;
    background: #4285f4;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
  100% {
    z-index: 4;
    background: #4285f4;
    width: 800px;
    height: 800px;
    opacity: 1;
  }
}

.button:hover .red {
  animation: disappear 0.1s forwards;
  animation-delay: 0.1s;
}

.button:hover .yellow {
  animation: disappear 0.1s forwards;
  animation-delay: 0.3s;
}

.button:hover .green {
  animation: disappear 0.1s forwards;
  animation-delay: 0.7s;
}

.button:hover .blue {
  animation: disappear 0.1s forwards;
  animation-delay: 1.1s;
}

@keyframes disappear {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(100);
  }
}
</style>
