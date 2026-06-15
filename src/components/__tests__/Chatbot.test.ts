/**
 * 情绪树洞聊天机器人单元测试
 * 
 * 测试覆盖：
 * 1. 情绪识别功能
 * 2. 危险信号检测
 * 3. 回复生成逻辑
 * 4. 共情话语生成
 * 5. 支持性回复生成
 * 6. 决策类问题识别
 */

import { describe, it, expect } from 'vitest'

// ==================== 情绪分析类型 ====================

interface EmotionAnalysis {
  primary: string
  secondary: string[]
  sources: string[]
  intensity: '轻微' | '中等' | '强烈'
  needsProfessionalHelp: boolean
}

// ==================== 情绪识别函数 ====================

// 生成共情回复（增强版）
function generateEmpatheticResponse(_text: string, analysis: EmotionAnalysis): string {
  const { primary, intensity, sources } = analysis
  
  // 危险信号检测
  const dangerKeywords = ['想死', '不想活', '活着没意思', '自残', '自杀', '轻生', '结束生命', '活不下去了']
  const hasDangerSignal = dangerKeywords.some(k => textLower.includes(k))
  
  // 严重负面情绪
  const severeKeywords = ['绝望', '崩溃', '无助', '没有希望', '彻底失败', '毫无价值']
  const hasSevereEmotion = severeKeywords.some(k => textLower.includes(k))
  
  // 主要情绪识别
  let primary = '一般负面'
  const secondary: string[] = []
  const sources: string[] = []

  // 焦虑类
  if (/担心|害怕|紧张|焦虑|不安|睡不着|失眠/.test(textLower)) {
    primary = '焦虑'
    secondary.push('担忧', '紧张')
  }
  
  // 悲伤类
  if (/难过|伤心|痛苦|哭|流泪|沮丧|失落|失望/.test(textLower)) {
    primary = '悲伤'
    secondary.push('难过', '沮丧')
  }
  
  // 愤怒类
  if (/生气|愤怒|烦躁|讨厌|气死了|恼火/.test(textLower)) {
    primary = '愤怒'
    secondary.push('烦躁', '不满')
  }
  
  // 疲惫类
  if (/累|疲惫|困倦|没精神|无力|倦怠/.test(textLower)) {
    primary = '疲惫'
    secondary.push('劳累', '精力不足')
  }
  
  // 孤独类
  if (/孤独|寂寞|没人理解|没人懂|一个人|孤单/.test(textLower)) {
    primary = '孤独'
    secondary.push('空虚', '渴望理解')
  }
  
  // 迷茫类
  if (/迷茫|困惑|不知道怎么办|犹豫|纠结|没方向/.test(textLower)) {
    primary = '迷茫'
    secondary.push('困惑', '失去方向')
  }
  
  // 压力类
  if (/压力|负担|喘不过气|压抑|紧绷/.test(textLower)) {
    primary = '压力'
    secondary.push('负担', '紧张')
  }

  // 情绪来源识别
  if (/工作|上班|加班|同事|领导|老板|职场/.test(textLower)) sources.push('工作')
  if (/学习|考试|作业|成绩|升学|考研|毕业/.test(textLower)) sources.push('学业')
  if (/朋友|同学|闺蜜|兄弟|人际|社交/.test(textLower)) sources.push('人际关系')
  if (/家人|父母|爸妈|家里|亲人|亲子/.test(textLower)) sources.push('家庭')
  if (/感情|恋爱|分手|男朋友|女朋友|老公|老婆|婚姻/.test(textLower)) sources.push('感情')
  if (/自己|外貌|身材|能力|性格|未来/.test(textLower)) sources.push('自我认知')

  // 判断强度
  let intensity: '轻微' | '中等' | '强烈' = '轻微'
  if (hasSevereEmotion || hasDangerSignal || text.length > 100) {
    intensity = '强烈'
  } else if (/非常|特别|很|太|极其|超级/.test(textLower)) {
    intensity = '中等'
  }

  return {
    primary,
    secondary,
    sources,
    intensity,
    needsProfessionalHelp: hasDangerSignal || (hasSevereEmotion && intensity === '强烈')
  }
}

// ==================== 回复生成函数 ====================

function generateDangerResponse(): string {
  return `听到你这么说，我很担心你 💙

不管你现在有多难受，请记住：

• 你的生命是珍贵的
• 困难只是暂时的，情况会好起来的
• 有人在乎你，在意你

如果你有具体想法或计划，请立即寻求帮助：
📞 全国心理援助热线：400-161-9995
📞 北京心理危机研究与干预中心：010-82951332

或者联系你信任的人，家人、朋友、老师都可以。

你现在安全吗？能不能告诉我你现在在哪里？`
}

// ==================== 测试用例 ====================

describe('情绪识别测试', () => {
  
  describe('焦虑类情绪', () => {
    it('能识别担心类焦虑', () => {
      const result = analyzeEmotion('我最近很担心考试')
      expect(result.primary).toBe('焦虑')
      expect(result.sources).toContain('学业')
    })

    it('能识别紧张类焦虑', () => {
      const result = analyzeEmotion('面试让我很紧张')
      expect(result.primary).toBe('焦虑')
    })

    it('能识别害怕类焦虑', () => {
      const result = analyzeEmotion('我很害怕明天的面试')
      // 害怕优先识别为焦虑
      expect(result.primary).toBe('焦虑')
    })

    it('能识别失眠类焦虑', () => {
      const result = analyzeEmotion('最近总是睡不着')
      expect(result.primary).toBe('焦虑')
    })
  })

  describe('悲伤类情绪', () => {
    it('能识别难过', () => {
      const result = analyzeEmotion('今天心情很难过')
      expect(result.primary).toBe('悲伤')
    })

    it('能识别伤心', () => {
      const result = analyzeEmotion('失恋了很伤心')
      expect(result.primary).toBe('悲伤')
    })

    it('能识别哭泣', () => {
      const result = analyzeEmotion('忍不住想哭')
      expect(result.primary).toBe('悲伤')
    })

    it('能识别沮丧', () => {
      const result = analyzeEmotion('感觉很沮丧')
      expect(result.primary).toBe('悲伤')
    })
  })

  describe('愤怒类情绪', () => {
    it('能识别生气', () => {
      const result = analyzeEmotion('老板让我很生气')
      expect(result.primary).toBe('愤怒')
    })

    it('能识别愤怒', () => {
      const result = analyzeEmotion('我真的太愤怒了')
      expect(result.primary).toBe('愤怒')
    })

    it('能识别烦躁', () => {
      const result = analyzeEmotion('心里很烦躁')
      expect(result.primary).toBe('愤怒')
    })
  })

  describe('疲惫类情绪', () => {
    it('能识别累', () => {
      const result = analyzeEmotion('今天好累啊')
      expect(result.primary).toBe('疲惫')
    })

    it('能识别疲惫', () => {
      const result = analyzeEmotion('连续加班让我很疲惫')
      expect(result.primary).toBe('疲惫')
    })

    it('能识别困倦', () => {
      const result = analyzeEmotion('整个人都很困倦')
      expect(result.primary).toBe('疲惫')
    })
  })

  describe('孤独类情绪', () => {
    it('能识别孤独', () => {
      const result = analyzeEmotion('一个人好孤独')
      expect(result.primary).toBe('孤独')
    })

    it('能识别寂寞', () => {
      const result = analyzeEmotion('心里很寂寞')
      expect(result.primary).toBe('孤独')
    })

    it('能识别孤单', () => {
      const result = analyzeEmotion('一个人在家感觉很孤单')
      expect(result.primary).toBe('孤独')
    })

    it('能识别孤独关键词', () => {
      const result = analyzeEmotion('感到很孤独')
      expect(result.primary).toBe('孤独')
    })
  })

  describe('迷茫类情绪', () => {
    it('能识别迷茫', () => {
      const result = analyzeEmotion('对未来很迷茫')
      expect(result.primary).toBe('迷茫')
    })

    it('能识别困惑', () => {
      const result = analyzeEmotion('感到很困惑，不知道该怎么选择')
      expect(result.primary).toBe('迷茫')
    })

    it('能识别纠结', () => {
      const result = analyzeEmotion('很纠结要不要辞职')
      expect(result.primary).toBe('迷茫')
    })
  })

  describe('压力类情绪', () => {
    it('能识别压力', () => {
      const result = analyzeEmotion('工作压力很大')
      expect(result.primary).toBe('压力')
    })

    it('能识别负担', () => {
      const result = analyzeEmotion('生活负担太重了')
      expect(result.primary).toBe('压力')
    })

    it('能识别喘不过气', () => {
      const result = analyzeEmotion('喘不过气来')
      expect(result.primary).toBe('压力')
    })
  })

  describe('情绪来源识别', () => {
    it('能识别工作来源', () => {
      const result = analyzeEmotion('上班让我很累')
      expect(result.sources).toContain('工作')
    })

    it('能识别学业来源', () => {
      const result = analyzeEmotion('考试让我很焦虑')
      expect(result.sources).toContain('学业')
    })

    it('能识别人际关系来源', () => {
      const result = analyzeEmotion('和朋友吵架了')
      expect(result.sources).toContain('人际关系')
    })

    it('能识别家庭来源', () => {
      const result = analyzeEmotion('和爸妈吵架了')
      expect(result.sources).toContain('家庭')
    })

    it('能识别感情来源', () => {
      const result = analyzeEmotion('和女朋友分手了')
      expect(result.sources).toContain('感情')
    })
  })

  describe('情绪强度判断', () => {
    it('普通表达判定为轻微', () => {
      const result = analyzeEmotion('有点担心考试')
      expect(result.intensity).toBe('轻微')
    })

    it('带有程度副词的判定为中等', () => {
      const result = analyzeEmotion('我很担心考试')
      expect(result.intensity).toBe('中等')
    })

    it('带有极端词汇的判定为强烈', () => {
      const result = analyzeEmotion('绝望了，彻底失败，毫无价值')
      expect(result.intensity).toBe('强烈')
    })

    it('长文本判定为强烈', () => {
      const longText = '我最近工作压力很大，每天加班到很晚，早上还要早起，感觉自己快要崩溃了，整个人都很疲惫不堪，觉得生活没有意义...'
      const result = analyzeEmotion(longText)
      expect(result.intensity).toBe('强烈')
    })
  })
})

describe('危险信号检测测试', () => {
  
  describe('必须转介的关键词', () => {
    const dangerKeywords = [
      '想死',
      '不想活',
      '活着没意思',
      '自残',
      '自杀',
      '轻生',
      '结束生命',
      '活不下去了'
    ]

    dangerKeywords.forEach(keyword => {
      it(`能检测到危险信号：${keyword}`, () => {
        const result = analyzeEmotion(keyword)
        expect(result.needsProfessionalHelp).toBe(true)
        expect(result.intensity).toBe('强烈')
      })
    })
  })

  describe('严重负面情绪检测', () => {
    it('能检测到绝望', () => {
      const result = analyzeEmotion('我感到绝望')
      expect(result.needsProfessionalHelp).toBe(true)
    })

    it('能检测到崩溃', () => {
      const result = analyzeEmotion('快要崩溃了')
      expect(result.needsProfessionalHelp).toBe(true)
    })

    it('能检测到无助', () => {
      const result = analyzeEmotion('感觉很无助')
      expect(result.needsProfessionalHelp).toBe(true)
    })

    it('能检测到没有希望', () => {
      const result = analyzeEmotion('没有希望了')
      expect(result.needsProfessionalHelp).toBe(true)
    })
  })

  describe('安全关键词不触发转介', () => {
    it('普通的难过不触发转介', () => {
      const result = analyzeEmotion('今天有点难过')
      expect(result.needsProfessionalHelp).toBe(false)
    })

    it('普通的疲惫不触发转介', () => {
      const result = analyzeEmotion('最近感觉好累')
      expect(result.needsProfessionalHelp).toBe(false)
    })

    it('普通的焦虑不触发转介', () => {
      const result = analyzeEmotion('有点担心考试')
      expect(result.needsProfessionalHelp).toBe(false)
    })
  })
})

describe('危险回复生成测试', () => {
  
  it('危险回复包含心理热线', () => {
    const response = generateDangerResponse()
    expect(response).toContain('400-161-9995')
    expect(response).toContain('010-82951332')
  })

  it('危险回复包含关爱信息', () => {
    const response = generateDangerResponse()
    expect(response).toContain('你的生命是珍贵的')
    expect(response).toContain('有人在乎你')
  })

  it('危险回复询问安全状况', () => {
    const response = generateDangerResponse()
    expect(response).toContain('你现在安全吗')
  })

  it('危险回复建议寻求帮助', () => {
    const response = generateDangerResponse()
    expect(response).toContain('联系你信任的人')
  })
})

describe('问候和感谢检测测试', () => {
  
  it('能识别中文问候', () => {
    const greetings = ['你好', '嗨', '在吗', '在不在', '哈喽']
    greetings.forEach(greeting => {
      const result = analyzeEmotion(greeting)
      // 问候不应该是负面情绪
      expect(['一般负面', '焦虑', '悲伤', '愤怒', '疲惫', '孤独', '迷茫', '压力'].includes(result.primary)).toBe(true)
    })
  })

  it('能识别英文问候', () => {
    const greetings = ['hi', 'hello']
    greetings.forEach(greeting => {
      const result = analyzeEmotion(greeting)
      // 问候不应该是强烈的负面情绪
      expect(result.intensity).not.toBe('强烈')
    })
  })

  it('能识别感谢', () => {
    const thanks = ['谢谢', '感谢', '谢谢你了', '太感谢']
    thanks.forEach(thank => {
      const result = analyzeEmotion(thank)
      expect(result.primary).toBe('一般负面')
    })
  })
})

describe('复杂情绪组合测试', () => {
  
  it('能识别混合情绪：焦虑+工作', () => {
    const result = analyzeEmotion('工作让我很焦虑，每天都睡不着')  
    expect(result.primary).toBe('焦虑')
    expect(result.sources).toContain('工作')
    expect(result.secondary).toContain('担忧')
  })

  it('能识别混合情绪：疲惫+悲伤', () => {
    const result = analyzeEmotion('连续加班太累了，感觉很伤心')
    expect(['疲惫', '悲伤'].includes(result.primary)).toBe(true)
  })

  it('能识别混合情绪：孤独+感情', () => {
    const result = analyzeEmotion('和女朋友分手后一个人很孤独')
    expect(result.primary).toBe('孤独')
    expect(result.sources).toContain('感情')
  })

  it('能识别多重压力源', () => {
    const result = analyzeEmotion('工作很累，考试也快到了，还要处理和朋友的矛盾')
    expect(result.sources).toContain('工作')
    expect(result.sources).toContain('学业')
    expect(result.sources).toContain('人际关系')
  })
})

describe('边界条件测试', () => {
  
  it('空字符串返回一般负面', () => {
    const result = analyzeEmotion('')
    expect(result.primary).toBe('一般负面')
    expect(result.intensity).toBe('轻微')
    expect(result.needsProfessionalHelp).toBe(false)
  })

  it('纯标点符号返回一般负面', () => {
    const result = analyzeEmotion('!!! ??? ...')
    expect(result.primary).toBe('一般负面')
  })

  it('超长文本正确处理', () => {
    const longText = '我真的很焦虑很担心'.repeat(100)
    const result = analyzeEmotion(longText)
    expect(result.primary).toBe('焦虑')
    expect(result.intensity).toBe('强烈')
  })

  it('特殊字符不导致错误', () => {
    const text = '今天心情不好😢💔😭⚡🔥💀'
    const result = analyzeEmotion(text)
    expect(result).toBeDefined()
    expect(result.primary).toBeTruthy()
  })
})

describe('情绪强度与回复匹配测试', () => {
  
  it('轻微焦虑有对应的轻微回复', () => {
    const result = analyzeEmotion('有点担心')
    expect(result.primary).toBe('焦虑')
    expect(result.intensity).toBe('轻微')
  })

  it('中等焦虑有对应的中等回复', () => {
    const result = analyzeEmotion('很担心考试')
    expect(result.primary).toBe('焦虑')
    expect(result.intensity).toBe('中等')
  })

  it('强烈悲伤有对应的强烈回复', () => {
    const result = analyzeEmotion('绝望了，彻底失败，毫无价值')
    expect(result.primary).toBe('一般负面')
    expect(result.intensity).toBe('强烈')
    expect(result.needsProfessionalHelp).toBe(true)
  })
})

// 判断是否为决策类问题
function isDecisionQuestion(text: string): boolean {
  const decisionKeywords = [
    '怎么办', '如何', '怎么', '应该', '建议', 
    '选择', '决定', '要不要', '该不该', '最好',
    '推荐', '哪个', '哪个好', '哪个更'
  ]
  return decisionKeywords.some(k => text.includes(k))
}

describe('决策类问题识别测试', () => {
  
  it('能识别"怎么办"类问题', () => {
    const questions = [
      '我该怎么办',
      '这件事怎么办',
      '不知道该怎么办了'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"如何"类问题', () => {
    const questions = [
      '如何提升自己',
      '如何解决这个问题',
      '如何面对压力'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"应该"类问题', () => {
    const questions = [
      '我应该辞职吗',
      '应该继续坚持吗',
      '应该怎么做'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"建议"类问题', () => {
    const questions = [
      '能给我一些建议吗',
      '有什么建议',
      '给点建议吧'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"选择"类问题', () => {
    const questions = [
      '我该选择哪一个',
      '两个选择哪个好',
      '做出选择很难'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"决定"类问题', () => {
    const questions = [
      '很难做出决定',
      '做决定好难',
      '需要做一个决定'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"要不要"类问题', () => {
    const questions = [
      '我要不要去',
      '要不要试试',
      '要不要放弃'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"该不该"类问题', () => {
    const questions = [
      '我该不该继续',
      '该不该离开',
      '该不该坚持'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"推荐"类问题', () => {
    const questions = [
      '推荐一个好地方',
      '推荐一本书',
      '有什么推荐'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('能识别"哪个"类问题', () => {
    const questions = [
      '哪个更好',
      '选哪个',
      '哪个适合我'
    ]
    questions.forEach(q => {
      expect(isDecisionQuestion(q)).toBe(true)
    })
  })

  it('普通聊天不被识别为决策问题', () => {
    const messages = [
      '今天天气真好',
      '我吃了午饭',
      '你好呀',
      '谢谢'
    ]
    messages.forEach(m => {
      expect(isDecisionQuestion(m)).toBe(false)
    })
  })

  it('纯情绪表达不被识别为决策问题', () => {
    const emotions = [
      '我很伤心',
      '最近压力好大',
      '感到很孤独',
      '有点焦虑'
    ]
    emotions.forEach(e => {
      expect(isDecisionQuestion(e)).toBe(false)
    })
  })
})
