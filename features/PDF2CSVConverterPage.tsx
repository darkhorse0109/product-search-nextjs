"use client";

import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import LoadingIndicator from "@/components/loading-indicator";
import PDFUploaderButton from "@/components/pdf/pdf-uploader-button";
import TextInput from "@/components/text-input";
import { IPattern } from "@/features/PatternManagerpage";
import { useAuth } from "@/providers/auth-provider";

const PDF2CSVConverterPage: React.FC = () => {
  const { user_id } = useAuth();
  const [fileMode, setFileMode] = useState<string>("single");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For multiple file mode
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const [multiplePdfFiles, setMultiplePdfFiles] = useState<FileList | null>(null);

  const [pageMode, setPageMode] = useState<string>("all");
  const [pageNumbers, setPageNumbers] = useState<string>("");

  const [format, setFormat] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<IPattern[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [target, setTarget] = useState<string>("PDF");
  const [selectedPattern, setSelectedPattern] = useState<string>("");

  useEffect(() => {
    const fetchPatterns = async () => {
      setIsLoading(true);
      const {
        data: { patterns },
        status,
      } = await axios.post("/api/common", { user_id });
      if (status === 200) {
        setPatterns(patterns);
        if (patterns.length > 0) {
          setSelectedPattern(patterns[0].id);
          setFormat(patterns[0].value);
        }
      }
      setIsLoading(false);
    };
    fetchPatterns();
  }, [user_id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfUrl(URL.createObjectURL(file));
      setPdfFile(file);
    } else {
      alert("有効なPDFファイルをアップロードしてください。");
    }
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setMultiplePdfFiles(files);
    } else {
      setMultiplePdfFiles(null);
    }
  };

  const removeMultipleFile = (idx: number) => {
    if (!multiplePdfFiles) return;
    const fileArr = Array.from(multiplePdfFiles);
    fileArr.splice(idx, 1);
    // Create a new FileList using DataTransfer
    const dt = new DataTransfer();
    fileArr.forEach((file) => dt.items.add(file));
    setMultiplePdfFiles(dt.files);
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.files = dt.files;
    }
  };

  const clearPDF = () => {
    setPdfUrl(null);
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId);
    const pattern = patterns.find((p) => p.id === patternId);
    if (pattern) {
      setFormat(pattern.value);
    }
  };

  let splitFormats: string[] = [];

  const downloadCSV = (data: Record<string, any>[], fileName?: string) => {
    const headers = splitFormats;

    // Process data to handle multiple item numbers and equivalent items
    const processedData = data.flatMap((item) => {
      // Split item numbers if multiple exist
      const itemNumbers = item["型番"]
        ?.split(",")
        .map((num: string) => num.trim()) || [""];

      return itemNumbers.map((num: string, index: number) => {
        const newItem = { ...item };

        // Format item number with index if multiple exist
        newItem["型番"] = itemNumbers.length > 1 ? `${num}(${index + 1})` : num;

        // Process quantity - handle both string and number types
        if (newItem["数量"] !== undefined && newItem["数量"] !== null) {
          if (typeof newItem["数量"] === "string") {
            newItem["数量"] = newItem["数量"].replace(/[^0-9.]/g, "");
          } else if (typeof newItem["数量"] === "number") {
            newItem["数量"] = newItem["数量"].toString();
          }
        } else {
          newItem["数量"] = "";
        }

        // Handle equivalent items
        if (newItem["品名"]?.includes("同等")) {
          newItem["同等品"] = "○";
        }

        return newItem;
      });
    });

    // Convert to CSV rows
    const csvRows = [
      headers,
      ...processedData.map((item) =>
        headers.map((header) => {
          const value = item[header];
          return value !== undefined && value !== null ? String(value) : "";
        })
      ),
    ];

    // Convert to CSV string
    const csvContent = csvRows
      .map((row) => row.map((cell: string) => `"${cell}"`).join(","))
      .join("\n");

    // Generate CSV filename from PDF filename
    const pdfFileName = pdfFile?.name || "extracted_data";
    const csvFileName = pdfFileName.replace(/\.pdf$/i, ".csv");

    // Create blob and download
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", csvFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      alert("PDFファイルをアップロードしてください。");
      return;
    }

    splitFormats = format
      .split(/,|\n/)
      .map((word) => word.replace(/\s+/g, "").trim())
      .filter((word) => word !== "");
    if (splitFormats.length === 0) {
      alert("区別する形式を入力してください。");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("formats", JSON.stringify(splitFormats));
      formData.append("target", target);

      const {
        data: { results },
      } = await axios.post("/api/parser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Validate that we have an array
      if (!Array.isArray(results)) {
        throw new Error("抽出されたデータが配列形式ではありません。");
      }

      // Validate array is not empty
      if (results.length === 0) {
        throw new Error("データが抽出されませんでした。");
      }

      downloadCSV(results);
    } catch (error) {
      console.error("Error extracting data:", error);
      alert(
        `データの抽出中にエラーが発生しました: ${
          error instanceof Error ? error.message : "不明なエラー"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <div className="flex flex-col grow bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <main className="flex flex-col container mx-auto px-4 py-10 grow">
        <div className="flex grow space-y-6">
          <div className="flex flex-col w-full grow">
            <h1 className="text-4xl font-bold text-gray-700 tracking-tight">
              PDF変換
            </h1>

            <div className="grid grid-cols-[60%,1fr] gap-10 w-full flex-grow mt-8">
              <div className="flex flex-col w-full p-6 bg-white rounded-lg shadow-md">
                <RadioGroup defaultValue={fileMode} className="flex items-center gap-8" onValueChange={(value) => setFileMode(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single" className="text-base">単一ファイル</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple" id="multiple" />
                    <Label htmlFor="multiple" className="text-base">複数ファイル</Label>
                  </div>
                </RadioGroup>
                {fileMode === "single" ? (
                  pdfUrl && pdfFile ? (
                    <div className="flex flex-col flex-grow mt-4 w-full">
                      <div className="w-full flex items-center gap-3 p-3 border rounded-sm">
                        <FaFilePdf className="text-blue-500 text-3xl" />
                        <p className="flex-1 font-medium">{pdfFile.name}</p>
                        <Button onClick={clearPDF}
                          className="w-auto h-auto bg-pink-500 px-2 py-1 rounded-[2px] text-white text-xs hover:bg-pink-500/90"
                        >
                          削除
                        </Button>
                      </div>
                      <div className="w-full mt-4 flex-grow">
                        <embed
                          src={pdfUrl}
                          type="application/pdf"
                          width="100%"
                          height="100%"
                          className="rounded-lg border"
                        />
                      </div>
                    </div>
                  ) : (
                    <PDFUploaderButton
                      onFileChange={handleFileChange}
                      inputRef={fileInputRef}
                    />
                  )
                ) : (
                  <div className="flex flex-col flex-grow mt-4 w-full overflow-y-auto">
                    <input
                      id="fileUpload"
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handleMultipleFilesChange}
                      ref={multipleFileInputRef}
                      style={{ display: "none" }} // hide real input
                    />

                    <Label 
                      htmlFor="fileUpload" 
                      className="cursor-pointer p-3 bg-m-btn text-white rounded text-center text-base"
                    >
                      ファイルを選択
                    </Label>
                    {multiplePdfFiles && multiplePdfFiles.length > 0 && (
                      <div className="flex flex-col gap-2 mt-4">
                        {Array.from(multiplePdfFiles).map((file, idx) => (
                          <div
                            key={file.name + idx}
                            className="flex items-center gap-2 border rounded-sm p-2"
                          >
                            <FaFilePdf className="text-blue-500 text-xl" />
                            <span className="flex-1 text-sm">{file.name}</span>
                            <Button
                              onClick={() => removeMultipleFile(idx)}
                              className="w-auto h-auto bg-pink-500 px-2 py-1 rounded-[2px] text-white text-xs hover:bg-pink-500/90"
                            >
                              削除
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full px-6 py-8 bg-white rounded-lg shadow-md">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-16">
                    <h2 className="text-lg font-semibold">分析タイプ</h2>
                    <RadioGroup defaultValue={target} className="flex items-center gap-8" onValueChange={(value) => setTarget(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PDF" id="PDF" />
                        <Label htmlFor="PDF" className="text-base">PDF</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OCR" id="OCR" />
                        <Label htmlFor="OCR" className="text-base">OCR</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <h2 className="text-lg font-semibold">ページを指定</h2>
                    <RadioGroup defaultValue={pageMode} className="flex flex-col items-start gap-2" onValueChange={(value) => setPageMode(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="text-base">全ページ</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific" id="specific" />
                        <Label htmlFor="specific" className="text-base">特定ページ</Label>
                      </div>
                    </RadioGroup>
                    {pageMode === "specific" && (
                      <div className="flex flex-col gap-2">
                        <Input
                          placeholder="0, 4, 10"
                          value={pageNumbers}
                          onChange={(e) => setPageNumbers(e.target.value)}
                        />
                        <span className="text-sm">※ ページ番号は 0 から始まりますのでご注意ください。</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <h2 className="text-lg font-semibold">パターン選択</h2>
                    <Select value={selectedPattern} onValueChange={(value) => handlePatternSelect(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {patterns.map((pattern) => (
                          <SelectItem key={pattern.id} value={pattern.id}>{pattern.name}</SelectItem>  
                        ))}
                      </SelectContent>
                    </Select>
                    <TextInput value={format} onChange={setFormat} />
                  </div>
                </div>
                <div className="flex justify-center mt-auto">
                  <Button
                    onClick={handleConvert}
                    disabled={!pdfFile || !format.trim()}
                    className="bg-m-btn px-8 py-6 rounded text-white text-base hover:bg-m-btn/90"
                  >
                    変換する
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDF2CSVConverterPage;
