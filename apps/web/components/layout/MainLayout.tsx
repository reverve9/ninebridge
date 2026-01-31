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
    <div className="h-screen bg-[#F9FAFB] overflow-hidden">
      {/* 3컬럼 구조: [좌측 사이드] | [1280 고정] | [우측 사이드] */}
      <div className="flex h-screen">
        
        {/* 좌측 사이드 영역 */}
        <div className="hidden xl:flex flex-1 min-w-0">
          {/* PWA 좌측 음영 - macOS 스타일 */}
          <div className="ml-auto w-[60px] h-full bg-gradient-to-r from-transparent via-black/[0.02] to-black/[0.08]" />
        </div>
        
        {/* 가운데 고정 영역 (1280px) */}
        <div className="flex w-full min-[500px]:w-[500px] md:w-[1280px] flex-shrink-0 mx-auto md:mx-0">
          
          {/* 좌측 PWA 영역 */}
          <div className="relative w-full md:w-[500px] flex-shrink-0 h-screen z-10">
            <div id="pwa-wrapper" className="w-full h-full overflow-y-auto">
              <div className="bg-white min-h-screen relative overflow-x-hidden shadow-[0_0_1px_rgba(0,0,0,0.1)]">
                {pwaContent}
              </div>
            </div>
            {/* PWA 우측 음영 - macOS 스타일 */}
            <div className="hidden md:block absolute top-0 left-full w-[40px] h-full bg-gradient-to-r from-black/[0.08] via-black/[0.02] to-transparent pointer-events-none" />
          </div>
          
          {/* 우측 확장 콘텐츠 영역 - 768px 이상에서만 보임, 780px 고정 */}
          <div className="hidden md:block w-[780px] flex-shrink-0 h-screen overflow-y-auto">
            {/* 콘텐츠 - 좌측 40px, 우측 20px */}
            <div className="pl-[40px] pr-[20px] pt-[25px] pb-[50px]">
              {extendedContent}
            </div>
          </div>
          
        </div>
        
        {/* 우측 사이드 영역 */}
        <div className="hidden xl:block flex-1 min-w-0">
          {/* 현재 비워둠 */}
        </div>
        
      </div>
    </div>
  );
}
