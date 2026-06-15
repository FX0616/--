<template>
  <div class="map-view">
    <div ref="mapContainer" class="map-container"></div>
    <div class="map-controls">
      <button class="control-btn" @click="back">
        ← 返回
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { initAMap } from '@/services/amap'
import type { PlaceResult } from '@/services/amap'

const props = defineProps<{
  places: PlaceResult[]
  currentLocation: { lng: number; lat: number } | null
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null

onMounted(async () => {
  if (!mapContainer.value) return
  
  try {
    const AMap = await initAMap()
    map = new AMap.Map(mapContainer.value, {
      zoom: 14,
      center: props.currentLocation 
        ? [props.currentLocation.lng, props.currentLocation.lat] 
        : [116.397428, 39.90923]
    })
    
    if (props.currentLocation) {
      new AMap.Marker({
        position: [props.currentLocation.lng, props.currentLocation.lat],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        map: map
      })
    }
    
    props.places.forEach((place, index) => {
      const marker = new AMap.Marker({
        position: [place.lng || props.currentLocation?.lng || 0, place.lat || props.currentLocation?.lat || 0],
        icon: `https://webapi.amap.com/theme/v1.3/markers/n/mark_${index % 10 + 1}.png`,
        map: map
      })
      
      marker.on('click', () => {
        const infoWindow = new AMap.InfoWindow({
          content: `
            <div style="padding: 12px;">
              <h4 style="margin-bottom: 8px;">${place.name}</h4>
              <p style="font-size: 12px; color: #666;">${place.address}</p>
              <p style="font-size: 12px; color: #999;">距离: ${place.distance}米</p>
            </div>
          `
        })
        infoWindow.open(map, marker.getPosition())
      })
    })
  } catch (error) {
    console.error('地图加载失败:', error)
  }
})

watch(() => props.places, (newPlaces) => {
  if (map && newPlaces.length > 0) {
    map.clearMap()
    newPlaces.forEach((place, index) => {
      new (window as any).AMap.Marker({
        position: [place.lng || 0, place.lat || 0],
        icon: `https://webapi.amap.com/theme/v1.3/markers/n/mark_${index % 10 + 1}.png`,
        map: map
      })
    })
  }
})

function back() {
  emit('back')
}
</script>

<style scoped>
.map-view {
  position: relative;
  height: 100vh;
  width: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.control-btn {
  padding: 12px 20px;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: #f5f5f5;
}
</style>