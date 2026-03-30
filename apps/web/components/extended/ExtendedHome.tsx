'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';
import SNSLinks from '@/components/common/SNSLinks';

export default function ExtendedHome() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error('설정 로드 실패:', error);
      }
    };
    loadSettings();
  }, []);

  return (
    <div className="h-full flex justify-center" style={{ alignItems: 'start', paddingTop: 'calc(55vh - 200px)' }}>
      <div>
        {/* 로고 영역 */}
        <div className="mb-8">
          <Image
            src="/logo_main.png"
            alt="NINE BRIDGE"
            width={400}
            height={240}
            style={{ width: '400px', height: 'auto' }}
            priority
          />
          <p className="text-[16px] font-light text-[#000] mt-2 tracking-wide">주식회사 나인브릿지</p>
        </div>

      {/* 슬로건 */}
      <div className="mb-10">
        <h2 className="font-score text-[28px] font-semibold text-[#333] mb-5 leading-snug">
          "플랫폼과 콘텐츠가 마케팅으로 연결되는 순간"
        </h2>
        <p className="text-[18px] font-thin text-[#000] leading-[1.7]">
          단순한 노출이 아닌, 진심을 전합니다.<br />
          브랜드의 가치를 콘텐츠에 담아, 마케팅으로 마음을 움직입니다.<br />
          플랫폼 위에서 당신이 빛나는 순간.<br />
          <span className="text-[20px] font-semibold">나인브릿지가 함께합니다.</span>
        </p>
      </div>

      {/* CTA 버튼 */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#384155] text-white text-[13px] font-medium rounded-[4px] hover:bg-[#2d3444] transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Connect
        </button>

        {settings && <SNSLinks settings={settings} variant="button" />}
      </div>
      </div>
    </div>
  );
}
