import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import { RetailProvider } from "../context/RetailContext";
import RetailOverlay from "../components/RetailOverlay";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "FanFlow — Smart Stadium",
  description: "Smart stadium experience for live sporting events",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body>
        <RetailProvider>
          <div className="app-shell">
            <BottomNav />
            <main className="screen">{children}</main>
          </div>
          <RetailOverlay />
        </RetailProvider>
      </body>
    </html>
  );
}
