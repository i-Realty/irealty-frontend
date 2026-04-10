import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";
import ThemeProvider from "@/components/ThemeProvider";
import PushNotificationManager from "@/components/PushNotificationManager";
import OfflineIndicator from "@/components/OfflineIndicator";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('irealty-theme')||'light';var d=t==='system'?window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light':t;if(d==='dark')document.documentElement.classList.add('dark');var l=localStorage.getItem('irealty-locale');if(l)document.documentElement.lang=l}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${lato.variable} font-lato antialiased min-h-screen bg-white dark:bg-gray-900`}>
        <ThemeProvider>
          <OfflineIndicator />
          <main className="pt-0">
            {children}
          </main>
          <ToastContainer />
          <PushNotificationManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
