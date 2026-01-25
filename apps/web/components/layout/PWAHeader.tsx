'use client';

import React, { useState, useEffect } from 'react';

interface PWAHeaderProps {
  onMenuClick?: () => void;
}

// 격자 메뉴 버튼 컴포넌트
function GridMenuButton({ onClick, className = '' }: { onClick?: () => void; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors ${className}`}
    >
      <div className="grid grid-cols-2 gap-[2px]">
        <div className="w-[7px] h-[7px] bg-white" />
        <div 
          className={`w-[7px] h-[7px] bg-white transition-transform duration-300 origin-center ${isHovered ? 'rotate-45' : ''}`} 
        />
        <div className="w-[7px] h-[7px] bg-white" />
        <div className="w-[7px] h-[7px] bg-white" />
      </div>
    </button>
  );
}

export default function PWAHeader({ onMenuClick }: PWAHeaderProps) {
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
          <img src="/logo_head.png" alt="NINE BRIDGE" className="h-[40px]" />
          
          {/* 우측 메뉴 버튼 */}
          <GridMenuButton onClick={onMenuClick} />
        </div>
      </header>

      {/* 플로팅 메뉴 버튼 - 헤더 가려지면 표시 */}
      <div 
        className={`fixed top-[15px] z-50 transition-all duration-300 ${showFloating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        style={floatingStyle}
      >
        <div className="bg-[#3071a5] rounded-full shadow-lg">
          <GridMenuButton onClick={onMenuClick} />
        </div>
      </div>
    </>
  );
}
