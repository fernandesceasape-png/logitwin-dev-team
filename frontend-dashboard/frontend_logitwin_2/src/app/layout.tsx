import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:       "LogiTwin — Central de Logística",
  description: "Rastreamento logístico em tempo real com dados SAP",
  icons:       { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-100 text-slate-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}