'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';
import SNSLinks from '@/components/common/SNSLinks';

export default function PWAFooter() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  };

  if (!settings) return null;

  return (
    <footer className="bg-white mt-[60px] pb-4">
      {/* 회색 박스 */}
      <div className="bg-[#f5f5f5]">
        {/* 메인 영역 */}
        <div className="flex gap-3 px-4 py-4">
          {/* 좌측: 스퀘어 로고 (20%) */}
          <div className="w-[20%] flex-shrink-0 flex items-center justify-center">
            <div className="w-[90px] h-[90px] relative flex items-center justify-center">
              {/* 블루 블러 원형 배경 - 넓게 퍼짐 */}
              <div 
                className="absolute rounded-full"
                style={{
                  width: '140px',
                  height: '140px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(91,124,174,0.3) 0%, rgba(91,124,174,0.15) 40%, rgba(91,124,174,0.05) 60%, rgba(91,124,174,0) 80%)'
                }}
              />
              <img 
                src="/logo_s250.png" 
                alt="Nine Bridge" 
                className="w-[60px] h-[60px] object-contain relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* 우측: 정보 */}
          <div className="flex-1 flex flex-col justify-center">
            {/* 회사명 - 헤더 느낌, 아래 여백 */}
            <p className="text-[15px] font-medium text-[#333] mb-1.5">
              {settings.company_name}
            </p>
            
            {/* 본문 정보 - 줄간격 타이트 */}
            <div className="space-y-[-1px]">
              {/* 주소 | 대표자 */}
              <p className="text-[13px] font-thin text-black leading-relaxed">
                {settings.address} | 대표자: {settings.ceo_name}
              </p>
              
              {/* 사업자등록번호 | 통신판매업신고번호 */}
              <p className="text-[13px] font-thin text-black leading-relaxed">
                사업자등록번호: {settings.business_number}
                {settings.business_license && ` | 통신판매업신고번호: ${settings.business_license}`}
              </p>
              
              {/* 개인정보보호책임자 */}
              {settings.privacy_officer && (
                <p className="text-[13px] font-thin text-black leading-relaxed">
                  개인정보보호책임자: {settings.privacy_officer}
                  {settings.privacy_officer_email && `(${settings.privacy_officer_email})`}
                </p>
              )}
              
              {/* 고객센터 | 이메일 */}
              <p className="text-[13px] font-thin text-black leading-relaxed flex items-center gap-1 flex-wrap">
                <span>고객센터:</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>{settings.tel}</span>
                {settings.fax && (
                  <>
                    <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                    </svg>
                    <span>{settings.fax}</span>
                  </>
                )}
                <span className="mx-1">|</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>{settings.email}</span>
              </p>
            </div>

            {/* SNS */}
            <div className="mt-2">
              <SNSLinks settings={settings} variant="icon-sm" />
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="px-4 pb-3">
          <p className="text-[12px] font-extralight text-[#333] text-center">
            ©{new Date().getFullYear()}. Nine Bridge, Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
