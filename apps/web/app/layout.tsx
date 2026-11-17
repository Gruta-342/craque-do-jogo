import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Craque do Jogo",
  description: "Sua carreira. Seu legado."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
