import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ClientProvider } from '@/components/ClientProvider';
import theme from '@/theme';
import { ThemeProvider } from '@mui/material/styles';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'R-flix',
  description: 'Discover and rate your favorite movies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <ThemeProvider theme={theme}>
            <Header />
            <main style={{ flex: 1 }} className="pt-20 p-4">
              {' '}
              {children}{' '}
            </main>
            <Footer />
          </ThemeProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
