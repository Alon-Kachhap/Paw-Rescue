import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from '@/components/navbar';
import { Toaster } from "@/components/ui/sonner";
import { ClientProviders } from "@/components/ClientProviders"; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PawsConnect - Empowering Animal Welfare Organizations',
  description: 'A platform connecting animal welfare organizations with donors, volunteers, and resources.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>{String(metadata.title ?? 'Default Title')}</title>
      </head>
      <body className={inter.className}>
        <ClientProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
