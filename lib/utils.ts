import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitFormat(format: string) {
  return format.split(/,|\n/).map(word => word.replace(/\s+/g, '').trim()).filter(word => word !== '')
}

export function joinFormat(format: string[]) {
  return format.join(", ");
}
