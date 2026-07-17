import Navbar from '@/components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import Footer from '@/components/Footer'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CareerPilot AI - Your AI Career Development Platform',
  description: 'Land your dream job with AI-powered resume analysis and smart job matching',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer></Footer>
      </body>
    </html>
  )
}