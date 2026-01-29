'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'HOME', href: '/' },
    { label: 'WORX', href: '#works' },
    { label: 'NEWS', href: '#news' },
    { label: 'CONNECT', href: '#connect' },
  ];

  return (
    <>
      <header className="bg-[#3071a5] text-white px-4 py-3 flex items-center justify-between relative z-50">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">NINE BRIDGE</span>
        </div>
        
        {/* 메뉴 버튼 */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white shadow-lg z-40 border-t">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-6 py-4 text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
