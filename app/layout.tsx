import HeaderAuth from "@/components/header-auth";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import "./globals.css";
import AppNavigationMenu from "@/components/layout/navigation-menu";

export const metadata = {
  metadataBase: "http://localhost:3000",
  title: "BAC Assistant",
  description: "BAC Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center bg-slate-50">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center text-xl font-semibold">
                <Link href={"/"}>BAC Assistant</Link>
              </div>
              {/* <AppNavigationMenu/> */}
              <HeaderAuth />
            </div>
          </nav>

          <div className="flex flex-col w-full max-w-5xl p-5">
            {children}
          </div>

          <footer className="w-full flex items-center justify-center border-t mx-auto mt-auto text-center text-xs gap-8 py-4">
            <p>
              Proiect la Ingineria Programării, anul IV, semestrul 1
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}
