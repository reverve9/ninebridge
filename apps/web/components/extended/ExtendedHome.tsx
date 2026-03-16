'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';

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
        {/* 문의하기 버튼 - 반전 스타일 */}
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#384155] text-white text-[13px] font-medium rounded-[4px] hover:bg-[#2d3444] transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Connect
        </button>

        {/* SNS 버튼들 - 기본 스타일 유지, 사이즈만 축소 */}
        {settings && (
          <>
            {settings.sns_kakao && (
              <a 
                href={settings.sns_kakao} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] bg-white text-[#333] text-[13px] font-medium rounded-[4px] hover:bg-[#f9f9f9] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.8 5.27 4.5 6.72l-.9 3.28c-.1.36.28.66.6.48l3.88-2.25c.63.1 1.28.15 1.92.15 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                </svg>
                카카오톡
              </a>
            )}
            {settings.sns_instagram && (
              <a 
                href={settings.sns_instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] bg-white text-[#333] text-[13px] font-medium rounded-[4px] hover:bg-[#f9f9f9] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                인스타그램
              </a>
            )}
            {settings.sns_youtube && (
              <a 
                href={settings.sns_youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] bg-white text-[#333] text-[13px] font-medium rounded-[4px] hover:bg-[#f9f9f9] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                유튜브
              </a>
            )}
            {settings.sns_facebook && (
              <a 
                href={settings.sns_facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] bg-white text-[#333] text-[13px] font-medium rounded-[4px] hover:bg-[#f9f9f9] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                페이스북
              </a>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}
