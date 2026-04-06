import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "i-Realty",
  description: "Real Estate Made Secure, Smart and Simple",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} font-lato antialiased min-h-screen`}>
        <main className="pt-0">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
