'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';

interface PWAFooterProps {
  onCertClick?: () => void;
}

export default function PWAFooter({ onCertClick }: PWAFooterProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSiteSettings();
    setSettings(data);
  };

  if (!settings) return null;

  const hasSns = settings.sns_kakao || settings.sns_instagram || settings.sns_youtube || settings.sns_facebook;

  return (
    <footer className="bg-white mt-2 px-4 pb-4">
      {/* 회색 박스 */}
      <div className="bg-[#f5f5f5]">
        {/* 메인 영역 */}
        <div className="flex gap-3 px-4 py-4">
          {/* 좌측: 스퀘어 로고 (20%) */}
          <div className="w-[20%] flex-shrink-0 flex items-center justify-center">
            <div className="w-[90px] h-[90px] bg-[#eaeaea] rounded-full flex items-center justify-center">
              <img 
                src="/logo_s250.png" 
                alt="Nine Bridge" 
                className="w-[60px] h-[60px] object-contain"
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
            {hasSns && (
              <div className="flex items-center gap-2 mt-2">
                {settings.sns_kakao && (
                  <a 
                    href={settings.sns_kakao} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 bg-[#e0e0e0] rounded-full flex items-center justify-center hover:bg-[#d5d5d5] transition-colors text-[#777]"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.8 5.27 4.5 6.72l-.9 3.28c-.1.36.28.66.6.48l3.88-2.25c.63.1 1.28.15 1.92.15 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                    </svg>
                  </a>
                )}
                {settings.sns_instagram && (
                  <a 
                    href={settings.sns_instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 bg-[#e0e0e0] rounded-full flex items-center justify-center hover:bg-[#d5d5d5] transition-colors text-[#777]"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {settings.sns_youtube && (
                  <a 
                    href={settings.sns_youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 bg-[#e0e0e0] rounded-full flex items-center justify-center hover:bg-[#d5d5d5] transition-colors text-[#777]"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {settings.sns_facebook && (
                  <a 
                    href={settings.sns_facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 bg-[#e0e0e0] rounded-full flex items-center justify-center hover:bg-[#d5d5d5] transition-colors text-[#777]"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
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
