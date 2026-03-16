'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';
import PWAFooter from '@/components/pwa/PWAFooter';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';

// 파트너사 로고 (추후 DB로 이동 가능)
const partners = [
  { name: '강릉시', logo: '/partners/gangneung.png' },
  { name: '네이버', logo: '/partners/naver.png' },
  { name: '카카오', logo: '/partners/kakao.png' },
  { name: '강원도', logo: '/partners/gangwon.png' },
];

export default function PWAContact() {
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

  return (
    <div className="min-h-full bg-white">
      <PageTitle title="CONNECT" subtitle="정보&문의" />

      {/* CI 영역 - 간결하게 */}
      <section className="px-[30px] py-6">
        <div className="flex items-center gap-4">
          <img 
            src="/logo_s250.png" 
            alt="Nine Bridge" 
            className="w-[80px] h-[80px] object-contain"
          />
          <div>
            <h2 className="font-score text-[18px] font-bold text-[#333]">
              {settings?.company_name || '(주)나인브릿지'}
            </h2>
            <p className="font-raleway text-[12px] text-[#3071a5] mt-1 tracking-wide">
              Link the Next.
            </p>
          </div>
        </div>
      </section>

      {/* 빠른 문의 버튼 */}
      <section className="px-[30px] py-4">
        <div className="space-y-3">
          <a 
            href={`tel:${settings?.tel || '033-823-0133'}`}
            className="flex items-center gap-3 p-4 bg-[#3071a5] text-white rounded-[12px] shadow-[2px_2px_8px_rgba(0,0,0,0.1)]"
          >
            <Phone size={22} />
            <div>
              <p className="text-[15px] font-medium">전화 문의</p>
              <p className="text-[13px] opacity-80">{settings?.tel || '033-823-0133'}</p>
            </div>
          </a>
          
          <a 
            href={settings?.sns_kakao || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[#FEE500] text-[#3C1E1E] rounded-[12px] shadow-[2px_2px_8px_rgba(0,0,0,0.1)]"
          >
            <MessageCircle size={22} />
            <div>
              <p className="text-[15px] font-medium">카카오톡 문의</p>
              <p className="text-[13px] opacity-70">실시간 상담 가능</p>
            </div>
          </a>
          
          <a 
            href={`mailto:${settings?.email || 'rev_nine@naver.com'}`}
            className="flex items-center gap-3 p-4 bg-[#f5f5f5] text-[#333] rounded-[12px] shadow-[2px_2px_8px_rgba(0,0,0,0.1)]"
          >
            <Mail size={22} />
            <div>
              <p className="text-[15px] font-medium">이메일 문의</p>
              <p className="text-[13px] text-[#666]">{settings?.email || 'rev_nine@naver.com'}</p>
            </div>
          </a>
        </div>
      </section>

      {/* 파트너사 - 작게 */}
      <section className="px-[30px] py-6">
        <p className="text-[12px] text-[#9ca3af] mb-3">Partners</p>
        <div className="grid grid-cols-4 gap-2">
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="aspect-[3/2] bg-[#f9fafb] rounded-[6px] flex items-center justify-center p-2"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="max-w-full max-h-full object-contain grayscale opacity-60"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'text-[10px] text-[#9ca3af]';
                  fallback.textContent = partner.name;
                  (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 안내 문구 */}
      <section className="px-[30px] py-4">
        <div className="bg-[#f9fafb] rounded-[8px] p-4 text-center">
          <p className="text-[13px] text-[#666]">
            상세 문의는 데스크탑에서<br />
            문의 폼을 이용해 주세요
          </p>
        </div>
      </section>

      {/* 푸터 */}
      <PWAFooter />
    </div>
  );
}
