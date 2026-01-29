'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PWAContainer from '@/components/layout/PWAContainer';
import PWAHome from '@/components/pwa/PWAHome';
import PWAProject from '@/components/pwa/PWAProject';
import PWANotice from '@/components/pwa/PWANotice';
import PWAContact from '@/components/pwa/PWAContact';
import ExtendedContent from '@/components/extended/ExtendedContent';

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
    setSelectedProject(null);
    setSelectedNotice(null);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleNoticeSelect = (noticeId: string | null) => {
    setSelectedNotice(noticeId);
  };

  const renderPWAContent = () => {
    switch (activeMenu) {
      case 'home':
        return <PWAHome onMenuSelect={handleMenuSelect} />;
      case 'works':
        return <PWAProject onProjectSelect={handleProjectSelect} />;
      case 'notice':
        return <PWANotice onSelectNotice={handleNoticeSelect} selectedNoticeId={selectedNotice} />;
      case 'contact':
        return <PWAContact />;
      default:
        return <PWAHome onMenuSelect={handleMenuSelect} />;
    }
  };

  const pwaContent = (
    <PWAContainer onMenuSelect={handleMenuSelect} activeMenu={activeMenu}>
      {renderPWAContent()}
    </PWAContainer>
  );

  const extendedContent = (
    <ExtendedContent 
      activeMenu={activeMenu} 
      selectedProject={selectedProject}
      selectedNotice={selectedNotice}
    />
  );

  return (
    <MainLayout 
      pwaContent={pwaContent} 
      extendedContent={extendedContent}
      activeMenu={activeMenu}
    />
  );
}
