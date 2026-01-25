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
        {/* 전체 컨테이너 - 최대 1200px */}
        <div className="flex w-full max-w-[1200px]">
          
          {/* 좌측 PWA 영역 - 항상 430px, 독립 스크롤 */}
          <div id="pwa-wrapper" className="w-full max-w-[430px] h-screen mx-auto md:mx-0 md:flex-shrink-0 overflow-y-auto">
            <div className="bg-white min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.08)] relative overflow-x-hidden">
              {pwaContent}
            </div>
          </div>
          
          {/* 우측 확장 콘텐츠 영역 - 768px 이상에서만 보임, 독립 스크롤 */}
          <div className="hidden md:block flex-1 h-screen overflow-y-auto">
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
