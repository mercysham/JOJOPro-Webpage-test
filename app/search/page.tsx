import type { Metadata } from "next";
import SearchPageComponent from "./page-component";

export const metadata: Metadata = {
  title: "搜索鋪位 - JOJOpro",
  description: "在JOJOpro搜索香港各區散租鋪位，包括Pop-up Store、市集、固定鋪位等各種場地選擇，為創業者提供彈性租用方案",
  keywords: "香港, 散租, 鋪位, 創業, Pop-up Store, 市集, 租用, 短期租賃, 創業空間",
  openGraph: {
    title: "搜索鋪位 - JOJOpro",
    description: "在JOJOpro搜索香港各區散租鋪位，包括Pop-up Store、市集、固定鋪位等各種場地選擇",
    url: "https://www.jojopro.com/search",
    siteName: "JOJOpro",
    images: [
      {
        url: "https://www.jojopro.com/og-search.jpg",
        width: 1200,
        height: 630,
        alt: "搜索鋪位 - JOJOpro",
      },
    ],
    locale: "zh_HK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "搜索鋪位 - JOJOpro",
    description: "在JOJOpro搜索香港各區散租鋪位，包括Pop-up Store、市集、固定鋪位等各種場地選擇",
    images: ["https://www.jojopro.com/og-search.jpg"],
  },
};

export default function SearchPage() {
  return <SearchPageComponent />;
}