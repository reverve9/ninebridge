'use client';

import React, { ReactNode } from 'react';

interface MainLayoutProps {
  pwaContent: ReactNode;
  extendedContent: ReactNode;
}

export default function MainLayout({ pwaContent, extendedContent }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 모바일: PWA만 보임 (~767px) */}
      {/* 데스크탑: PWA + 확장 콘텐츠 (768px~) */}
      
      <div className="flex justify-center min-h-screen">
        {/* 전체 컨테이너 - 최대 1200px */}
        <div className="flex w-full max-w-[1200px]">
          
          {/* 좌측 PWA 영역 - 항상 430px */}
          <div id="pwa-wrapper" className="w-full max-w-[430px] min-h-screen mx-auto md:mx-0 md:flex-shrink-0">
            <div className="bg-white min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.08)] relative overflow-x-hidden">
              {pwaContent}
            </div>
          </div>
          
          {/* 우측 확장 콘텐츠 영역 - 768px 이상에서만 보임 */}
          <div className="hidden md:block flex-1 min-h-screen overflow-y-auto">
            <div className="p-8">
              {extendedContent}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
