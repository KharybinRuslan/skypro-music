import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import FavoritesSync from '@/components/FavoritesSync/FavoritesSync';

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skypro Music",
  description: "Music streaming application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={montserrat.variable}>
        <Providers>
          <FavoritesSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}
