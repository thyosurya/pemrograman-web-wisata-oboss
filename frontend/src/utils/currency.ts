/**
 * Utility functions for consistent currency formatting across the application
 */

/**
 * Format number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "Rp123.456")
 */
export const formatCurrency = (amount: number): string => {
  // Handle invalid values
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rp0';
  }
  
  const numericAmount = Number(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

/**
 * Format number as shortened Indonesian Rupiah (for display in cards)
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "Rp150K" or "Rp1.5Jt")
 */
export const formatCurrencyShort = (amount: number): string => {
  // Handle invalid values
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rp0';
  }
  
  const numericAmount = Number(amount);
  if (numericAmount >= 1000000) {
    return `Rp${(numericAmount / 1000000).toFixed(1)}Jt`;
  }
  return `Rp${(numericAmount / 1000).toFixed(0)}K`;
};

/**
 * Format number as plain Rupiah number (without currency symbol)
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "123.456")
 */
export const formatNumber = (amount: number): string => {
  // Handle invalid values
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '0';
  }
  
  const numericAmount = Number(amount);
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};
