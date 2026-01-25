'use client';

import React from 'react';
import ExtendedHome from './ExtendedHome';
import ExtendedDevelopment from './ExtendedDevelopment';
import ExtendedEvent from './ExtendedEvent';
import ExtendedMarketing from './ExtendedMarketing';
import ExtendedMedia from './ExtendedMedia';
import ExtendedContact from './ExtendedContact';

interface ExtendedContentProps {
  activeMenu: string;
}

export default function ExtendedContent({ activeMenu }: ExtendedContentProps) {
  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return <ExtendedHome />;
      case 'development':
        return <ExtendedDevelopment />;
      case 'event':
        return <ExtendedEvent />;
      case 'marketing':
        return <ExtendedMarketing />;
      case 'media':
        return <ExtendedMedia />;
      case 'contact':
        return <ExtendedContact />;
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
