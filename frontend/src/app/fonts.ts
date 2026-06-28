import localFont from "next/font/local";

export const geistSans = localFont({
  variable: "--font-sans",
  src: [
    { path: "../../public/fonts/Geist-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Geist-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/Geist-SemiBold.woff2", weight: "600" },
    { path: "../../public/fonts/Geist-Bold.woff2", weight: "700" },
  ],
});

export const geistMono = localFont({
  variable: "--font-mono",
  src: [
    { path: "../../public/fonts/GeistMono-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/GeistMono-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/GeistMono-SemiBold.woff2", weight: "600" },
  ],
});
