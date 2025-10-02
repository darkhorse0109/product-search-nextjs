"use client";

import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import {
  ThemeProvider,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaFilePdf } from "react-icons/fa6";
import LoadingIndicator from "@/components/loading-indicator";
import PDFUploaderButton from "@/components/pdf/pdf-uploader-button";
import TextInput from "@/components/text-input";
import theme from "@/lib/theme";
import { IPattern } from "@/features/PatternManagerpage";
import { useAuth } from "@/providers/auth-provider";

const PDF2CSVConverterPage: React.FC = () => {
  const { user_id } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [format, setFormat] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<IPattern[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [target, setTarget] = useState<string>("表分析");
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
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfUrl(URL.createObjectURL(file));
      setPdfFile(file);
    } else {
      alert("有効なPDFファイルをアップロードしてください。");
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

  const downloadCSV = (data: Record<string, any>[]) => {
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

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <div className="flex flex-col grow bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          <ThemeProvider theme={theme}>
            <div className="flex flex-col w-full grow">
              <h1 className="text-4xl font-bold text-gray-700 tracking-tight">
                PDF変換
              </h1>

              <div className="bg-[#fcf8e3] border-[#faebcc] border-[1px] p-5 rounded-sm mt-5">
                <h3 className="text-lg font-bold mb-2">注意事項</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    システムで数値などを変換しているため、出力は必ずしも正しいとは限りません。重要な情報は確認するようにしてください。
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-[60%,1fr] gap-10 w-full flex-grow mt-3">
                <div className="flex flex-col w-full p-6 bg-white rounded-lg shadow-md">
                  {pdfUrl && pdfFile ? (
                    <div className="flex flex-col flex-grow mt-4 w-full">
                      <div className="w-full flex items-center gap-3 p-3 border rounded-sm">
                        <FaFilePdf className="text-blue-500 text-3xl" />
                        <div className="flex-1">
                          <p className="font-medium">{pdfFile.name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{
                              borderRadius: "3px",
                              fontSize: "12px",
                              padding: "3px",
                            }}
                            onClick={clearPDF}
                          >
                            削除
                          </Button>
                        </div>
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
                  )}
                </div>
                <div className="flex flex-col justify-evenly w-full p-6 bg-white rounded-lg shadow-md">
                  <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold">分析タイプ</h2>
                    <RadioGroup
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="flex items-center gap-10"
                      row
                    >
                      <FormControlLabel
                        value="表分析"
                        control={<Radio />}
                        label="パターン1（標準）"
                      />
                      <FormControlLabel
                        value="画像分析"
                        control={<Radio />}
                        label="パターン2（OCR型）"
                      />
                    </RadioGroup>

                    <h2 className="text-xl font-bold">パターン選択</h2>
                    <FormControl fullWidth>
                      <Select
                        labelId="pattern-select-label"
                        value={selectedPattern}
                        onChange={(e) =>
                          handlePatternSelect(e.target.value as string)
                        }
                      >
                        {patterns.map((pattern) => (
                          <MenuItem key={pattern.id} value={pattern.id}>
                            {pattern.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextInput value={format} onChange={setFormat} />
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="contained"
                      onClick={handleConvert}
                      disabled={!pdfFile || !format.trim()}
                    >
                      変換する
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </div>
      </main>
    </div>
  );
};

export default PDF2CSVConverterPage;
