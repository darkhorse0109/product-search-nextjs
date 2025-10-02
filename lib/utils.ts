import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcryptjs from "bcryptjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hashedPassword = async (password: string) => {
  return await bcryptjs.hash(password, 12);
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcryptjs.compare(password, hashedPassword);
};
