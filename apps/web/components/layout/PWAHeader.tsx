'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface PWAHeaderProps {
  onSearchClick?: () => void;
}

export default function PWAHeader({ onSearchClick }: PWAHeaderProps) {
  const [showFloating, setShowFloating] = useState(false);
  const [floatingStyle, setFloatingStyle] = useState({ right: '15px' });

  useEffect(() => {
    const pwaWrapper = document.getElementById('pwa-wrapper');
    
    const updatePosition = () => {
      if (pwaWrapper) {
        const rect = pwaWrapper.getBoundingClientRect();
        setFloatingStyle({
          right: `${window.innerWidth - rect.right + 15}px`,
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

  return (
    <>
      <header className="bg-[#3071a5] text-white px-4 h-[100px] pt-[20px] flex flex-col justify-center sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div>
            <img src="/logo_head.png" alt="NINE BRIDGE" className="h-[17px]" />
            <p className="text-[12px] font-light tracking-wide opacity-70 mt-2">나인브릿지는 모두의 내일을 연결합니다</p>
          </div>
          
          {/* 검색 버튼 */}
          <button 
            onClick={onSearchClick}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Search size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* 플로팅 검색 버튼 - 헤더 가려지면 표시 */}
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
    </>
  );
}
