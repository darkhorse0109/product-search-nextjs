import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { type NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { PDFDocument } from 'pdf-lib'
import { writeFile } from 'fs/promises'
import { env } from '@/lib/config'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get('pdf') as File
    const formatsString = formData.get('formats') as string

    // Validate inputs
    if (!pdfFile) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      )
    }

    if (!formatsString) {
      return NextResponse.json(
        { error: 'Formats parameter is required' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const formats: string[] = JSON.parse(formatsString as string) as string[];

    // Generate a unique name for the image
    const fileName = Date.now() + "_" + pdfFile.name.replace(/\s+/g, "_");

    // Construct the full path where the image will be saved
    const filePath = path.join(process.cwd(), "public/files", fileName);

    await writeFile(filePath, buffer);
    const file_url = path.join(process.cwd(), "public/files", fileName);
    console.log(file_url, formats)

    const allResults = await axios.post(
      `${env.API_ENDPOINT}/v1/parser/pdf`,
      { file_url, formats },
      {
        headers: {
          Authorization: `Bearer ${env.API_TOKEN}`,
        },
      }
    )

    return NextResponse.json(allResults.data)
  } catch (error) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse PDF' },
      { status: 500 }
    )
  }
}
