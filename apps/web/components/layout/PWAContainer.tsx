'use client';

import React, { ReactNode } from 'react';
import PWAHeader from './PWAHeader';
import PWANavBar from './PWANavBar';

interface PWAContainerProps {
  children: ReactNode;
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
}

export default function PWAContainer({ children, onMenuSelect, activeMenu = 'home' }: PWAContainerProps) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* 상단 헤더 */}
      <PWAHeader />
      
      {/* 메인 콘텐츠 - 스크롤 가능 */}
      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>
      
      {/* 하단 네비게이션 바 - PWA 영역 내 고정 */}
      <PWANavBar onMenuSelect={onMenuSelect} activeMenu={activeMenu} />
    </div>
  );
}
