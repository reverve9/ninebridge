'use client';

import React, { useState, useEffect } from 'react';
import PWAHeader from './PWAHeader';
import PWANavBar from './PWANavBar';
import PWATopNav from './PWATopNav';

interface PWANavigationProps {
  children: React.ReactNode;
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
}

export default function PWANavigation({ 
  children, 
  onMenuSelect, 
  activeMenu = 'home'
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
      >
        {children}
      </MobileNavigation>
    );
  }
  
  return (
    <DesktopNavigation 
      onMenuSelect={onMenuSelect} 
      activeMenu={activeMenu}
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
  activeMenu = 'home'
}: Omit<PWANavigationProps, 'children'> & { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* 상단 헤더 - PWAHeader 컴포넌트 */}
      <PWAHeader variant="mobile" />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>

      {/* 하단 네비게이션 - PWANavBar 컴포넌트 */}
      <PWANavBar onMenuSelect={onMenuSelect} activeMenu={activeMenu} />
    </div>
  );
}

// ============================================
// 데스크탑 (768px 이상): 헤더 스크롤시 넘어감 + 상단 스티키 네비
// ============================================
function DesktopNavigation({ 
  children, 
  onMenuSelect, 
  activeMenu = 'home'
}: Omit<PWANavigationProps, 'children'> & { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* 상단 헤더 - PWAHeader 컴포넌트 */}
      <PWAHeader variant="desktop" />

      {/* 상단 네비게이션 - PWATopNav 컴포넌트 */}
      <PWATopNav 
        onMenuSelect={onMenuSelect} 
        activeMenu={activeMenu} 
      />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
