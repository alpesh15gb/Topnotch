'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import queryClient from '@/lib/queryClient';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>TopNotch — GST Accounting</title>
        <meta name="description" content="Multi-tenant GST-compliant accounting for Indian SMBs" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
