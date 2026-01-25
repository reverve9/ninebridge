'use client';

import React, { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  preview?: ReactNode;
  showPreview?: boolean;
}

export default function AdminLayout({ children, preview, showPreview = true }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex justify-center">
        <div className="flex w-full max-w-[1280px]">
          
          {/* 좌측 PWA 미리보기 */}
          {showPreview && (
            <div className="w-[430px] min-h-screen flex-shrink-0 sticky top-0 h-screen overflow-hidden">
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
          
          {/* 우측 어드민 콘텐츠 */}
          <div className={`flex-1 min-h-screen ${showPreview ? '' : 'max-w-[1280px] mx-auto'}`}>
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
}
