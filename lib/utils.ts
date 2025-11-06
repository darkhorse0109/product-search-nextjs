import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcryptjs from "bcryptjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitFormat(format: string) {
  return format.split(/,|\n/).map(word => word.replace(/\s+/g, '').trim()).filter(word => word !== '')
}

export function joinFormat(format: string[]) {
  return format.join(", ");
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

export async function getPdfPageCount(
  fileMode: string,
  pdfFile: File | null,
  multiplePdfFiles: FileList | null
): Promise<number> {
  // @ts-ignore
  const pdfjsLib = await import("pdfjs-dist/build/pdf");
  // @ts-ignore
  const pdfWorker = await import("pdfjs-dist/build/pdf.worker")
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

  async function getFilePageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return doc.numPages;
  }

  if (fileMode === "single" && pdfFile) {
    return await getFilePageCount(pdfFile);
  }

  if (fileMode === "multiple" && multiplePdfFiles && multiplePdfFiles.length) {
    const counts = await Promise.all(Array.from(multiplePdfFiles).map(getFilePageCount));
    return counts.reduce((a, b) => a + b, 0);
  }

  return 0;
}
