'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, [pathname]); // re-evaluate on route change

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body
        className="min-h-screen bg-gray-50 text-gray-900 bg-[url('/background.jpg')] bg-cover bg-center"
      >
        {!isAuthPage && loggedIn && (
          <div className="w-full bg-white border-b p-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
        <div className="px-4">{children}</div>
      </body>
    </html>
  );
}
