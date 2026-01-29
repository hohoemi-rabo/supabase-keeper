'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileMenu({
  email,
  logoutAction,
}: {
  email: string | undefined
  logoutAction: () => Promise<void>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white transition-colors p-1"
        aria-label="メニュー"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/manual"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === '/manual'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Manual
            </Link>
          </div>
          <div className="border-t border-gray-800 px-4 py-3">
            <p className="text-xs text-gray-500 truncate px-3 mb-2">{email}</p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
