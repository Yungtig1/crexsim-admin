"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Users, LogOut, Menu, BanknoteIcon as Bank } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { icon: Users, label: "Users", href: "/dashboard" },
  { icon: Bank, label: "Payment Requests", href: "/dashboard/payment-requests" },
]

export default function AdminLayout({ children }) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/")
  }

  if (!isClient) return null

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 bg-card text-card-foreground p-4 flex-col">
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-accent ${
                pathname === item.href ? "bg-accent" : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background z-10 p-4 flex items-center justify-between">
        <div className="text-xl font-bold flex gap-2 items-center">
        <img src="/Logo.jpeg" alt="Crexsim Logo" className="w-12 h-12" />
        <h1 className="tracking-wide font-bold text-3xl">ADMIN</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col h-full">
              <div className="text-2xl font-bold mb-8 flex gap-2 items-center">
              <img src="/Logo.jpeg" alt="Crexsim Logo" className="w-12 h-12" />
              <h1 className="tracking-wide font-bold text-3xl">ADMIN</h1>
              </div>
              <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-accent ${
                      pathname === item.href ? "bg-accent" : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto md:p-8 pt-20 ">{children}</main>
    </div>
  )
}