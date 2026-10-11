import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";
export const metadata: Metadata = { title: "TouchGrass AI — Less scrolling. More exploring.", description: "AI-powered micro-adventures for a life beyond the screen." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><Shell>{children}</Shell></body></html>; }
