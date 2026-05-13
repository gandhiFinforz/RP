import './globals.css'

export const metadata = {
  title: 'RinggitPay — Unified Payments for Modern Businesses',
  description: 'Accept payments online, in-store, and on the go. Built for businesses across Malaysia and Southeast Asia.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
