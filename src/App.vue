<template>
  <div class="app">
    <header class="app-header">
      <div class="logo">
        <span class="logo-icon">🌳</span>
        <h1>情绪树洞</h1>
      </div>
      <p class="tagline">找到属于你的放松空间</p>
    </header>

    <main class="app-main">
      <div v-if="currentView === 'emotion'" class="main-content">
        <EmotionInput @submit="handleEmotionSubmit" />
        <Chatbot />
      </div>

      <div v-else-if="currentView === 'places'" class="main-content">
        <button class="back-btn" @click="goBack">
          ← 返回选择情绪
        </button>
        <PlaceList 
          :places="recommendedPlaces" 
          :advice="emotionAdvice"
          @select="handlePlaceSelect"
        />
        <button class="view-map-btn" @click="viewMap">
          🗺️ 在地图上查看
        </button>
      </div>

      <div v-else-if="currentView === 'map'">
        <MapView 
          :places="recommendedPlaces"
          :current-location="currentLocation"
          @back="goBackToPlaces"
        />
      </div>
    </main>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ loadingText }}</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="clearError">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmotionInput from '@/components/EmotionInput.vue'
import PlaceList from '@/components/PlaceList.vue'
import MapView from '@/components/MapView.vue'
import Chatbot from '@/components/Chatbot.vue'
import { getCurrentLocation, searchPlaces, getEmotionAdvice } from '@/services/amap'
import type { PlaceResult } from '@/services/amap'

type ViewType = 'emotion' | 'places' | 'map'

const currentView = ref<ViewType>('emotion')
const selectedEmotion = ref('')
const recommendedPlaces = ref<PlaceResult[]>([])
const currentLocation = ref<{ lng: number; lat: number } | null>(null)
const emotionAdvice = ref('')
const loading = ref(false)
const loadingText = ref('')
const error = ref('')

async function handleEmotionSubmit(emotion: string, _description: string) {
  selectedEmotion.value = emotion
  
  loading.value = true
  loadingText.value = '正在获取你的位置...'
  
  try {
    currentLocation.value = await getCurrentLocation()
    
    loadingText.value = '正在为你推荐放松场所...'
    recommendedPlaces.value = await searchPlaces(emotion, currentLocation.value)
    
    emotionAdvice.value = getEmotionAdvice(emotion)
    currentView.value = 'places'
  } catch (err) {
    error.value = '获取位置或推荐失败，请检查网络连接后重试'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

function handlePlaceSelect(place: PlaceResult) {
  console.log('Selected place:', place)
}

function viewMap() {
  currentView.value = 'map'
}

function goBack() {
  currentView.value = 'emotion'
  recommendedPlaces.value = []
}

function goBackToPlaces() {
  currentView.value = 'places'
}

function clearError() {
  error.value = ''
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  background-attachment: fixed;
  position: relative;
}

.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.app-header {
  text-align: center;
  padding: 40px 24px 32px;
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.logo h1 {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tagline {
  font-size: 18px;
  color: #666;
  margin: 0;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.6);
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.app-main {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px 40px;
  position: relative;
  z-index: 1;
}

.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.back-btn {
  width: 100%;
  padding: 18px 24px;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  font-size: 15px;
  color: #667eea;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  font-weight: 500;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.05);
  padding-left: 28px;
}

.view-map-btn {
  width: 100%;
  margin-top: 20px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.view-map-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.loading-spinner {
  width: 56px;
  height: 56px;
  border: 5px solid rgba(255, 107, 107, 0.1);
  border-top: 5px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
  font-weight: 500;
}

.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 18px 28px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
  font-weight: 500;
}

.error-message button {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.error-message button:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>