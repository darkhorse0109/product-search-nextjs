import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { env } from "@/lib/config";

const getFileUrl = async (pdfFile : File) => {
  const buffer = Buffer.from(await pdfFile.arrayBuffer());
  // Generate a unique name for the image
  const fileName = Date.now() + "_" + pdfFile.name.replace(/\s+/g, "_");

  // Construct the full path where the image will be saved
  const filePath = path.join(process.cwd(), "public/files", fileName);

  await writeFile(filePath, buffer);
  const file_url = path.join(process.cwd(), "public/files", fileName);
  return file_url;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfFiles = formData.getAll('file') as File[];
    const formatsString = formData.get("formats") as string;
    const target = formData.get("target") as string;
    const numbers = formData.get("numbers") as string;

    const formats: string[] = JSON.parse(formatsString as string) as string[];
    const urlLists = []
    for (let i = 0; i < pdfFiles.length; i ++) {
      const file_url = await getFileUrl(pdfFiles[i])
      urlLists.push(file_url)
    }

    const { data: allResults } = await axios.post(
      `${env.API_ENDPOINT}/v1/parser/pdf`,
      { urlLists, formats, target, numbers },
      { headers: { Authorization: `Bearer ${env.API_TOKEN}` } }
    );

    return NextResponse.json({ results: allResults }, { status: 200 });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
