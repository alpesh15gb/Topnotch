/**
 * Global formatting utility for currency and locales.
 * Pulls from environment variables with sensible defaults.
 */

export const DEFAULT_CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
export const DEFAULT_CURRENCY_CODE = process.env.NEXT_PUBLIC_CURRENCY_CODE || 'INR';
export const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_LOCALE || 'en-IN';

export const formatCurrency = (amount: number, options: Intl.NumberFormatOptions = {}) => {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: 'currency',
        currency: DEFAULT_CURRENCY_CODE,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options
    }).format(amount);
};

export const formatNumber = (amount: number, options: Intl.NumberFormatOptions = {}) => {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options
    }).format(amount);
};

/**
 * Legacy formatter helper - use formatCurrency for new code
 */
export const fmt = (n: number) => DEFAULT_CURRENCY_SYMBOL + Number(n).toLocaleString(DEFAULT_LOCALE, { minimumFractionDigits: 2 });
