/**
 * 將 ISO 日期字串格式化為「M/D」（zh-TW 數字月日）。
 * 非法或缺失的值回傳 '—'，避免 Intl.DateTimeFormat 對 Invalid Date 丟 RangeError。
 */
export const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric' }).format(date)
}
