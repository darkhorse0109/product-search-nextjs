"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFilePdf } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa";
import { ImSearch } from "react-icons/im";

const Header = () => {
  const pathName = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-50 via-white to-purple-50 shadow-lg border-b border-purple-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-4 group">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent transform transition-all duration-300 hover:from-blue-700 hover:to-cyan-700">
              商品サーチャー
            </span>
          </Link>
          <div className="flex items-center space-x-10">
            <Link
              href="/"
              className={`flex items-center justify-center font-bold transition-all duration-300 ease-out ${
                pathName === "/"
                  ? "text-blue-600 scale-105"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <span className="text-2xl">
                <ImSearch />
              </span>
              <p className="ml-2 text-lg">商品検索</p>
            </Link>
            <Link
              href="/before-pdf-converter"
              className={`flex items-center justify-center font-bold transition-all duration-300 ease-out ${
                pathName === "/before-pdf-converter"
                  ? "text-blue-600 scale-105"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <span className="text-2xl">
                <FaFilePdf />
              </span>
              <p className="ml-2 text-lg">PDF変換（旧）</p>
            </Link>
            <Link
              href="/pdf-converter"
              className={`flex items-center justify-center font-bold transition-all duration-300 ease-out ${
                pathName === "/pdf-converter"
                  ? "text-blue-600 scale-105"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <span className="text-2xl">
                <FaFilePdf />
              </span>
              <p className="ml-2 text-lg">PDF変換（新）</p>
            </Link>
            <Link
              href="/pattern-manager"
              className={`flex items-center justify-center font-bold transition-all duration-300 ease-out ${
                pathName === "/pattern-manager"
                  ? "text-blue-600 scale-105"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <span className="text-2xl">
                <FaLayerGroup />
              </span>
              <p className="ml-2 text-lg">パターン管理</p>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
