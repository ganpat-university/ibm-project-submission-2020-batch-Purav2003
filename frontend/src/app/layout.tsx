import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import logo from "../assets/images/logo.png"
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cloud enabled attendance system',
  description: 'Cloud enabled attendance system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}
) {
  return (
    <html lang="en">
      <title>Cloud Enabled Attendance System</title>
      <body className={inter.className}>
      <NextTopLoader  showSpinner={false}/>
        {children}
      </body>
    </html>
  )
}
