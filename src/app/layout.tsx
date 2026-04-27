import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analisi Ordini e Consegne",
  description: "Analizza i tuoi ordini e consegne con raggruppamenti settimanali e mensili",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
        {children}
      </body>
    </html>
  );
}
