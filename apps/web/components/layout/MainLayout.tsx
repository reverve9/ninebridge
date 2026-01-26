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
      
      {/* 모바일: 중앙정렬 / 768~1279: 좌측정렬 / 1280~: 중앙정렬 */}
      <div className="flex justify-center md:justify-start xl:justify-center h-screen">
        {/* 전체 컨테이너 */}
        {/* 모바일 500px 미만: 100% / 500px~767px: 500px 고정 / 768px~: 1280px */}
        <div className="flex w-full min-[500px]:w-[500px] md:w-[1280px]">
          
          {/* 좌측 PWA 영역 */}
          {/* 모바일: 100% or 500px / 데스크탑: 500px */}
          <div id="pwa-wrapper" className="w-full md:w-[500px] flex-shrink-0 h-screen overflow-y-auto">
            <div className="bg-white min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.08)] relative overflow-x-hidden">
              {pwaContent}
            </div>
          </div>
          
          {/* 우측 확장 콘텐츠 영역 - 768px 이상에서만 보임, 780px 고정 */}
          <div className="hidden md:block w-[780px] flex-shrink-0 h-screen overflow-y-auto">
            {/* 콘텐츠 - 좌측 30px, 우측 0 */}
            <div className="pl-[30px] pr-0 pt-[100px] pb-[50px]">
              {extendedContent}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
