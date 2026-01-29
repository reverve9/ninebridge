'use client';

import React, { ReactNode } from 'react';
import PWANavigation from './PWANavigation';

interface PWAContainerProps {
  children: ReactNode;
  onMenuSelect?: (menu: string) => void;
  activeMenu?: string;
}

export default function PWAContainer({ children, onMenuSelect, activeMenu = 'home' }: PWAContainerProps) {
  return (
    <PWANavigation onMenuSelect={onMenuSelect} activeMenu={activeMenu}>
      {children}
    </PWANavigation>
  );
}
