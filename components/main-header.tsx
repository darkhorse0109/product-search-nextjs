import Link from "next/link";
import UserBalance from "@/components/navigation/user-balance";
import HamburgerMenu from "@/components/navigation/hamburger-menu";

const MainHeader = () => {
  return (
    <header className="relative flex items-center justify-between pt-8 pb-5">
      <Link
        href="/pdf-converter"
        className="flex items-center space-x-4 group"
      >
        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-m-purple to-m-blue bg-clip-text text-transparent transform transition-all duration-300">
          PDF変換と製品比較
        </span>
      </Link>
      <div className="flex gap-4 items-center">
        <UserBalance />
        <HamburgerMenu />
      </div>
    </header>
  );
};

export default MainHeader;
