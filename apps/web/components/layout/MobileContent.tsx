'use client';

import React, { ReactNode } from 'react';
import MobileHeader from './MobileHeader';
import MobileNavBar from './MobileNavBar';

interface MobileContentProps {
  children: ReactNode;
}

export default function MobileContent({ children }: MobileContentProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* 상단 헤더 */}
      <MobileHeader />
      
      {/* 메인 콘텐츠 - 스크롤 가능 */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </main>
      
      {/* 하단 네비게이션 바 */}
      <MobileNavBar />
    </div>
  );
}
