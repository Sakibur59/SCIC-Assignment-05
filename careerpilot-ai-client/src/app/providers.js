'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <SessionProvider>
        <Navbar></Navbar>
      {children}
      <Footer></Footer>
      <Toaster position="top-right" />
    </SessionProvider>
  );
}