'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import AuthProvider from "@/context/AuthProvider"

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <AuthProvider>
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-white/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center justify-between md:justify-between gap-3 md:gap-0">

        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-gray-900"
        >
          Anonymous Messages
        </Link>

        {/* Center Buttons (Send / Receive) */}
        {session && (
          <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 my-2 md:my-0">
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-xl text-gray-700 hover:text-indigo-600">
                Receive Messages
              </Button>
            </Link>
            <Link href={`/`}>
              <Button variant="ghost" className="rounded-xl text-gray-700 hover:text-green-600">
                Send Message
              </Button>
            </Link>
          </div>
        )}

        {/* Right Section (Greeting / Logout / Sign in) */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="hidden sm:block text-sm text-gray-600">
                Hi, {user?.username || user?.email}
              </span>

              <Button
                onClick={() => signOut()}
                variant="outline"
                className="rounded-xl"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-500">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
    </AuthProvider>
  )
}

export default Navbar
