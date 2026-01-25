'use client';

import React from 'react';
import ExtendedHome from './ExtendedHome';
import ExtendedDevelopment from './ExtendedDevelopment';
import ExtendedEvent from './ExtendedEvent';
import ExtendedMarketing from './ExtendedMarketing';
import ExtendedMedia from './ExtendedMedia';
import ExtendedContact from './ExtendedContact';
import ExtendedProject from './ExtendedProject';
import ExtendedNotice from './ExtendedNotice';
import Maintenance from '@/components/common/Maintenance';

interface ExtendedContentProps {
  activeMenu: string;
  selectedProject?: string | null;
  selectedNotice?: string | null;
}

export default function ExtendedContent({ activeMenu, selectedProject, selectedNotice }: ExtendedContentProps) {
  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return <Maintenance size="large" />;
      case 'works':
        return <ExtendedProject selectedProjectId={selectedProject} />;
      case 'notice':
        return <ExtendedNotice selectedNoticeId={selectedNotice} />;
      case 'contact':
        return <Maintenance size="large" />;
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
