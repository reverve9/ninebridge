'use client';

import React, { ReactNode } from 'react';

interface MainLayoutProps {
  pwaContent: ReactNode;
  extendedContent: ReactNode;
  activeMenu?: string;
}

const taglines: Record<string, string> = {
  home: '연결의 모든 순간을 디자인합니다',
  service: '연결의 모든 순간을 디자인합니다',
  project: '연결의 모든 순간을 디자인합니다',
  contact: '연결의 모든 순간을 디자인합니다',
};

export default function MainLayout({ pwaContent, extendedContent, activeMenu = 'home' }: MainLayoutProps) {
  return (
    <div className="h-screen bg-[#f5f5f5] overflow-hidden">
      {/* 모바일: PWA만 보임 (~767px) */}
      {/* 데스크탑: PWA + 확장 콘텐츠 (768px~) */}
      
      <div className="flex justify-center h-screen">
        {/* 전체 컨테이너 */}
        {/* 모바일 430px 미만: 100% / 430px~767px: 430px 고정 / 768px~: 1280px */}
        <div className="flex w-full min-[430px]:w-[430px] md:w-[1280px]">
          
          {/* 좌측 PWA 영역 */}
          <div id="pwa-wrapper" className="w-full md:w-[430px] flex-shrink-0 h-screen overflow-y-auto">
            <div className="bg-white min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.08)] relative overflow-x-hidden">
              {pwaContent}
            </div>
          </div>
          
          {/* 우측 확장 콘텐츠 영역 - 768px 이상에서만 보임, 850px 고정 */}
          <div className="hidden md:block w-[850px] flex-shrink-0 h-screen overflow-y-auto">
            {/* 콘텐츠 - 패딩만 */}
            <div className="px-[50px] pt-[100px] pb-[50px]">
              {extendedContent}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
