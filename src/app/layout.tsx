"use client";
// import type { Metadata } from "next";
import ThemeProviderWrapper from "@/providers/ThemeProviderWrapper";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import "./globals.css";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Settings, Home, HandPlatter, Volume2 } from 'lucide-react';

// export const metadata: Metadata = {
//   title: "Harmony",
//   description: "For Communication Inclusion",
// };

export default function Layout({ 
  children 
}
: Readonly<{
  children: React.ReactNode;
 }>
) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { 
      href: '/', 
      icon: <Home className="w-6 h-6" />, 
      label: 'Home' 
    },
    { 
      href: '/sign-to-text', 
      icon: <HandPlatter className="w-6 h-6" />, 
      label: 'Sign to Text' 
    },
    { 
      href: '/sign-to-audio', 
      icon: <Volume2 className="w-6 h-6" />, 
      label: 'Sign to Audio' 
    },
    { 
      href: '/settings', 
      icon: <Settings className="w-6 h-6" />, 
      label: 'Settings' 
    }
  ];

  return (
    <html lang="en">
      {/* <body> */}
    <AppRouterCacheProvider>
    <ThemeProviderWrapper>
    <div className="flex h-screen">
      {/* Mobile/Tablet Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-full"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static z-40 w-64 bg-secondary-dark 
        h-full transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block
      `}>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-white mt-10 mb-8">
            Sign Translator
          </h1>
          <nav>
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center p-3 mb-2 text-white hover:bg-primary-light rounded-lg transition"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6 md:ml-0">
        {children}
      </main>
    </div>
    </ThemeProviderWrapper>
    </AppRouterCacheProvider>
    {/* </body> */}
    </html>
  );
}