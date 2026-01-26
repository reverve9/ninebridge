'use client';

import React, { useState, useEffect } from 'react';

interface PWANavBarProps {
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
}

// 2x2 그리드 아이콘 컴포넌트
function GridIcon({ activeIndex, hoverIndex }: { activeIndex: number; hoverIndex: number }) {
  // activeIndex: 활성화된 박스 인덱스 (0~3), -1이면 없음
  // hoverIndex: 호버된 박스 인덱스 (0~3), -1이면 없음
  
  return (
    <div className="grid grid-cols-2 gap-[2px]">
      {[0, 1, 2, 3].map((index) => {
        const isActive = activeIndex === index;
        const isHovered = hoverIndex === index && activeIndex === -1;
        
        return (
          <div
            key={index}
            className={`w-[7px] h-[7px] transition-all duration-700 ease-out origin-center
              ${isActive || isHovered ? 'bg-[#3071a5]' : 'bg-[#d1d5db]'}
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

  // 메뉴 아이템 - 박스 위치 매핑
  // ┌───┬───┐
  // │ 0 │ 1 │  0: HOME, 1: WORKS
  // ├───┼───┤
  // │ 2 │ 3 │  2: NOTICE, 3: CONTACT
  // └───┴───┘
  const navItems = [
    { id: 'home', label: 'HOME', boxIndex: 0 },
    { id: 'works', label: 'WORX', boxIndex: 1 },
    { id: 'notice', label: 'NOTICE', boxIndex: 2 },
    { id: 'contact', label: 'CONTACT', boxIndex: 3 },
  ];

  const handleClick = (id: string) => {
    if (onMenuSelect) {
      onMenuSelect(id);
    }
  };

  return (
    <nav 
      className="fixed bottom-0 z-50 pb-[env(safe-area-inset-bottom,15px)]"
      style={navStyle}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-[15px]">
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
                    ? 'text-[#3071a5] scale-[1.2]' 
                    : 'text-gray-400 hover:text-[#3071a5] hover:scale-[1.2]'
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
    </nav>
  );
}
