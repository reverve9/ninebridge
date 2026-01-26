'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface PWATopNavProps {
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
  onSearchClick?: () => void;
}

// 메뉴 아이템
const navItems = [
  { id: 'home', label: 'HOME', labelKo: '나인브릿지' },
  { id: 'works', label: 'WORX', labelKo: '포트폴리오' },
  { id: 'notice', label: 'NOTICE', labelKo: '공지사항' },
  { id: 'contact', label: 'CONTACT', labelKo: '문의하기' },
];

export default function PWATopNav({ onMenuSelect, activeMenu = 'home', onSearchClick }: PWATopNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navStyle, setNavStyle] = useState({ left: '0px', width: '100%' });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const pwaWrapper = document.getElementById('pwa-wrapper');
    
    const updatePosition = () => {
      if (pwaWrapper) {
        const rect = pwaWrapper.getBoundingClientRect();
        setNavStyle({
          left: `${rect.left}px`,
          width: `${rect.width}px`,
        });
      }
    };

    const handleScroll = () => {
      if (pwaWrapper) {
        setIsScrolled(pwaWrapper.scrollTop > 80);
      }
    };

    updatePosition();
    handleScroll();
    window.addEventListener('resize', updatePosition);
    pwaWrapper?.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      pwaWrapper?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (id: string) => {
    if (onMenuSelect) {
      onMenuSelect(id);
    }
  };

  return (
    <nav 
      className={`z-50 ${isScrolled ? 'fixed top-0' : 'sticky top-0'}`}
      style={isScrolled ? navStyle : undefined}
    >
      <div className="bg-white/95 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)] border-b border-gray-100/50">
        <div className="flex items-center justify-around px-3 py-[13px]">
          {/* 메뉴 아이템들 */}
          {navItems.map((item) => {
            const isActive = activeMenu === item.id;
            const isHovered = hoveredItem === item.id;
            const showEffect = isActive || isHovered;
            
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative flex flex-col items-start justify-center gap-[4px] py-1 px-2 transition-all duration-200"
              >
                {/* 원형 그라데이션 배경 (블러 효과 대체) */}
                <div 
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full pointer-events-none transition-all duration-500 ease-out
                    ${showEffect ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                  style={{
                    background: `radial-gradient(circle, 
                      rgba(48,113,165,0.6) 0%, 
                      rgba(48,113,165,0.55) 5%, 
                      rgba(48,113,165,0.5) 10%, 
                      rgba(48,113,165,0.45) 15%, 
                      rgba(48,113,165,0.4) 20%, 
                      rgba(48,113,165,0.35) 25%, 
                      rgba(48,113,165,0.3) 30%, 
                      rgba(48,113,165,0.25) 35%, 
                      rgba(48,113,165,0.2) 40%, 
                      rgba(48,113,165,0.15) 45%, 
                      rgba(48,113,165,0.12) 50%, 
                      rgba(48,113,165,0.09) 55%, 
                      rgba(48,113,165,0.06) 60%, 
                      rgba(48,113,165,0.04) 65%, 
                      rgba(48,113,165,0.02) 70%, 
                      rgba(48,113,165,0.01) 75%, 
                      rgba(48,113,165,0) 80%
                    )`,
                  }}
                />
                
                {/* 텍스트 */}
                <span className={`relative font-raleway text-[17px] font-light tracking-[0.05em] text-[#000000] leading-tight transition-opacity duration-200
                  ${showEffect ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
                <span className={`relative text-[12px] font-extralight text-[#000000] leading-none transition-opacity duration-200
                  ${showEffect ? 'opacity-100' : 'opacity-70'}`}>
                  {item.labelKo}
                </span>
              </button>
            );
          })}
          
          {/* 검색 버튼 */}
          <button 
            onClick={onSearchClick}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#3071a5] transition-colors"
          >
            <Search size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </nav>
  );
}
