"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFilePdf } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { SlDiamond } from "react-icons/sl";

import IconGradient from "@/components/gradient/icon-gradient"

const NavBar = () => {  
  const pathname = usePathname();
  const LinkItems = [
    { icon: FaFilePdf, label: "PDF変換", href: "/pdf-converter" },
    { icon: FaLayerGroup, label: "パターン管理", href: "/pattern-manager" },
    { icon: ImSearch, label: "商品検索", href: "/product-search" },
    { icon: SlDiamond, label: "サブスクリプション", href: "/subscription" }
  ];

  return (
    <>
      <IconGradient />
      <nav className="w-full hidden md:flex border-b-4 border-solid border-gray-200">
        <div className="flex h-14">
          <div className="w-full flex md:space-x-3 lg:space-x-6 xl:space-x-9">
            {LinkItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col justify-center md:pr-5 lg:pr-10 xl:pr-15"
                >
                  <div className="flex items-center group space-x-3">
                    <item.icon className="h-5 w-5" style={{ fill: "url(#icon-gradient)" }} />
                    <span className="text-base">{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 translate-y-1 w-full h-1 rounded-full bg-gradient-to-r from-m-blue to-m-purple" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
