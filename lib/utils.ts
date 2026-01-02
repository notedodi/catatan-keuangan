import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatDate(date: Date, formatStr: string = 'dd MMM yyyy'): string {
    return format(date, formatStr, { locale: id })
}

export function formatDateTime(date: Date): string {
    return format(date, 'dd MMM yyyy, HH:mm', { locale: id })
}

export function getMonthName(month: number): string {
    const date = new Date(2024, month - 1, 1)
    return format(date, 'MMMM', { locale: id })
}

export function getMonthYear(date: Date): string {
    return format(date, 'MMMM yyyy', { locale: id })
}

export function isToday(date: Date): boolean {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

export function isThisMonth(date: Date): boolean {
    const today = new Date()
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}

export function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}
