'use client';

import React from 'react';
import PageTitle from '@/components/common/PageTitle';
import Maintenance from '@/components/common/Maintenance';
import PWAFooter from '@/components/pwa/PWAFooter';

export default function PWAContact() {
  return (
    <div className="min-h-full bg-white">
      <PageTitle title="CONTACT" subtitle="견적 및 기타 문의" />
      <Maintenance />
      <PWAFooter />
    </div>
  );
}
