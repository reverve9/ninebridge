'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface PWAHeaderProps {
  variant?: 'mobile' | 'desktop';
}

export default function PWAHeader({ variant = 'mobile' }: PWAHeaderProps) {
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

  // 데스크탑: 로고+태그라인 가로 배치, 검색버튼 없음, 스크롤시 넘어감
  if (variant === 'desktop') {
    return (
      <header 
        className="text-white px-4 h-[80px] pt-[20px] flex flex-col justify-center"
        style={{
          background: 'linear-gradient(to right, #384155, #46526d, #9eafd4)'
        }}
      >
        <div className="flex items-baseline gap-3">
          <img src="/logo_120.png" alt="NINE BRIDGE" className="h-[22px]" />
          <p className="text-[14px] font-light tracking-wide opacity-70">나인브릿지는 모두의 내일을 연결합니다</p>
        </div>
      </header>
    );
  }

  // 모바일: 로고+태그라인 세로 배치, 검색버튼 있음, 스티키
  return (
    <>
      <header 
        className="text-white px-4 h-[80px] flex flex-col justify-center sticky top-0 z-50"
        style={{
          background: 'linear-gradient(to right, #384155, #46526d, #9eafd4)'
        }}
      >
        <div className="flex items-center">
          {/* 로고 */}
          <div className="flex items-baseline gap-3">
  <img src="/logo_120.png" alt="NINE BRIDGE" className="h-[20px]" />
  <p className="text-[12.5px] font-light tracking-wide opacity-70">나인브릿지는 모두의 내일을 연결합니다</p>
</div>
        </div>
      </header>
    </>
  );
}
