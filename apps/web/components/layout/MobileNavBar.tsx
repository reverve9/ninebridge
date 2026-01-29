'use client';

import React from 'react';
import { Home, Phone, Mail, User, Bell } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function MobileNavBar() {
  const navItems: NavItem[] = [
    { icon: <Bell size={22} />, label: '알림', href: '#' },
    { icon: <Phone size={22} />, label: '전화', href: 'tel:033-823-0133' },
    { icon: <Home size={22} />, label: '홈', href: '/' },
    { icon: <Mail size={22} />, label: '문의', href: '#contact' },
    { icon: <User size={22} />, label: '소개', href: '#about' },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors
              ${item.label === '홈' 
                ? 'text-[#3071a5]' 
                : 'text-gray-500 hover:text-[#3071a5]'
              }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
