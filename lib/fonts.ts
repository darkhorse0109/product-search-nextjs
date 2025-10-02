import { Noto_Sans_JP, Noto_Sans } from "next/font/google";

export const notoSansJP = Noto_Sans_JP({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const notoSans = Noto_Sans({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
