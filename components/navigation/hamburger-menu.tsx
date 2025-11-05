"use client";

import { useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { type IconType } from "react-icons";
import { HiMenuAlt1 } from "react-icons/hi";

import { FaFilePdf } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { IoDiamondOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface MenuItemLink {
  icon: IconType;
  label: string;
  href: string;
  type?: never;
}

interface MenuItemSeparator {
  type: "separator";
  icon?: never;
  label?: never;
  href?: never;
}

type MenuItem = MenuItemLink | MenuItemSeparator;

const HamburgerMenu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const focusRef = useRef<HTMLButtonElement | null>(null);

  const menuItems: MenuItem[] = [
    { icon: FaFilePdf, label: "PDF変換", href: "/pdf-converter" },
    { icon: FaLayerGroup, label: "パターン管理", href: "/pattern-manager" },
    { type: "separator" },
    { icon: ImSearch, label: "商品検索", href: "/product-search" },
    { type: "separator" },
    { icon: IoDiamondOutline, label: "サブスクリプション", href: "/subscription" }
  ];

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger className="outline-none" asChild>
        <Button variant="ghost" size="icon" className="focus-visible:ring-0 focus-visible:ring-offset-0">
          <HiMenuAlt1 className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 bg-[#f9fafa] py-12 relative"
        hidden={false}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
      >
        <div className="absolute right-3 top-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={() => setDropdownOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {menuItems.map((item, index) =>
          "type" in item ? (
            <DropdownMenuSeparator key={index} className="my-2 bg-[#f9fafa]" />
          ) : (
            <DropdownMenuItem asChild key={index}>
              <Link
                href={item.href}
                className="flex items-center justify-between px-6 py-4 rounded transition-colors group hover:cursor-pointer bg-white hover:bg-m-blue"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 group-hover:text-white" />
                  <span className="text-sm group-hover:text-white">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 group-hover:text-white" />
              </Link>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HamburgerMenu;
