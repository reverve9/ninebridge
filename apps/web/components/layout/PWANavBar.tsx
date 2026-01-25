'use client';

import React, { useState, useEffect } from 'react';
import { Home, LayoutGrid, Folder, MessageCircle } from 'lucide-react';

interface PWANavBarProps {
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
}

export default function PWANavBar({ onMenuSelect, activeMenu = 'home' }: PWANavBarProps) {
  const [navStyle, setNavStyle] = useState({ left: '15px', right: '15px', width: 'auto' });

  useEffect(() => {
    const updatePosition = () => {
      const pwaWrapper = document.getElementById('pwa-wrapper');
      if (pwaWrapper) {
        const rect = pwaWrapper.getBoundingClientRect();
        setNavStyle({
          left: `${rect.left + 15}px`,
          right: 'auto',
          width: `${rect.width - 30}px`,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const navItems = [
    { id: 'home', icon: <Home size={22} strokeWidth={1.5} />, label: 'HOME' },
    { id: 'service', icon: <LayoutGrid size={22} strokeWidth={1.5} />, label: 'WORX' },
    { id: 'project', icon: <Folder size={22} strokeWidth={1.5} />, label: 'PROJECT' },
    { id: 'contact', icon: <MessageCircle size={22} strokeWidth={1.5} />, label: 'CONTACT' },
  ];

  const handleClick = (id: string) => {
    if (onMenuSelect) {
      onMenuSelect(id);
    }
  };

  return (
    <nav 
      className="fixed bottom-[40px] z-50"
      style={navStyle}
    >
      <div className="bg-[#3071a5]/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center justify-center gap-[3px] py-1.5 rounded-xl transition-all w-[72px]
                ${activeMenu === item.id 
                  ? 'text-[#3071a5]' 
                  : 'text-gray-400 hover:text-[#3071a5]'
                }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
