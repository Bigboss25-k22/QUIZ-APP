import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Quizboard", template: "%s · Quizboard" },
  description: "Nền tảng luyện tập và đánh giá trực tuyến.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><Providers>{children}</Providers></body></html>;
}
