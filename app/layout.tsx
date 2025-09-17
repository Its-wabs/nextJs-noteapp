import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster} from "sonner";

import 'remixicon/fonts/remixicon.css'
import { ModalProvider } from "@/components/providers/modal-provider";

export const metadata: Metadata = {
  title: "Typeflow",
  description: "0 distraction editor",
  icons : {
    icon : [
      {
        media :"(prefers-color--scheme : light)",
        url : "/typhoon-normal.svg",
        href: "/typhoon-normal.svg"
      },
       {
        media :"(prefers-color--scheme : dark)",
        url : "/typhoon-dark.svg",
        href: "/typhoon-dark.svg"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
      </head>
      <body>
        <ConvexClientProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="Typeflow"
          >
            <Toaster position="bottom-center"/>
            <ModalProvider/>
        {children}
        </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
