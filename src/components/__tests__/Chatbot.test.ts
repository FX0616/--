// 生成共情回复（增强版）
function generateEmpatheticResponse(_text: string, analysis: EmotionAnalysis): string {
  const { primary, intensity, sources } = analysis
