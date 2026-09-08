import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estación 57 | Música en Calle Angosta",
  description: "La estación cultural y nocturna de Villa Mercedes, San Luis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
