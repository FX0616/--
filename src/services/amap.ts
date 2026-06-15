import AMapLoader from '@amap/amap-jsapi-loader'
import { AMAP_CONFIG, EMOTION_PLACE_TYPES } from '@/config/amap'

export interface PlaceResult {
  name: string
  address: string
  distance: number
  type: string
  rating: number
  photos?: string[]
  openTime?: string
  cost?: string
  lng?: number
  lat?: number
}

const MOCK_LOCATION = {
  lng: 116.397428,
  lat: 39.90923,
  city: '北京市'
}

const MOCK_PLACES: Record<string, PlaceResult[]> = {
  anxious: [
    { name: '朝阳公园', address: '北京市朝阳区朝阳公园路1号', distance: 800, type: '公园', rating: 4.6, openTime: '6:00-22:00', cost: '免费' },
    { name: '西西弗书店', address: '北京市朝阳区三里屯太古里北区', distance: 1200, type: '书店', rating: 4.5, openTime: '10:00-22:00', cost: '免费' },
    { name: '星巴克咖啡', address: '北京市朝阳区望京SOHO', distance: 1500, type: '咖啡馆', rating: 4.4, openTime: '7:00-22:00', cost: '人均35元' },
    { name: 'Pure Yoga', address: '北京市朝阳区国贸中心', distance: 2000, type: '瑜伽馆', rating: 4.8, openTime: '6:00-22:00', cost: '人均200元' },
    { name: '静心冥想空间', address: '北京市朝阳区建国路88号', distance: 2500, type: '冥想空间', rating: 4.7, openTime: '9:00-21:00', cost: '人均150元' }
  ],
  tired: [
    { name: '汉拿山温泉', address: '北京市朝阳区望京街9号', distance: 1000, type: '温泉', rating: 4.5, openTime: '10:00-23:00', cost: '人均198元' },
    { name: '华夏良子', address: '北京市朝阳区三里屯路19号', distance: 1500, type: '按摩店', rating: 4.6, openTime: '10:00-24:00', cost: '人均298元' },
    { name: '御足轩', address: '北京市朝阳区望京西路48号', distance: 1800, type: '足浴', rating: 4.4, openTime: '10:00-24:00', cost: '人均168元' },
    { name: '思妍丽SPA', address: '北京市朝阳区国贸商城', distance: 2200, type: 'SPA', rating: 4.7, openTime: '10:00-21:00', cost: '人均500元' },
    { name: '漫咖啡', address: '北京市朝阳区蓝色港湾', distance: 2500, type: '安静的咖啡馆', rating: 4.3, openTime: '8:00-22:00', cost: '人均45元' }
  ],
  irritable: [
    { name: '奥林匹克森林公园', address: '北京市朝阳区科荟路33号', distance: 2000, type: '公园', rating: 4.7, openTime: '6:00-21:00', cost: '免费' },
    { name: '昆玉河', address: '北京市海淀区昆玉河畔', distance: 3000, type: '湖边', rating: 4.5, openTime: '全天开放', cost: '免费' },
    { name: '香山公园', address: '北京市海淀区买卖街40号', distance: 8000, type: '森林', rating: 4.6, openTime: '6:00-18:00', cost: '门票10元' },
    { name: '浩沙健身', address: '北京市朝阳区望京凯德MALL', distance: 1200, type: '健身房', rating: 4.4, openTime: '8:00-22:00', cost: '人均150元' },
    { name: '奥森跑步路线', address: '北京市朝阳区奥林匹克森林公园', distance: 2000, type: '跑步路线', rating: 4.8, openTime: '全天开放', cost: '免费' }
  ],
  depressed: [
    { name: '中国美术馆', address: '北京市东城区五四大街1号', distance: 5000, type: '美术馆', rating: 4.6, openTime: '9:00-17:00', cost: '免费' },
    { name: '国家大剧院', address: '北京市西城区西长安街2号', distance: 6000, type: '音乐厅', rating: 4.7, openTime: '9:00-17:30', cost: '视演出而定' },
    { name: '今日美术馆', address: '北京市朝阳区百子湾路32号', distance: 3000, type: '展览', rating: 4.5, openTime: '10:00-18:00', cost: '视展览而定' },
    { name: '北京植物园', address: '北京市海淀区香山路', distance: 10000, type: '植物园', rating: 4.6, openTime: '6:00-20:00', cost: '门票10元' },
    { name: '蓝色港湾', address: '北京市朝阳区朝阳公园路6号', distance: 2000, type: '海边', rating: 4.4, openTime: '10:00-22:00', cost: '免费' }
  ],
  stressed: [
    { name: '团结湖公园', address: '北京市朝阳区团结湖路16号', distance: 1500, type: '公园', rating: 4.5, openTime: '6:00-21:00', cost: '免费' },
    { name: '雕刻时光咖啡馆', address: '北京市海淀区成府路23号', distance: 5000, type: '咖啡馆', rating: 4.4, openTime: '9:00-23:00', cost: '人均40元' },
    { name: '老舍茶馆', address: '北京市西城区前门西大街1号', distance: 7000, type: '茶馆', rating: 4.5, openTime: '9:00-21:30', cost: '人均100元' },
    { name: '国家图书馆', address: '北京市海淀区中关村南大街33号', distance: 8000, type: '图书馆', rating: 4.7, openTime: '9:00-21:00', cost: '免费' },
    { name: '万达影城', address: '北京市朝阳区CBD万达广场', distance: 2500, type: '电影院', rating: 4.6, openTime: '10:00-24:00', cost: '人均60元' }
  ]
}

const USE_MOCK_DATA = true

export async function initAMap() {
  if (USE_MOCK_DATA) {
    return Promise.resolve({})
  }
  try {
    return await AMapLoader.load({
      key: AMAP_CONFIG.key,
      version: AMAP_CONFIG.version,
      plugins: AMAP_CONFIG.plugins
    })
  } catch (error) {
    console.error('高德地图初始化失败:', error)
    throw error
  }
}

export async function getCurrentLocation(): Promise<{ lng: number; lat: number; city: string }> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return MOCK_LOCATION
  }
  const AMap = await initAMap()
  
  return new Promise((resolve, reject) => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000
    })
    
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        resolve({
          lng: result.position.lng,
          lat: result.position.lat,
          city: result.addressComponent.city
        })
      } else {
        reject(new Error('获取位置失败'))
      }
    })
  })
}

export async function searchPlaces(
  emotion: string,
  location: { lng: number; lat: number },
  radius: number = 3000
): Promise<PlaceResult[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 800))
    return MOCK_PLACES[emotion] || MOCK_PLACES.anxious
  }
  const AMap = await initAMap()
  const placeTypes = EMOTION_PLACE_TYPES[emotion] || ['公园', '咖啡馆']
  
  const results: PlaceResult[] = []
  
  for (const type of placeTypes) {
    try {
      const placeSearch = new AMap.PlaceSearch({
        pageSize: 5,
        pageIndex: 1,
        city: '',
        types: type
      })
      
      const result = await new Promise<any>((resolve) => {
        placeSearch.searchNearBy(type, [location.lng, location.lat], radius, (_status: string, data: any) => {
          resolve(data)
        })
      })
      
      if (result && result.poiList && result.poiList.pois) {
        result.poiList.pois.forEach((poi: any) => {
          results.push({
            name: poi.name,
            address: poi.address,
            distance: poi.distance,
            type: type,
            rating: poi.rating || 0,
            photos: poi.photos?.map((p: any) => p.url),
            openTime: poi.opentime,
            cost: poi.cost
          })
        })
      }
    } catch (error) {
      console.error(`搜索 ${type} 失败:`, error)
    }
  }
  
  return results.sort((a, b) => a.distance - b.distance).slice(0, 10)
}

export function getEmotionAdvice(emotion: string): string {
  const adviceMap: Record<string, string> = {
    anxious: '深呼吸，找一个安静的地方放松一下',
    tired: '好好休息一下，给自己充充电',
    irritable: '运动一下，释放多余的能量',
    depressed: '去看看美丽的风景，心情会好起来的',
    stressed: '找个喜欢的地方，让身心都放松下来'
  }
  return adviceMap[emotion] || '一切都会好起来的'
}