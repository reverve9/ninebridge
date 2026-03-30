'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';
import SNSLinks from '@/components/common/SNSLinks';

interface ExtendedSNSProps {
  title?: string;
  subtitle?: string;
}

export default function ExtendedSNS({ title, subtitle }: ExtendedSNSProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSiteSettings();
    setSettings(data);
  };

  if (!settings) return <div className="h-[56px]" />;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb]">
      {/* 좌측: 페이지 타이틀 */}
      <div className="flex items-baseline gap-1.5">
        {title && (
          <span className="font-raleway text-[20px] tracking-[1px] font-[100] text-[#000000]">
            {title}
          </span>
        )}
        {subtitle && (
          <span className="text-[12px] font-[300] text-[#333333]">
            {subtitle}
          </span>
        )}
      </div>

      {/* 우측: SNS 아이콘 */}
      <SNSLinks settings={settings} variant="icon" />
    </div>
  );
}
