'use client';

import React from 'react';
import PageTitle from '@/components/common/PageTitle';
import Maintenance from '@/components/common/Maintenance';

export default function PWAHome() {
  return (
    <>
      <PageTitle title="HOME" subtitle="나인 브릿지" />
      <Maintenance />
    </>
  );
}
