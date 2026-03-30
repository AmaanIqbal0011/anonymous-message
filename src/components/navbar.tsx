'use client'

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Menu, X, MessageCircle, LayoutDashboard, Send, LogOut } from "lucide-react"

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition-transform group-hover:scale-105">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Whisper
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {session && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 border border-gray-100">
                  <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600">
                      {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username || user?.email}
                  </span>
                </div>
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="ghost" className="rounded-lg text-gray-600 hover:text-indigo-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {session ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 mb-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600">
                      {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.username || user?.email}</p>
                    <p className="text-xs text-gray-500">Manage your inbox</p>
                  </div>
                </div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </button>
                </Link>
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left">
                    <Send className="h-5 w-5" />
                    <span className="font-medium">Send Message</span>
                  </button>
                </Link>
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 justify-center">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
