'use client'

import Image from 'next/image'
import { useState } from 'react'

import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { credits_per_page } from '@/lib/config';

const SubscriptionPage = () => {
  const [subscription, setSubscription] = useState<string>("Trial")

  const handlePlusPlanPurchase = () => {

  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col grow bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <div className='w-full bg-[#F1F4FF] rounded-2xl px-4 sm:px-6 lg:px-12 xl:px-16 py-16'>
        <div className="w-full relative flex-grow mx-auto grid md:grid-cols-2 gap-6 lg:gap-12">
          {/* Trial Plan */}
          <div className={`relative h-[480px] flex flex-col rounded-xl shadow-sm ${subscription === "Trial" ? "bg-blue-200" : "bg-white"}`}>
            <Image
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              src="/icons/trial.png"
              alt="Trial"
              width={50}
              height={50}
            />
            <div className="pt-10 pb-6 px-4">
              <div className="flex flex-col items-center mb-12">
                <h3 className="text-[40px] font-bold mb-12">トライアル</h3>
                <div className="relative w-full flex flex-col items-center">
                  <div className="flex gap-[6px] absolute -left-5 top-3 -translate-y-full skew-x-[-30deg]">
                  <div className="text-white bg-gradient-to-r from-[#2F47BA] to-[#3B59E8] px-4 py-1">
                    <p className="text-[25px] font-medium skew-x-[30deg]">無料プラン</p>
                  </div>
                  <div className="w-[6px] h-[45px] bg-gradient-to-r from-[#2F47BA] to-[#3B59E8]"></div>
                </div>
                </div>
              </div>
              
              <ul className="flex flex-col gap-3 my-6 ml-4 sm:ml-6 md:ml-4 lg:ml-6 xl:ml-8">
                <li className="flex items-start">
                  <IoMdCheckmarkCircleOutline className="w-5 h-5 text-m-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">アカウント作成時のみ適用</span>
                </li>
                <li className="flex items-start">
                  <IoMdCheckmarkCircleOutline className="w-5 h-5 text-m-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">300クレジット付与（1回限り）</span>
                </li>
              </ul>
            </div>
            {subscription === "Trial" && (
            <div className="w-full mx-auto px-3 pb-8 mt-auto">
              <p className="text-center text-lg border-gray-700 shadow-md justify-center p-4 bg-white rounded font-bold">
                現在のプラン
              </p>
            </div> 
            )}
          </div>

          {/* Plus Plan */}
          <div className={`relative h-[480px] flex flex-col rounded-xl border shadow-[0_30px_120px_rgba(47,71,186,0.2)] ${subscription === "Plus" ? "bg-blue-200" : "bg-white"}`}>
            <Image
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              src="/icons/plus.png"
              alt="Plus"
              width={50}
              height={50}
            />
            <div className="absolute top-0 right-0 text-white font-bold text-sm [--f:0.5em] leading-[1.8] px-[1.8em] pb-[var(--f)] [border-image:conic-gradient(#0008_0_0)_51%/var(--f)] [clip-path:polygon(100%_calc(100%_-_var(--f)),100%_100%,calc(100%_-_var(--f))_calc(100%_-_var(--f)),var(--f)_calc(100%_-_var(--f)),0_100%,0_calc(100%_-_var(--f)),999px_calc(100%_-_var(--f)_-_999px),calc(100%_-_999px)_calc(100%_-_var(--f)_-_999px))] [transform:translate(calc((1_-_cos(45deg))*100%),_-100%)_rotate(45deg)] origin-[0%_100%] bg-gradient-to-r from-[#7F41ED] to-[#3036E0]">
              Best Value
            </div>
            <div className="pt-10 pb-6 px-4">
              <div className="flex flex-col items-center mb-12">
                <h3 className="text-[40px] font-bold mb-12">プラス</h3>
                  <div className="relative w-full flex flex-col items-center">
                    <p className="flex items-end my-4">
                      <span className="text-5xl font-bold">3,000</span>
                      <span>円 / 月あたり</span>
                    </p>
                    <p className="absolute -bottom-4 text-sm">年間請求額36,000円</p>
                    <div className="flex gap-[6px] absolute -left-5 top-3 -translate-y-full skew-x-[-30deg]">
                      <div className="text-white bg-gradient-to-r from-[#2F47BA] to-[#3B59E8] px-4 py-1">
                        <p className="text-[25px] font-medium skew-x-[30deg]">有料プラン</p>
                      </div>
                      <div className="w-[6px] h-[45px] bg-gradient-to-r from-[#2F47BA] to-[#3B59E8]"></div>
                    </div>
                  </div>
              </div>
              <ul className="flex flex-col gap-3 ml-4 sm:ml-6 md:ml-4 lg:ml-6 xl:ml-8">
                <li className="flex items-start">
                  <IoMdCheckmarkCircleOutline className="w-5 h-5 text-m-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">月額制（毎月のお支払いが必要です）</span>
                </li>
                <li className="flex items-start">
                  <IoMdCheckmarkCircleOutline className="w-5 h-5 text-m-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">1,000クレジット付与／月</span>
                </li>
              </ul>
            </div>
            { subscription === "Trial" ? (
              <div className="w-full px-3 pb-8 mt-auto">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-4 bg-m-blue hover:bg-blue-700 text-white hover:text-white justify-center shadow-md p-7"
                  onClick={handlePlusPlanPurchase}
                >
                  <span className="text-center text-lg">Plusプランを購入</span>
                  <FaArrowRight />
                </Button>
              </div>
            ) : (
              <div className="w-full mx-auto px-3 pb-8 mt-auto">
                <p className="text-center text-lg border-gray-700 shadow-md justify-center p-4 bg-white rounded font-bold">
                  現在のプラン
                </p>
              </div> 
            )}
          </div>
        </div>
        
        <div className="w-full relative rounded-2xl shadow-2xl bg-gradient-to-tr from-blue-50 via-white to-indigo-100 overflow-hidden mt-10">
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg viewBox="0 0 300 100" className="w-full h-full opacity-10">
              <circle cx="40" cy="100" r="60" fill="#6366F1" />
              <circle cx="280" cy="40" r="50" fill="#818CF8" />
            </svg>
          </div>

          <div className="relative z-10 p-6 sm:p-8">
            <h2 className="font-bold text-[22px] sm:text-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-transparent bg-clip-text drop-shadow mb-4">クレジット消費方式について</h2>
            <p className="text-base text-gray-700 font-medium">
              分析タイプ<span className="font-semibold text-blue-700">（PDF方式・OCR方式）</span>に応じて、
              <span className="font-semibold underline decoration-indigo-400">消費されるクレジット数</span>が異なります。
            </p>
            
            <div className="my-4 flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-xs sm:text-[13px] shadow-sm">
                ※ クレジットは分析ごとに消費されます
              </span>
              <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-xs sm:text-[13px] shadow-sm">
                ※ ページ数に応じて自動的に計算されます
              </span>
            </div>

            <div className="overflow-x-auto">
              <Table className="min-w-[380px] w-full rounded-xl overflow-hidden shadow border border-blue-100 bg-white">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-100 to-indigo-50">
                    <TableHead className="p-4 text-blue-900 font-bold border-r border-blue-200 text-base text-center">ページ数</TableHead>
                    <TableHead className="p-4 text-blue-900 font-bold border-r border-blue-200 text-base text-center">PDF方式</TableHead>
                    <TableHead className="p-4 text-blue-900 font-bold text-base text-center">OCR方式</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits_per_page.map((credit) => (
                    <TableRow className="hover:bg-blue-50 transition">
                      <TableCell className="py-3 px-4 text-center font-semibold">{credit.page}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{credit.pdf}</TableCell>
                      <TableCell className="py-3 px-4 text-center">{credit.ocr}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage