import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names and resolves Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a numeric value as currency.
 */
export function formatCurrency(
  value: number,
  { currency = "USD", locale = "en-US" }: { currency?: string; locale?: string } = {}
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a number with compact notation (e.g. 1.2K).
 */
export function formatNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)
}

/**
 * Formats a date relative to now or as a short date.
 */
export function formatDate(value: Date | string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

/**
 * Formats a date as month year (e.g. Nov 2024).
 */
export function formatMonthYear(value: Date | string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
