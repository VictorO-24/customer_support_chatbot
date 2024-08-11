import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Living Well Hospital Support Assistant",
  description: "What can i help you with?",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider 
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
      >
        <AuthProvider>
          <body className={inter.className}>{children}</body>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}