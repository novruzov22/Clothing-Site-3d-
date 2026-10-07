import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASI — The world model",
  description: "A wardrobe in motion. Contemporary clothing and everyday essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="[fonts.googleapis.com](https://fonts.googleapis.com)" />
        <link
          rel="preconnect"
          href="[fonts.gstatic.com](https://fonts.gstatic.com)"
          crossOrigin="anonymous"
        />
        <link
          href="[fonts.googleapis.com](https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap)"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
