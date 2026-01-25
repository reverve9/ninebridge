'use client';

import React from 'react';
import ExtendedHome from './ExtendedHome';
import ExtendedDevelopment from './ExtendedDevelopment';
import ExtendedEvent from './ExtendedEvent';
import ExtendedMarketing from './ExtendedMarketing';
import ExtendedMedia from './ExtendedMedia';
import ExtendedContact from './ExtendedContact';
import Maintenance from '@/components/common/Maintenance';

interface ExtendedContentProps {
  activeMenu: string;
  selectedProject?: string | null;
}

export default function ExtendedContent({ activeMenu, selectedProject }: ExtendedContentProps) {
  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return <Maintenance title="HOME 상세" message="메인 페이지를 준비하고 있습니다." />;
      case 'service':
        return <Maintenance title="WORX 상세" message="사업분야 상세 페이지를 준비하고 있습니다." />;
      case 'project':
        // 프로젝트 선택 시 상세 표시, 없으면 안내
        if (selectedProject) {
          return <div>프로젝트 상세: {selectedProject}</div>;
        }
        return (
          <div className="flex items-center justify-center min-h-[400px] text-[#9ca3af] text-[14px]">
            좌측에서 프로젝트를 선택해주세요
          </div>
        );
      case 'contact':
        return <Maintenance title="CONTACT 상세" message="문의 페이지를 준비하고 있습니다." />;
      case 'development':
        return <ExtendedDevelopment />;
      case 'event':
        return <ExtendedEvent />;
      case 'marketing':
        return <ExtendedMarketing />;
      case 'media':
        return <ExtendedMedia />;
      default:
        return <ExtendedHome />;
    }
  };

  return (
    <div className="min-h-full">
      {renderContent()}
    </div>
  );
}
