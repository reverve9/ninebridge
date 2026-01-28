'use client';

import React, { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
  preview?: ReactNode;
  showPreview?: boolean;
  activeTab?: string;
}

const adminTabs = [
  { id: 'home', label: 'HOME', path: '/admin/home' },
  { id: 'works', label: 'WORX', path: '/admin/projects' },
  { id: 'notice', label: 'NEWS', path: '/admin/notices' },
  { id: 'contact', label: 'CONNECT', path: '/admin/contact' },
];

export default function AdminLayout({ children, preview, showPreview = true, activeTab }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // activeTab이 없으면 pathname에서 추론
  const currentTab = activeTab || (() => {
    if (pathname?.includes('/admin/projects')) return 'works';
    if (pathname?.includes('/admin/notices')) return 'notice';
    if (pathname?.includes('/admin/contact')) return 'contact';
    if (pathname?.includes('/admin/home')) return 'home';
    return 'works';
  })();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 상단 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center justify-between h-[60px]">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-bold text-[#3071a5]">NINE BRIDGE</span>
              <span className="text-[12px] text-[#9ca3af] bg-[#f3f4f6] px-2 py-0.5 rounded">Admin</span>
            </div>
            
            {/* 탭 메뉴 */}
            <div className="flex items-center gap-1">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.path)}
                  className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors
                    ${currentTab === tab.id
                      ? 'bg-[#3071a5] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* 로그아웃 */}
            <button
              onClick={() => router.push('/admin')}
              className="text-[14px] text-[#9ca3af] hover:text-[#6b7280]"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center h-[calc(100vh-60px)]">
        <div className="flex w-full max-w-[1280px]">
          
          {/* 좌측 PWA 미리보기 */}
          {showPreview && (
            <div className="w-[500px] flex-shrink-0 h-full overflow-hidden">
              <div className="h-full bg-[#e5e7eb] p-4">
                <p className="text-[12px] text-[#6b7280] mb-2 text-center">미리보기</p>
                <div className="bg-white h-[calc(100%-24px)] rounded-[12px] shadow-lg overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    {preview || (
                      <div className="flex items-center justify-center h-full text-[#9ca3af] text-[14px]">
                        미리보기 영역
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 우측 어드민 콘텐츠 - 독립 스크롤 */}
          <div className={`flex-1 h-full overflow-y-auto ${showPreview ? '' : 'max-w-[1280px] mx-auto'}`}>
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
}
