'use client';

import React, { useState, useEffect } from 'react';

interface PWANavBarProps {
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
}

// 2x2 그리드 아이콘 컴포넌트
function GridIcon({ activeIndex, hoverIndex }: { activeIndex: number; hoverIndex: number }) {
  return (
    <div className="grid grid-cols-2 gap-[3px]">
      {[0, 1, 2, 3].map((index) => {
        const isActive = activeIndex === index;
        const isHovered = hoverIndex === index && activeIndex === -1;
        
        return (
          <div
            key={index}
            className={`w-[9px] h-[9px] transition-all duration-700 ease-out origin-center
              ${isActive || isHovered ? 'bg-[#b87a5a]' : 'bg-[#9ca3af]'}
              ${isHovered ? 'rotate-45' : ''}`}
          />
        );
      })}
    </div>
  );
}

export default function PWANavBar({ onMenuSelect, activeMenu = 'home' }: PWANavBarProps) {
  const [navStyle, setNavStyle] = useState({ left: '15px', right: '15px', width: 'auto' });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
    { id: 'home', label: 'HOME', boxIndex: 0 },
    { id: 'works', label: 'WORX', boxIndex: 1 },
    { id: 'notice', label: 'NEWS', boxIndex: 2 },
    { id: 'contact', label: 'CONNECT', boxIndex: 3 },
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
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex flex-col items-center justify-center gap-[6px] py-1 rounded-xl transition-all duration-200 w-[72px]
                  ${isActive 
                    ? 'text-[#b87a5a] scale-[1.2]' 
                    : 'text-gray-500 hover:text-[#b87a5a] hover:scale-[1.2]'
                  }`}
              >
                <GridIcon 
                  activeIndex={isActive ? item.boxIndex : -1} 
                  hoverIndex={isHovered && !isActive ? item.boxIndex : -1}
                />
                <span className="text-[10px] font-medium tracking-wide leading-none">
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
