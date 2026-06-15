export const AMAP_CONFIG = {
  key: 'YOUR_AMAP_API_KEY',
  version: '2.0',
  plugins: ['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Map']
}

export const EMOTION_PLACE_TYPES: Record<string, string[]> = {
  'anxious': ['公园', '咖啡馆', '书店', '瑜伽馆', '冥想空间'],
  'tired': ['温泉', '按摩店', '足浴', 'SPA', '安静的咖啡馆'],
  'irritable': ['公园', '湖边', '森林', '健身房', '跑步路线'],
  'depressed': ['美术馆', '音乐厅', '展览', '植物园', '海边'],
  'stressed': ['公园', '咖啡馆', '茶馆', '图书馆', '电影院'],
  'lonely': ['咖啡馆', '书店', '展览', '社交场所', '活动中心'],
  'confused': ['书店', '咖啡馆', '公园', '美术馆', '心理咨询室'],
  'sad': ['海边', '公园', '电影院', 'SPA', '按摩店'],
  'angry': ['健身房', '公园', '跑步路线', '拳击馆', '发泄室'],
  'bored': ['电影院', '展览', '游乐场', '咖啡馆', '书店'],
  'disappointed': ['公园', '海边', '咖啡馆', '茶馆', '植物园'],
  'nervous': ['冥想空间', '瑜伽馆', '公园', '茶馆', '安静的咖啡馆'],
  'frustrated': ['健身房', '跑步路线', '公园', '咖啡馆', 'SPA']
}

export const EMOTION_LABELS = [
  { key: 'anxious', label: '焦虑', icon: '😰', color: '#f5a623' },
  { key: 'tired', label: '疲惫', icon: '😫', color: '#9b59b6' },
  { key: 'irritable', label: '烦躁', icon: '😤', color: '#e74c3c' },
  { key: 'depressed', label: '低落', icon: '😔', color: '#3498db' },
  { key: 'stressed', label: '压力大', icon: '😣', color: '#e67e22' },
  { key: 'lonely', label: '孤独', icon: '🥺', color: '#8e44ad' },
  { key: 'confused', label: '迷茫', icon: '😕', color: '#1abc9c' },
  { key: 'sad', label: '伤心', icon: '😢', color: '#34495e' },
  { key: 'angry', label: '愤怒', icon: '😠', color: '#c0392b' },
  { key: 'bored', label: '无聊', icon: '😴', color: '#7f8c8d' },
  { key: 'disappointed', label: '失望', icon: '😞', color: '#95a5a6' },
  { key: 'nervous', label: '紧张', icon: '😨', color: '#d35400' },
  { key: 'frustrated', label: '沮丧', icon: '😩', color: '#27ae60' }
]