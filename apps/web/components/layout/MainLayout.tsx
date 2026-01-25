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
      
      <div className="flex justify-center md:justify-start h-screen">
        {/* 전체 컨테이너 - 데스크탑 1280px 고정, 모바일은 화면 너비 */}
        <div className="flex w-full md:w-[1280px]">
          
          {/* 좌측 PWA 영역 - 모바일: 전체, 데스크탑: 430px */}
          <div id="pwa-wrapper" className="w-full md:w-[430px] flex-shrink-0 h-screen overflow-y-auto">
            <div className="bg-white min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.08)] relative overflow-x-hidden">
              {pwaContent}
            </div>
          </div>
          
          {/* 우측 확장 콘텐츠 영역 - 768px 이상에서만 보임, 850px 고정 */}
          <div className="hidden md:block w-[850px] flex-shrink-0 h-screen overflow-y-auto">
            {/* 콘텐츠 카드 - 상단 20px 마진 */}
            <div className="px-[20px] pt-[20px] pb-[20px]">
              <div className="bg-white rounded-[12px] min-h-[calc(100vh-40px)] p-8 shadow-sm">
                {extendedContent}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
