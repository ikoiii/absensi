import { requireRole } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardList, LogOut, UserCog } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { logoutAction } from '@/actions/auth';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Sessions', href: '/admin/sessions', icon: ClipboardList },
  { name: 'Students', href: '/admin/students', icon: Users },
  { name: 'Manage Admins', href: '/admin/manage-admins', icon: UserCog },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole('admin');

  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 overflow-y-auto bg-white border-r dark:bg-gray-800 dark:border-gray-700 md:block">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <Link href="/admin" className="flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* User Profile & Logout */}
          <div className="p-4">
            <div className="mb-3 px-4 py-2">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700 md:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <span className="font-bold">Admin</span>
          </Link>
          <Button variant="ghost" size="sm">
            Menu
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
