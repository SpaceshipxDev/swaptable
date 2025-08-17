import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Swaptable',
  description: '工程管理系统'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
