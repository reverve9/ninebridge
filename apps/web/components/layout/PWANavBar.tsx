'use client';

import React, { useState, useEffect } from 'react';
import { HousePlus, GalleryVerticalEnd, BellPlus, RotateCw } from 'lucide-react';

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
    { id: 'home', label: 'HOME', icon: HousePlus },
    { id: 'works', label: 'WORX', icon: GalleryVerticalEnd },
    { id: 'notice', label: 'NEWS', icon: BellPlus },
    { id: 'contact', label: 'CONNECT', icon: RotateCw },
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-around py-2.5 px-2">
          {navItems.map((item) => {
            const isActive = activeMenu === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`flex flex-col items-center justify-center gap-[6px] py-1 rounded-xl transition-all duration-200 w-[72px]
                  ${isActive 
                    ? 'text-[#b87a5a] scale-[1.2]' 
                    : 'text-gray-500 hover:text-[#b87a5a] hover:scale-[1.2]'
                  }`}
              >
                <Icon size={20} strokeWidth={1.2} />
                <span className="text-[10px] font-light tracking-wide leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
