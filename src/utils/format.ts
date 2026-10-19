/**
 * Format a number to Vietnamese Dong (VNĐ) representation
 * e.g. 24990000 -> "24.990.000 ₫"
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount).replace('VND', '₫').trim();
}

/**
 * Format number with comma / dots
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}
