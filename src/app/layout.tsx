'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users, FileText, Utensils,
  CalendarDays, UserCheck, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/ospiti',            label: 'Ospiti',           icon: Users },
  { href: '/note',              label: 'Note del giorno',  icon: FileText },
  { href: '/pasti',             label: 'Pasti',            icon: Utensils },
  { href: '/menu',              label: 'Menu settimanale', icon: CalendarDays },
  { href: '/parenti',           label: 'Parenti',          icon: UserCheck },
]

const PUBLIC_ROUTES = ['/', '/menu-pubblico', '/portale']

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <div className="flex flex-col h-full bg-[#1b3a38] text-white">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm leading-tight">ArcaCura</p>
            <p className="text-xs text-white/40 mt-0.5">ArcApp</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      <nav className="flex-1 py-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-2 ${
                active
                  ? 'bg-white/10 text-white border-[#5DCAA5]'
                  : 'text-white/60 hover:text-white hover:bg-white/10 border-transparent'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/30">v1.0 · Gestionale</p>
      </div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith('/portale'))

  if (isPublic) {
    return (
      <html lang="it">
        <body>{children}</body>
      </html>
    )
  }

  return (
    <html lang="it">
      <body>
        <div className="flex h-screen overflow-hidden">
          <div className="hidden lg:flex w-52 flex-shrink-0">
            <div className="w-full">
              <Sidebar />
            </div>
          </div>
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40 flex">
              <div className="w-52 flex-shrink-0 z-50">
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </div>
              <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#1b3a38] text-white">
              <button onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <span className="font-medium text-sm">ArcaCura</span>
            </div>
            <main className="p-5 max-w-5xl mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
