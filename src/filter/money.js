export const money = (num) =>
  new Intl.NumberFormat('zh-TW').format(Number(num) || 0);