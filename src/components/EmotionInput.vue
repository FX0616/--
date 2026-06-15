<template>
  <div class="emotion-input">
    <h2 class="title">今天感觉怎么样？</h2>
    <div class="emotion-grid">
      <button
        v-for="emotion in emotions"
        :key="emotion.key"
        class="emotion-btn"
        :class="{ active: selectedEmotion === emotion.key }"
        :style="{ '--emotion-color': emotion.color }"
        @click="selectEmotion(emotion.key)"
      >
        <span class="emotion-icon">{{ emotion.icon }}</span>
        <span class="emotion-label">{{ emotion.label }}</span>
      </button>
    </div>
    
    <div class="input-group" v-if="selectedEmotion">
      <textarea
        v-model="description"
        class="description-input"
        placeholder="说说你的心情，我来帮你推荐最合适的放松场所..."
        rows="3"
      ></textarea>
    </div>
    
    <button 
      class="submit-btn" 
      :disabled="!selectedEmotion"
      @click="submit"
    >
      开始探索
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EMOTION_LABELS } from '@/config/amap'

const emit = defineEmits<{
  (e: 'submit', emotion: string, description: string): void
}>()

const emotions = EMOTION_LABELS
const selectedEmotion = ref<string>('')
const description = ref('')

function selectEmotion(key: string) {
  selectedEmotion.value = key
}

function submit() {
  if (selectedEmotion.value) {
    emit('submit', selectedEmotion.value, description.value)
  }
}
</script>

<style scoped>
.emotion-input {
  padding: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 24px;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.emotion-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  border: 3px solid #ffe8e8;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.emotion-btn:hover {
  border-color: var(--emotion-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.emotion-btn.active {
  border-color: var(--emotion-color);
  background: linear-gradient(135deg, color-mix(in srgb, var(--emotion-color) 15%, white) 0%, color-mix(in srgb, var(--emotion-color) 5%, white) 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.emotion-icon {
  font-size: 40px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.emotion-btn:hover .emotion-icon {
  transform: scale(1.1);
}

.emotion-label {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.input-group {
  margin-bottom: 24px;
}

.description-input {
  width: 100%;
  padding: 18px 20px;
  border: 2px solid #ffe8e8;
  border-radius: 16px;
  font-size: 15px;
  resize: none;
  transition: all 0.3s ease;
  background: #fff9f0;
  line-height: 1.6;
}

.description-input:focus {
  outline: none;
  border-color: #ff6b6b;
  background: white;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: linear-gradient(135deg, #ccc 0%, #bbb 100%);
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 768px) {
  .emotion-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>