<template>
  <div class="chatbot">
    <div class="chat-header">
      <div class="chat-icon">🌱</div>
      <div class="chat-info">
        <h3>情绪树洞</h3>
        <p>你的贴心小伙伴 · AI助手</p>
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.type]"
        v-html="formatMessage(msg.content)"
      ></div>
    </div>

    <div class="chat-input-area">
      <input
        v-model="userInput"
        type="text"
        placeholder="说说你今天的心情..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">发送</button>
    </div>

    <div class="chat-disclaimer">
      <span>⚠️ 我是AI助手，能倾听和陪伴，但不能替代专业人士。</span>
      <span v-if="showProfessionalHelp">如果您感到难以承受，建议寻求专业心理咨询。</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  type: 'bot' | 'user'
  content: string
}

interface EmotionAnalysis {
  primary: string
  secondary: string[]
  sources: string[]
  intensity: '轻微' | '中等' | '强烈'
  needsProfessionalHelp: boolean
  keywords: string[]
}

const messages = ref<Message[]>([])
const userInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const showProfessionalHelp = ref(false)

const messagesContainerRef = ref<HTMLElement | null>(null)

// 初始化欢迎语
function initChat() {
  const welcomeMessages = [
    '你好呀，我是情绪树洞 🌱',
    '不管你有什么烦恼，都可以和我说说',
    '我会认真倾听，陪你度过每一个难过的时刻 💚',
    '今天发生了什么让你心情不好呢？'
  ]
  
  welcomeMessages.forEach((msg, index) => {
    setTimeout(() => {
      messages.value.push({ type: 'bot', content: msg })
      scrollToBottom()
    }, index * 800)
  })
}

// 发送消息
function sendMessage() {
  const content = userInput.value.trim()
  if (!content) return

  messages.value.push({ type: 'user', content })
  userInput.value = ''
  scrollToBottom()

  setTimeout(() => {
    const response = generateResponse(content)
    messages.value.push({ type: 'bot', content: response })
    scrollToBottom()
    
    // 如果检测到严重情绪，显示专业帮助提示
    if (showProfessionalHelp.value) {
      setTimeout(() => {
        messages.value.push({
          type: 'bot',
          content: '如果你觉得很难受，和信任的人聊聊会好一些，比如家人、朋友，或者专业的心理咨询师。他们能给你更多支持 💜'
        })
        scrollToBottom()
      }, 1500)
    }

    // 自动跟进问题
    setTimeout(() => {
      const followUp = generateFollowUp(content)
      if (followUp) {
        messages.value.push({ type: 'bot', content: followUp })
        scrollToBottom()
      }
    }, 2000)
  }, 1000)
}

// 情绪识别 - 增强版
function analyzeEmotion(text: string): EmotionAnalysis {
  const textLower = text.toLowerCase()
  
  // 危险信号检测
  const dangerKeywords = ['想死', '不想活', '活着没意思', '自残', '自杀', '轻生', '结束生命', '活不下去了']
  const hasDangerSignal = dangerKeywords.some(k => textLower.includes(k))
  
  // 严重负面情绪
  const severeKeywords = ['绝望', '崩溃', '无助', '没有希望', '彻底失败', '毫无价值', '撑不住了']
  const hasSevereEmotion = severeKeywords.some(k => textLower.includes(k))
  
  // 提取关键词
  const keywords: string[] = []
  const allKeywords = [
    ...dangerKeywords,
    ...severeKeywords,
    '担心', '害怕', '紧张', '焦虑', '不安', '睡不着', '失眠',
    '难过', '伤心', '痛苦', '哭', '流泪', '沮丧', '失落', '失望',
    '生气', '愤怒', '烦躁', '讨厌', '气死了', '恼火',
    '累', '疲惫', '困倦', '没精神', '无力', '倦怠',
    '孤独', '寂寞', '没人理解', '没人懂', '一个人', '孤单',
    '迷茫', '困惑', '不知道怎么办', '犹豫', '纠结', '没方向',
    '压力', '负担', '喘不过气', '压抑', '紧绷',
    '工作', '上班', '加班', '同事', '领导', '老板', '职场',
    '学习', '考试', '作业', '成绩', '升学', '考研', '毕业',
    '朋友', '同学', '闺蜜', '兄弟', '人际', '社交',
    '家人', '父母', '爸妈', '家里', '亲人', '亲子',
    '感情', '恋爱', '分手', '男朋友', '女朋友', '老公', '老婆', '婚姻',
    '自己', '外貌', '身材', '能力', '性格', '未来'
  ]
  
  allKeywords.forEach(k => {
    if (textLower.includes(k) && !keywords.includes(k)) {
      keywords.push(k)
    }
  })

  // 主要情绪识别（优先级系统）
  let primary = '一般负面'
  const secondary: string[] = []
  const sources: string[] = []

  // 优先级1：危险信号
  if (hasDangerSignal) {
    primary = '危机'
    secondary.push('需要紧急帮助')
  }
  // 优先级2：严重情绪
  else if (hasSevereEmotion) {
    primary = '严重负面'
    secondary.push('严重困扰')
  }
  // 优先级3：焦虑类
  else if (/担心|害怕|紧张|焦虑|不安|睡不着|失眠/.test(textLower)) {
    primary = '焦虑'
    if (/担心/.test(textLower)) secondary.push('担忧')
    if (/紧张/.test(textLower)) secondary.push('紧张')
    if (/睡不着|失眠/.test(textLower)) secondary.push('睡眠问题')
  }
  // 优先级4：悲伤类
  else if (/难过|伤心|痛苦|哭|流泪|沮丧|失落|失望/.test(textLower)) {
    primary = '悲伤'
    if (/难过|伤心/.test(textLower)) secondary.push('难过')
    if (/沮丧/.test(textLower)) secondary.push('沮丧')
    if (/失望/.test(textLower)) secondary.push('失望')
  }
  // 优先级5：愤怒类
  else if (/生气|愤怒|烦躁|讨厌|气死了|恼火/.test(textLower)) {
    primary = '愤怒'
    if (/烦躁/.test(textLower)) secondary.push('烦躁')
    if (/生气/.test(textLower)) secondary.push('不满')
  }
  // 优先级6：疲惫类
  else if (/累|疲惫|困倦|没精神|无力|倦怠/.test(textLower)) {
    primary = '疲惫'
    if (/累/.test(textLower)) secondary.push('劳累')
    if (/困倦/.test(textLower)) secondary.push('精力不足')
  }
  // 优先级7：孤独类
  else if (/孤独|寂寞|没人理解|没人懂|一个人|孤单/.test(textLower)) {
    primary = '孤独'
    if (/没人理解|没人懂/.test(textLower)) secondary.push('渴望理解')
    if (/一个人/.test(textLower)) secondary.push('独处')
  }
  // 优先级8：迷茫类
  else if (/迷茫|困惑|不知道怎么办|犹豫|纠结|没方向/.test(textLower)) {
    primary = '迷茫'
    if (/困惑/.test(textLower)) secondary.push('困惑')
    if (/犹豫|纠结/.test(textLower)) secondary.push('犹豫不决')
  }
  // 优先级9：压力类
  else if (/压力|负担|喘不过气|压抑|紧绷/.test(textLower)) {
    primary = '压力'
    if (/负担/.test(textLower)) secondary.push('负担')
    if (/喘不过气/.test(textLower)) secondary.push('窒息感')
  }

  // 情绪来源识别（可识别多个来源）
  if (/工作|上班|加班|同事|领导|老板|职场/.test(textLower)) sources.push('工作')
  if (/学习|考试|作业|成绩|升学|考研|毕业/.test(textLower)) sources.push('学业')
  if (/朋友|同学|闺蜜|兄弟|人际|社交/.test(textLower)) sources.push('人际关系')
  if (/家人|父母|爸妈|家里|亲人|亲子/.test(textLower)) sources.push('家庭')
  if (/感情|恋爱|分手|男朋友|女朋友|老公|老婆|婚姻/.test(textLower)) sources.push('感情')
  if (/自己|外貌|身材|能力|性格|未来/.test(textLower)) sources.push('自我认知')

  // 判断强度（更精确的算法）
  let intensity: '轻微' | '中等' | '强烈' = '轻微'
  
  // 危险信号或严重情绪直接判定为强烈
  if (hasDangerSignal || hasSevereEmotion) {
    intensity = '强烈'
  }
  // 长文本通常表示更强烈的情绪
  else if (text.length > 100) {
    intensity = '强烈'
  }
  // 检测程度副词
  else if (/非常|特别|很|太|极其|超级|真的/.test(textLower)) {
    const degreeMatch = textLower.match(/(非常|特别|很|太|极其|超级)/g)
    if (degreeMatch && degreeMatch.length >= 2) {
      intensity = '强烈'
    } else {
      intensity = '中等'
    }
  }
  // 多个负面词汇叠加
  else if (keywords.filter(k => !['工作', '学习', '朋友', '家人', '感情'].includes(k)).length >= 3) {
    intensity = '中等'
  }

  return {
    primary,
    secondary,
    sources,
    intensity,
    needsProfessionalHelp: hasDangerSignal || (hasSevereEmotion && intensity === '强烈'),
    keywords
  }
}

// 判断是否为决策类问题
function isDecisionQuestion(text: string): boolean {
  const decisionKeywords = [
    '怎么办', '如何', '怎么', '应该', '建议', 
    '选择', '决定', '要不要', '该不该', '最好',
    '推荐', '哪个', '哪个好', '哪个更', '能不能', '可以吗'
  ]
  return decisionKeywords.some(k => text.includes(k))
}

// 生成回复
function generateResponse(text: string): string {
  const analysis = analyzeEmotion(text)
  
  // 危险信号 - 特殊处理
  if (analysis.needsProfessionalHelp) {
    showProfessionalHelp.value = true
    return generateDangerResponse()
  }

  // 问候检测
  if (/^(你好|嗨|hi|hello|在吗|在不在|哈喽|早上好|下午好|晚上好)/.test(text.toLowerCase())) {
    return getRandomItem([
      '你好呀～ 有什么想聊聊的吗？我在这里陪你 💚',
      '嗨！你来啦，今天过得怎么样？',
      '你好！不管发生什么，我都在这里听你说 🤗',
      '早上好！今天感觉如何？ 🌞',
      '晚上好～ 今天辛苦了吧？ 🌙'
    ])
  }

  // 感谢检测
  if (/谢谢|感谢|谢谢你了|太感谢/.test(text)) {
    return getRandomItem([
      '不客气呀，能帮到你我很开心 💕',
      '能陪伴你我也很开心呢～',
      '不用谢！有需要随时找我 🌟',
      '能帮到你是我的荣幸 💖'
    ])
  }

  // 寻求建议/决策类问题检测
  if (isDecisionQuestion(text)) {
    return generateDecisionResponse(text, analysis)
  }

  // 具体情绪分析 + 人性化回应
  return generateEmpatheticResponse(text, analysis)
}

// 危险信号回复
function generateDangerResponse(): string {
  return `听到你这么说，我很担心你 💙

不管你现在有多难受，请记住：

• 你的生命是珍贵的，世界因你而不同
• 困难只是暂时的，情况会慢慢好起来的
• 一定有人在乎你、关心你

如果你有具体想法或计划，请立即寻求帮助：
📞 全国心理援助热线：400-161-9995（24小时）
📞 北京心理危机研究与干预中心：010-82951332

或者联系你信任的人，家人、朋友、老师都可以。

你现在安全吗？能不能告诉我你现在在哪里？我很担心你。`
}

// 生成决策类回复（专业版）
function generateDecisionResponse(text: string, analysis: EmotionAnalysis): string {
  const { primary, sources, intensity, keywords } = analysis
  
  // 专业决策框架
  const decisionFramework: Record<string, { empathy: string[]; steps: string[]; questions: string[] }> = {
    '工作': {
      empathy: [
        '工作上的选择确实让人纠结，我理解这种压力 😓',
        '职业决策很重要，确实需要谨慎考虑',
        '我能感受到你对工作现状的困扰'
      ],
      steps: [
        '📋 **第一步：明确需求** - 列出对你最重要的3个因素（薪资、发展、氛围、稳定性等）',
        '⚖️ **第二步：利弊分析** - 为每个选项制作SWOT分析表',
        '🔮 **第三步：未来视角** - 想象3年后的自己会如何看待今天的选择',
        '👥 **第四步：寻求建议** - 找信任的前辈或导师聊聊，获取不同视角',
        '💡 **第五步：小步验证** - 如果拿不准，可以先尝试短期体验或实习'
      ],
      questions: ['你目前最不满意工作的哪一点？', '理想的工作状态是什么样的？']
    },
    '学业': {
      empathy: [
        '学习上的困惑确实会让人迷茫，我懂这种感受 📚',
        '面对学业压力，你已经很努力了',
        '我能感受到你对未来的担忧'
      ],
      steps: [
        '🎯 **第一步：明确目标** - 你想要达成什么？考研/就业/出国？',
        '📊 **第二步：现状评估** - 客观分析自己的优势和不足',
        '📅 **第三步：制定计划** - 将大目标分解为可执行的小任务',
        '🎨 **第四步：调整方法** - 如果当前方法无效，尝试新的学习策略',
        '👨‍🏫 **第五步：寻求支持** - 向老师、同学或学长寻求帮助'
      ],
      questions: ['你目前最大的学习困难是什么？', '有没有尝试过不同的学习方法？']
    },
    '人际关系': {
      empathy: [
        '人际关系确实需要用心经营，我理解你的困扰 🤝',
        '和朋友相处难免有摩擦，这很正常',
        '我能感受到你对这段关系的重视'
      ],
      steps: [
        '👂 **第一步：主动倾听** - 尝试理解对方的立场和感受',
        '💬 **第二步：坦诚沟通** - 找一个合适的时机，用"我"语句表达感受',
        '⏸️ **第三步：给彼此空间** - 如果矛盾激烈，先冷静一段时间',
        '🤔 **第四步：自我反思** - 想一想自己在这段关系中的角色',
        '🔄 **第五步：共同成长** - 一起探讨如何改善关系'
      ],
      questions: ['你们之间发生了什么具体的事情？', '你希望这段关系变成什么样？']
    },
    '家庭': {
      empathy: [
        '家庭关系是最温暖也最复杂的，我理解你的难处 🏠',
        '和家人相处难免有矛盾，这不是你的错',
        '我能感受到你对家庭的在意'
      ],
      steps: [
        '💕 **第一步：表达爱** - 让家人知道你关心他们',
        '🗣️ **第二步：有效沟通** - 选择合适的时机，心平气和地表达想法',
        '🤝 **第三步：寻求理解** - 尝试从家人的角度看待问题',
        '🧩 **第四步：寻找共识** - 找到双方都能接受的解决方案',
        '👨‍👩‍👧 **第五步：保持耐心** - 家庭关系的改善需要时间'
      ],
      questions: ['你和家人之间最大的分歧是什么？', '你希望家人如何对待你？']
    },
    '感情': {
      empathy: [
        '感情的事确实让人纠结，我懂这种心痛 💔',
        '爱情里没有对错，重要的是彼此的感受',
        '我能感受到你对这段感情的投入'
      ],
      steps: [
        '❤️ **第一步：自我反思** - 这段关系是否让你感到快乐和成长？',
        '💬 **第二步：坦诚对话** - 和对方好好沟通，了解彼此的想法',
        '⚖️ **第三步：权衡利弊** - 列出继续和分开的理由',
        '🎯 **第四步：明确需求** - 你在感情中最需要什么？',
        '💪 **第五步：勇敢选择** - 无论选择什么，都要相信自己'
      ],
      questions: ['是什么让你开始犹豫这段关系？', '你理想的伴侣是什么样的？']
    },
    '自我认知': {
      empathy: [
        '自我成长是一生的课题，你已经在思考就是进步 🌱',
        '了解自己是一件很有意义的事',
        '我能感受到你对自我提升的渴望'
      ],
      steps: [
        '🔍 **第一步：自我探索** - 通过写日记、冥想了解内心',
        '🌟 **第二步：接纳自己** - 接受自己的优点和缺点',
        '🎯 **第三步：设定目标** - 明确想要成为什么样的人',
        '🚶 **第四步：持续行动** - 每天进步一点点',
        '💖 **第五步：善待自己** - 对自己多一些宽容和关爱'
      ],
      questions: ['你最想改变自己的哪一点？', '什么事情让你感到最有成就感？']
    },
    'general': {
      empathy: [
        '做决定确实不容易，我理解你的纠结 🤔',
        '面对选择时感到迷茫是很正常的',
        '我能感受到你对做出正确选择的渴望'
      ],
      steps: [
        '📝 **第一步：收集信息** - 了解所有可选方案的优缺点',
        '❤️ **第二步：倾听内心** - 你的直觉告诉你什么？',
        '⏰ **第三步：设定期限** - 给自己一个做出决定的时间',
        '🎲 **第四步：小步尝试** - 如果不确定，可以先小规模试错',
        '✅ **第五步：接受结果** - 无论选择什么，都要相信自己的决定'
      ],
      questions: ['这个决定对你来说最重要的是什么？', '你担心的最坏结果是什么？']
    }
  }

  // 根据来源选择合适的框架
  const matchedSources = sources.length > 0 ? sources : ['general']
  const source = matchedSources[0]
  const framework = decisionFramework[source] || decisionFramework['general']
  
  // 根据强度调整共情程度
  let empathyStr = ''
  if (intensity === '强烈') {
    empathyStr = framework.empathy[0]
  } else if (intensity === '中等') {
    empathyStr = framework.empathy[1]
  } else {
    empathyStr = framework.empathy[2]
  }
  
  // 选择一个后续问题
  const followQuestion = getRandomItem(framework.questions)
  
  // 组合回复
  return `${empathyStr}

我为你整理了一个思考框架，希望能帮到你：

${framework.steps.join('\n')}

${followQuestion} 我们可以一起分析～`
}

// 生成共情回复（增强版）
function generateEmpatheticResponse(text: string, analysis: EmotionAnalysis): string {
  const { primary, secondary, intensity, sources } = analysis
  
  // 详细的共情回复
  const empathyMap: Record<string, Record<string, { empathy: string; understanding: string; suggestion: string }[]>> = {
    '焦虑': {
      '轻微': [
        { empathy: '我能感觉到你有点小担心呢 💭', understanding: '偶尔的担心是正常的，说明你很在意这件事', suggestion: '试着做几次深呼吸，让自己放松下来' }
      ],
      '中等': [
        { empathy: '我能理解你的担心，确实会让人心里不踏实 😟', understanding: '这种不确定感会消耗很多精力', suggestion: '把担心的事情写下来，可能会感觉好一些' }
      ],
      '强烈': [
        { empathy: '我能感受到你现在真的很焦虑 😰', understanding: '长期的担心一定让你身心俱疲', suggestion: '建议先放下手头的事，做一些能让你专注的活动，比如听音乐或散步' }
      ]
    },
    '悲伤': {
      '轻微': [
        { empathy: '听起来有点小失落呢 🌧️', understanding: '每个人都有心情不好的时候', suggestion: '给自己一点时间，情绪会慢慢平复的' }
      ],
      '中等': [
        { empathy: '我能感受到你有点难过 😢', understanding: '难过是情绪的正常表达，不需要压抑', suggestion: '如果想哭就哭出来，或者找个信任的人聊聊' }
      ],
      '强烈': [
        { empathy: '我听到你很伤心，眼泪也是情绪的一种出口 💧', understanding: '这么深的悲伤一定有原因', suggestion: '给自己一个拥抱，告诉自己："我现在很难过，但这不是我的错"。如果一直这样，记得寻求帮助' }
      ]
    },
    '愤怒': {
      '轻微': [
        { empathy: '有点小烦躁是难免的 😊', understanding: '愤怒是在提醒我们有些事情需要改变', suggestion: '先深呼吸，数到10再说话' }
      ],
      '中等': [
        { empathy: '能感觉到你有点生气 😤', understanding: '被冒犯或不公对待时生气是正常的', suggestion: '找一个安全的方式释放情绪，比如运动或写下来' }
      ],
      '强烈': [
        { empathy: '我感受到你真的很生气 😠', understanding: '这么强烈的愤怒背后一定有很深的原因', suggestion: '先离开让你生气的环境，等冷静下来再处理问题。记住，伤害自己或别人都不是解决办法' }
      ]
    },
    '疲惫': {
      '轻微': [
        { empathy: '累了吧？休息一下就好啦 🌙', understanding: '身体在提醒你需要充电了', suggestion: '喝杯热茶，闭上眼睛休息一会儿' }
      ],
      '中等': [
        { empathy: '听起来你真的很累了 😩', understanding: '长时间的劳累会消耗身心', suggestion: '放下手头的事，好好休息一下，你值得' }
      ],
      '强烈': [
        { empathy: '我懂，你一定撑了很久了 😔', understanding: '长期的疲惫是身体在发出警告信号', suggestion: '请务必给自己放个假，好好照顾自己。身体是一切的基础，不要透支它' }
      ]
    },
    '孤独': {
      '轻微': [
        { empathy: '偶尔觉得孤单是正常的呀 🌙', understanding: '独处也是一种享受', suggestion: '做一些自己喜欢的事情，和自己好好相处' }
      ],
      '中等': [
        { empathy: '听起来你有点寂寞 😔', understanding: '没人懂的感觉确实很孤独', suggestion: '试着参加一些兴趣小组，遇见志同道合的人' }
      ],
      '强烈': [
        { empathy: '我感受到你很孤独 😢', understanding: '长期的孤独会让人感到无助', suggestion: '不要害怕主动联系别人，真正的朋友会愿意陪伴你。如果实在难受，记得寻求专业帮助' }
      ]
    },
    '迷茫': {
      '轻微': [
        { empathy: '有点困惑是很正常的 😊', understanding: '迷茫说明你在思考未来', suggestion: '不用急着找到答案，慢慢来' }
      ],
      '中等': [
        { empathy: '迷茫说明你在思考，这是好事 🌱', understanding: '探索自我需要时间', suggestion: '试着做一些小尝试，在行动中找到方向' }
      ],
      '强烈': [
        { empathy: '我能感受到你很迷茫 😕', understanding: '不知道方向的时候最让人无助', suggestion: '可以和信任的人聊聊，或者尝试职业测评，帮助了解自己。记住，人生没有标准答案' }
      ]
    },
    '压力': {
      '轻微': [
        { empathy: '有点压力也是成长的一部分呢 💪', understanding: '适度的压力可以成为动力', suggestion: '把任务分解，一步一步来' }
      ],
      '中等': [
        { empathy: '听起来你承受了不少 😓', understanding: '压力大了确实会喘不过气', suggestion: '给自己一点喘息的空间，做一些放松的活动' }
      ],
      '强烈': [
        { empathy: '我感受到你压力很大 😰', understanding: '扛了这么久一定很辛苦', suggestion: '学会说"不"，不要把所有事情都自己扛。必要时寻求帮助不是软弱，而是智慧' }
      ]
    },
    '一般负面': {
      '轻微': [
        { empathy: '嗯嗯，我听着呢 🌿', understanding: '愿意和我说说发生了什么吗？', suggestion: '有时候说出来会好受一些' }
      ],
      '中等': [
        { empathy: '我能感觉到你心情不太好 😔', understanding: '每个人都有情绪低落的时候', suggestion: '做一些让你开心的事情，好好照顾自己' }
      ],
      '强烈': [
        { empathy: '听起来你真的很不好受 😢', understanding: '我能感受到你的痛苦', suggestion: '请记住，你不是一个人。如果感觉无法承受，一定要寻求帮助' }
      ]
    }
  }

  const responses = empathyMap[primary]?.[intensity] || empathyMap['一般负面']['轻微']
  const response = getRandomItem(responses)
  
  // 如果有来源信息，添加针对性建议
  let sourceAdvice = ''
  if (sources.length > 0) {
    const sourceTips: Record<string, string> = {
      '工作': '工作上的压力可以尝试通过调整工作方式来缓解',
      '学业': '学习上的困扰可以找老师或同学帮忙',
      '人际关系': '和人相处有摩擦很正常，沟通是关键',
      '家庭': '家人之间需要多一些理解和包容',
      '感情': '感情的事需要双方共同努力',
      '自我认知': '了解自己是一个漫长的过程，慢慢来'
    }
    sources.forEach(s => {
      if (sourceTips[s]) {
        sourceAdvice += `\n\n${sourceTips[s]}`
      }
    })
  }

  return `${response.empathy}

${response.understanding}

${response.suggestion}${sourceAdvice}`
}

// 生成跟进问题
function generateFollowUp(text: string): string {
  const followUps = [
    '你愿意和我多聊聊吗？我在这里听你倾诉~',
    '最近有没有什么特别想分享的事情呀？',
    '你现在感觉怎么样了呢？',
    '需要我帮你推荐一些放松的场所吗？',
    '还有什么想和我说的吗？',
    '如果你愿意，可以告诉我更多细节，我会认真倾听的',
    '需要我陪你做深呼吸练习吗？'
  ]
  
  // 如果已经是决策类问题，就不再问跟进问题
  if (isDecisionQuestion(text)) {
    return ''
  }
  
  return getRandomItem(followUps)
}

// 格式化消息
function formatMessage(content: string): string {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/•/g, '•')
}

// 工具函数：从数组中随机选择
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    const container = messagesContainerRef.value
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

// 挂载时初始化
initChat()
</script>

<style scoped>
.chatbot {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.chat-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chat-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.chat-info p {
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fa;
}

.message {
  padding: 14px 18px;
  border-radius: 18px;
  line-height: 1.6;
  animation: fadeIn 0.3s ease;
  max-width: 85%;
  white-space: pre-wrap;
}

.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 18px 4px 18px 18px;
}

.message.bot {
  align-self: flex-start;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px 18px 18px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-input-area {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #eee;
}

.chat-input-area input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #eee;
  border-radius: 30px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input-area input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.chat-input-area button {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-input-area button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.chat-disclaimer {
  padding: 12px 20px;
  background: #fff5f5;
  border-top: 1px solid #ffe5e5;
  font-size: 12px;
  color: #8b5cf6;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-disclaimer span:last-child {
  color: #ef4444;
  font-weight: 500;
}

@media (max-width: 768px) {
  .chatbot {
    border-radius: 0;
    box-shadow: none;
    height: 100vh;
  }
  
  .message {
    max-width: 90%;
  }
}
</style>