'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PWATopNav from './PWATopNav';

interface PWANavigationProps {
  children: React.ReactNode;
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
  onSearchClick?: () => void;
}

// 2x2 그리드 아이콘 컴포넌트
function GridIcon({ activeIndex, hoverIndex }: { activeIndex: number; hoverIndex: number }) {
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

// 메뉴 아이템
const navItems = [
  { id: 'home', label: 'HOME', labelKo: '나인브릿지', boxIndex: 0 },
  { id: 'works', label: 'WORX', labelKo: '포트폴리오', boxIndex: 1 },
  { id: 'notice', label: 'NOTICE', labelKo: '공지사항', boxIndex: 2 },
  { id: 'contact', label: 'CONTACT', labelKo: '문의하기', boxIndex: 3 },
];

export default function PWANavigation({ 
  children, 
  onMenuSelect, 
  activeMenu = 'home',
  onSearchClick 
}: PWANavigationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <MobileNavigation 
        onMenuSelect={onMenuSelect} 
        activeMenu={activeMenu}
        onSearchClick={onSearchClick}
      >
        {children}
      </MobileNavigation>
    );
  }
  
  return (
    <DesktopNavigation 
      onMenuSelect={onMenuSelect} 
      activeMenu={activeMenu}
      onSearchClick={onSearchClick}
    >
      {children}
    </DesktopNavigation>
  );
}

// ============================================
// 모바일 (768px 미만): 상단 헤더 + 하단 네비바
// ============================================
function MobileNavigation({ 
  children, 
  onMenuSelect, 
  activeMenu = 'home',
  onSearchClick 
}: Omit<PWANavigationProps, 'children'> & { children: React.ReactNode }) {
  const [showFloating, setShowFloating] = useState(false);
  const [floatingStyle, setFloatingStyle] = useState({ right: '15px' });
  const [navStyle, setNavStyle] = useState({ left: '15px', right: '15px', width: 'auto' });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const pwaWrapper = document.getElementById('pwa-wrapper');
    
    const updatePosition = () => {
      if (pwaWrapper) {
        const rect = pwaWrapper.getBoundingClientRect();
        setFloatingStyle({
          right: `${window.innerWidth - rect.right + 15}px`,
        });
        setNavStyle({
          left: `${rect.left + 15}px`,
          right: 'auto',
          width: `${rect.width - 30}px`,
        });
      }
    };

    const handleScroll = () => {
      if (pwaWrapper) {
        setShowFloating(pwaWrapper.scrollTop > 100);
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
    <div className="relative flex flex-col min-h-screen">
      {/* 상단 헤더 */}
      <header className="bg-[#3071a5] text-white px-4 h-[80px] flex flex-col justify-center sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div>
            <img src="/logo_head.png" alt="NINE BRIDGE" className="h-[17px]" />
            <p className="text-[12px] font-light tracking-wide opacity-70 mt-2">나인브릿지는 모두의 내일을 연결합니다</p>
          </div>
          <button 
            onClick={onSearchClick}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Search size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* 플로팅 검색 버튼 */}
      <div 
        className={`fixed top-[15px] z-50 transition-all duration-300 ${showFloating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        style={floatingStyle}
      >
        <button 
          onClick={onSearchClick}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#3071a5] text-white shadow-lg hover:bg-[#265d8a] transition-colors"
        >
          <Search size={18} strokeWidth={2} />
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>

      {/* 하단 네비게이션 바 */}
      <nav 
        className="fixed bottom-0 z-50 pb-[env(safe-area-inset-bottom)]"
        style={navStyle}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-[20px]">
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
    </div>
  );
}

// ============================================
// 데스크탑 (768px 이상): 헤더 스크롤시 넘어감 + 상단 스티키 네비
// ============================================
function DesktopNavigation({ 
  children, 
  onMenuSelect, 
  activeMenu = 'home',
  onSearchClick 
}: Omit<PWANavigationProps, 'children'> & { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* 상단 헤더 - 스크롤시 넘어감 */}
      <header className="bg-[#3071a5] text-white px-4 h-[80px] pt-[20px] flex flex-col justify-center">
        <div className="flex items-baseline gap-3">
          <img src="/logo_head.png" alt="NINE BRIDGE" className="h-[17px]" />
          <p className="text-[12px] font-light tracking-wide opacity-70">나인브릿지는 모두의 내일을 연결합니다</p>
        </div>
      </header>

      {/* 상단 네비게이션 컴포넌트 */}
      <PWATopNav 
        onMenuSelect={onMenuSelect} 
        activeMenu={activeMenu} 
        onSearchClick={onSearchClick} 
      />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
