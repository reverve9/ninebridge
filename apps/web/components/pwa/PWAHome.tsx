'use client';

import React, { useState, useEffect } from 'react';
import PWAFooter from '@/components/pwa/PWAFooter';
import PWAHeader from '@/components/layout/PWAHeader';
import PageTitle from '@/components/common/PageTitle';
import { getSiteSettings } from '@/lib/siteSettings';

interface HomeSettings {
  header_tagline?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_description?: string;
}

interface PWAHomeProps {
  onMenuSelect?: (menu: string) => void;
  onBusinessAreaSelect?: (areaId: string) => void;
  isPreview?: boolean;
  settings?: HomeSettings;
}

export default function PWAHome({ onMenuSelect, onBusinessAreaSelect, isPreview = false, settings: externalSettings }: PWAHomeProps) {
  const [dbSettings, setDbSettings] = useState<HomeSettings | null>(null);

  useEffect(() => {
    // 외부 설정이 없을 때만 DB에서 로드
    if (!externalSettings) {
      loadSettings();
    }
  }, []);

  const loadSettings = async () => {
    const data = await getSiteSettings();
    if (data) {
      setDbSettings({
        header_tagline: data.header_tagline || undefined,
        hero_title: data.hero_title || undefined,
        hero_subtitle: data.hero_subtitle || undefined,
        hero_description: data.hero_description || undefined,
      });
    }
  };

  // 외부 설정 우선, 없으면 DB 설정 사용
  const settings = externalSettings || dbSettings;

  // 기본값
  const headerTagline = settings?.header_tagline || '나인브릿지는 모두의 내일을 연결합니다';
  const heroTitle = settings?.hero_title || 'Connect platform\nCreate experience';
  const heroSubtitle = settings?.hero_subtitle || '콘텐츠, 마케팅, 플랫폼을 연결하는\n디지털 마케팅 전문 기업';
  const heroDescription = settings?.hero_description || '(주)나인브릿지는 플랫폼 기획 및 개발, 영상 및 디자인 콘텐츠 제작, 라이브커머스 운영, 오픈마켓 관리 및 SNS 마케팅까지 마케팅 전반을 아우르는 디지털 마케팅 전문 기업입니다.';

  // 타이틀 파싱 (줄바꿈으로 분리)
  const titleLines = heroTitle.split('\n');
  const subtitleLines = heroSubtitle.split('\n');

  return (
    <div className="min-h-full bg-white relative">
      {/* 페이지 타이틀 */}
      <PageTitle title="HOME" subtitle="나인브릿지" />

      {/* 히어로 영역 - 흰 배경 */}
      <section className="px-[30px] py-8 bg-white">
        {/* 메인 카피 */}
        <div className="relative mb-6">
          {/* 블러 배경 - 좌측 */}
          <div 
            className="absolute -left-14 top-0 w-[315px] h-[315px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(91,124,174,0.25) 0%, rgba(91,124,174,0.12) 40%, rgba(91,124,174,0) 70%)'
            }}
          />
          <h1 className="font-raleway text-[30px] font-[200] text-[#333] tracking-[2px] leading-tight relative z-10">
            {titleLines.map((line, idx) => (
              <span key={idx} className={`block ${idx > 0 ? 'pl-12' : ''}`}>
                {line.charAt(0) === 'C' ? (
                  <><span className="font-[500]">C</span>{line.slice(1)}</>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
        </div>
        
        {/* 서브 타이틀 */}
        <h2 className="font-score text-[16px] font-medium text-[#333] mb-3">
          {subtitleLines.map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < subtitleLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
        
        {/* 설명 */}
        <p className="text-[14px] font-light text-[#666] leading-relaxed">
          {heroDescription}
        </p>
      </section>

      {/* 임시 콘텐츠 영역 */}
      <section className="h-[500px] flex items-center justify-center bg-white">
        <p className="text-[14px] text-[#999]">콘텐츠 준비 중</p>
      </section>

      {/* 푸터 */}
      <PWAFooter />
    </div>
  );
}
