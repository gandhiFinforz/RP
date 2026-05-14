'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const navItems = [
  {
    label: 'Products',
    items: ['Online Payments', 'POS Terminals', 'Payment Links', 'Subscriptions', 'Payouts']
  },
  {
    label: 'Partners',
    items: [] // No submenu requested
  },
  {
    label: 'Pricing',
    items: [] // No submenu requested
  },
  {
    label: 'Support',
    items: [] // No submenu requested
  },
  {
    label: 'Resources',
    items: ['Blogs', 'Events']
  },
  {
    label: 'About Us',
    items: [] // No submenu requested
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-ink-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <img
              src="/ringgitpay-logo.svg"
              alt="RinggitPay"
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-ink-700 hover:text-brand-700 transition rounded-lg">
                  {item.label}
                  {item.items.length > 0 && (
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {openDropdown === item.label && item.items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl border border-ink-100 shadow-xl p-2"
                  >
                    {item.items.map((sub) => (
                      <a
                        key={sub}
                        href="#"
                        className="block px-4 py-3 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition"
                      >
                        {sub}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="#" className="text-sm font-medium text-ink-700 hover:text-brand-700 transition">
              Login
            </a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-ink-900 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition flex items-center gap-1.5"
            >
              Sign Up
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-ink-700"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden border-t border-ink-100 py-4 space-y-1"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="block px-4 py-3 text-sm font-medium text-ink-700 hover:bg-brand-50 rounded-lg"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 px-4">
              <a href="#" className="block w-full text-center py-3 bg-ink-900 text-white rounded-full font-semibold">
                Contact sales
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
