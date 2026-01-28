'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';

export default function ExtendedFooter() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSiteSettings();
    setSettings(data);
  };

  if (!settings) return null;

  return (
    <div className="pt-[100px]">
      <div className="py-4 text-center border-t border-[#e5e7eb]">
        <p className="text-[13px] text-[#6b7280]">
          {settings.company_name} | T. {settings.tel} | {settings.email}
        </p>
        <p className="text-[12px] text-[#9ca3af] mt-1">
          © {new Date().getFullYear()} Ninebridge. All rights reserved.
        </p>
      </div>
    </div>
  );
}
