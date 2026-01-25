'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PWAContainer from '@/components/layout/PWAContainer';
import PWAHome from '@/components/pwa/PWAHome';
import ExtendedContent from '@/components/extended/ExtendedContent';

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState('home');

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
  };

  const pwaContent = (
    <PWAContainer onMenuSelect={handleMenuSelect} activeMenu={activeMenu}>
      <PWAHome onMenuSelect={handleMenuSelect} />
    </PWAContainer>
  );

  const extendedContent = (
    <ExtendedContent activeMenu={activeMenu} />
  );

  return (
    <MainLayout 
      pwaContent={pwaContent} 
      extendedContent={extendedContent} 
    />
  );
}
