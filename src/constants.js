export const SKILLS = [
  { name: '視覺設計', icon: '✦', description: '把複雜議題變得看得懂' },
  { name: '影音剪輯', icon: '▶', description: '讓現場故事被更多人看見' },
  { name: '社群企劃', icon: '#', description: '用好內容串起青年關注' },
  { name: '翻譯', icon: 'A', description: '讓資訊跨過語言門檻' },
  { name: '課輔陪伴', icon: '＋', description: '支援既有組織的學習方案' },
  { name: '活動支援', icon: '◎', description: '讓倡議活動順利發生' },
  { name: '資料整理', icon: '▤', description: '從資料找出結構性問題' },
  { name: '網站協助', icon: '</>', description: '用科技降低參與門檻' },
  { name: '訪談紀錄', icon: '“”', description: '留下改變發生的證據' },
  { name: '行政協助', icon: '✓', description: '把細節穩穩接住' },
]

export const TASK_MODES = ['線上', '實體', '混合']
export const TASK_STATUSES = ['招募中', '已媒合', '已結束']

export const statusClass = (status) => ({
  招募中: 'status-open',
  已媒合: 'status-matched',
  已結束: 'status-closed',
}[status] || 'status-open')
