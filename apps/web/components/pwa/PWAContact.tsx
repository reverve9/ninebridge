'use client';

import React from 'react';
import PageTitle from '@/components/common/PageTitle';
import Maintenance from '@/components/common/Maintenance';

export default function PWAContact() {
  return (
    <div className="min-h-full bg-white">
      <PageTitle title="CONNECT" subtitle="정보&문의" />
      <Maintenance />
    </div>
  );
}
