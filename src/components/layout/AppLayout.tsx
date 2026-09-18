import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Toaster } from '@/components/ui/toaster'
import { useAppBootstrap } from '@/hooks/useAppBootstrap'
import { useTheme } from '@/hooks/useTheme'

export function AppLayout() {
  useAppBootstrap()
  useTheme()

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar />
      <main className="min-h-dvh pb-24 md:ml-64 md:pb-8">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:px-8 md:pt-8">
          <Outlet />
        </div>
      </main>
      <MobileNav />
      <Toaster />
    </div>
  )
}
