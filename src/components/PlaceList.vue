<template>
  <div class="place-list">
    <div class="header">
      <h3>为你推荐的放松场所</h3>
      <p class="advice">{{ advice }}</p>
    </div>
    
    <div class="places">
      <div
        v-for="(place, index) in places"
        :key="index"
        class="place-card"
        @click="selectPlace(place)"
      >
        <div class="place-image">
          <img
            v-if="place.photos && place.photos.length > 0"
            :src="place.photos[0]"
            :alt="place.name"
          />
          <div v-else class="placeholder-image">
            <span class="placeholder-icon">📍</span>
          </div>
        </div>
        <div class="place-info">
          <div class="place-header">
            <h4>{{ place.name }}</h4>
            <span class="place-type">{{ place.type }}</span>
          </div>
          <p class="place-address">{{ place.address }}</p>
          <div class="place-meta">
            <span class="distance">{{ formatDistance(place.distance) }}</span>
            <span v-if="place.rating > 0" class="rating">
              ⭐ {{ place.rating }}
            </span>
          </div>
          <div v-if="place.openTime || place.cost" class="place-details">
            <span v-if="place.openTime" class="detail-item">{{ place.openTime }}</span>
            <span v-if="place.cost" class="detail-item">{{ place.cost }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="places.length === 0" class="empty-state">
      <span class="empty-icon">🌿</span>
      <p>附近暂时没有找到合适的场所</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlaceResult } from '@/services/amap'

defineProps<{
  places: PlaceResult[]
  advice: string
}>()

const emit = defineEmits<{
  (e: 'select', place: PlaceResult): void
}>()

function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${distance}米`
  }
  return `${(distance / 1000).toFixed(1)}公里`
}

function selectPlace(place: PlaceResult) {
  emit('select', place)
}
</script>

<style scoped>
.place-list {
  padding: 28px;
}

.header {
  margin-bottom: 28px;
}

.header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.advice {
  font-size: 15px;
  color: #666;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 4px solid #ff6b6b;
  line-height: 1.6;
  font-weight: 500;
}

.places {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.place-card {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.place-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #ffe8e8;
}

.place-image {
  width: 140px;
  height: 120px;
  flex-shrink: 0;
  overflow: hidden;
}

.place-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.place-card:hover .place-image img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 40px;
}

.place-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.place-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.place-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.place-type {
  font-size: 13px;
  color: white;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 500;
}

.place-address {
  font-size: 15px;
  color: #666;
  margin: 0 0 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;
}

.place-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.distance, .rating {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

.place-details {
  display: flex;
  gap: 16px;
}

.detail-item {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 24px;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .place-card {
    flex-direction: column;
  }
  
  .place-image {
    width: 100%;
    height: 180px;
  }
}
</style>