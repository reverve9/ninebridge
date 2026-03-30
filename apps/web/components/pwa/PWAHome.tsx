'use client';

import React, { useState, useEffect } from 'react';
import PWAFooter from '@/components/pwa/PWAFooter';

import PageTitle from '@/components/common/PageTitle';
import { getSiteSettings } from '@/lib/siteSettings';
import { MonitorSmartphone, FileVideo, ShoppingCart, UsersRound } from 'lucide-react';

interface HomeSettings {
  header_tagline?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_description?: string;
}

interface PWAHomeProps {
  onBusinessAreaSelect?: (areaId: string) => void;
  onGoToProjects?: (filter: { category?: string; tag?: string }) => void;
  settings?: HomeSettings;
}

// 사업분야 데이터
const businessAreas = [
  {
    id: 'platform',
    title: '플랫폼 기획 및 개발',
    subtitle: '비즈니스를 위한 최적의 연결',
    description: '고객의 니즈에 맞춘 플랫폼을 기획하고, 안정적이고 확장 가능한 시스템으로 구현합니다.',
    color: '#5b7cae',
    icon: MonitorSmartphone,
  },
  {
    id: 'contents',
    title: '콘텐츠 제작',
    subtitle: '브랜드의 가치를 담은 이야기',
    description: '영상, 디자인, 라이브커머스까지. 제품의 매력을 극대화하는 콘텐츠를 만듭니다.',
    color: '#b87a5a',
    icon: FileVideo,
  },
  {
    id: 'marketing',
    title: '디지털 마케팅',
    subtitle: '효율적인 노출, 확실한 성과',
    description: 'SNS, 검색광고, 퍼포먼스 마케팅으로 브랜드를 알리고 고객과 연결합니다.',
    color: '#6b9b7a',
    icon: ShoppingCart,
  },
  {
    id: 'etc',
    title: '행사 기획 및 대행',
    subtitle: '특별한 순간을 완벽하게',
    description: '기업 행사, 프로모션, 전시까지. 기획부터 운영까지 원스톱으로 진행합니다.',
    color: '#7c8a96',
    icon: UsersRound,
  },
];

export default function PWAHome({ onBusinessAreaSelect, onGoToProjects, settings: externalSettings }: PWAHomeProps) {
  const [dbSettings, setDbSettings] = useState<HomeSettings | null>(null);
  const [liveExpanded, setLiveExpanded] = useState(false);
  const [platformExpanded, setPlatformExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'platform' | 'live'>('platform');

  useEffect(() => {
    // 외부 설정이 없을 때만 DB에서 로드
    if (!externalSettings) {
      loadSettings();
    }
  }, []);

  // 7초 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => prev === 'platform' ? 'live' : 'platform');
    }, 7000);
    return () => clearInterval(interval);
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

      {/* 사업분야 섹션 - 타이틀 없이 카드만 */}
      <section className="px-[30px] py-12 bg-white">
        <div className="grid grid-cols-2 gap-4">
          {businessAreas.map((area) => {
            const Icon = area.icon;
            return (
              <button
                key={area.id}
                onClick={() => onBusinessAreaSelect?.(area.id)}
                className="bg-white p-4 sm:p-5 text-left rounded-[6px] shadow-[4px_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1"
              >
                {/* 타이틀 + 아이콘 */}
                <h4 
                  className="flex items-center gap-1.5 sm:gap-2 font-score text-[14px] sm:text-[16px] font-bold mb-1.5 sm:mb-2"
                  style={{ color: area.color }}
                >
                  <Icon size={16} className="sm:w-5 sm:h-5" strokeWidth={2} />
                  {area.title}
                </h4>
                {/* 서브타이틀 */}
                <p className="text-[13px] sm:text-[15px] font-medium text-[#666] mb-1.5 sm:mb-2">
                  {area.subtitle}
                </p>
                {/* 설명 */}
                <p className="text-[12px] sm:text-[15px] font-thin text-[#000] leading-normal">
                  {area.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 주력분야 섹션 - 슬로건 스타일 */}
      <section className="px-[60px] pt-[60px] pb-[90px] bg-white relative">
        {/* 블러 배경 - 센터, 더 크게 */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(107,155,122,0.3) 0%, rgba(107,155,122,0.15) 40%, rgba(107,155,122,0) 70%)'
          }}
        />
        
        <div className="relative z-10">
          {/* Platform - 좌측 배치 */}
          <div className="mb-6">
            <h2 className="font-raleway text-[22px] sm:text-[24px] font-[200] tracking-[2px] leading-none mb-1" style={{ color: '#384155' }}>
              <span className="font-[500]">P</span>latform
            </h2>
            <p className="text-[14px] sm:text-[15px] font-light text-[#666]">
              기획부터 개발, 운영, 그리고 확장까지
            </p>
          </div>
          
          {/* Live Commerce - 우측 배치 */}
          <div className="mb-12 ml-auto w-fit">
            <h2 className="font-raleway text-[22px] sm:text-[24px] font-[200] tracking-[2px] leading-none mb-1" style={{ color: '#b87a5a' }}>
              <span className="font-[500]">L</span>ive Commerce
            </h2>
            <p className="text-[14px] sm:text-[15px] font-light text-[#666]">
              콘텐츠 제작부터 스토어 운영, SNS 마케팅까지
            </p>
          </div>
          
          {/* 한글 카피 */}
          <div>
            <p className="text-[17px] sm:text-[19px] font-light text-[#333] leading-relaxed mb-3">
              플랫폼 위에서 콘텐츠와 마케팅이 하나가 되는 순간
            </p>
            
            <p className="text-[19px] sm:text-[21px] font-[700] text-[#333]">
              나인브릿지가 함께합니다!
            </p>
          </div>
        </div>
      </section>

      {/* 주력분야 상세 - 2열 그리드 */}
      <section className="grid grid-cols-2 relative">
        {/* 좌측 - Platform 또는 Live Commerce 확장 내용 */}
        <div className="relative h-[440px] overflow-hidden">
          {/* Platform 기본 */}
          <div 
            className={`absolute inset-0 bg-[#5b7cae] p-6 transition-all duration-300 ${
              liveExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{ backgroundImage: 'url(/platform.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* + 버튼 */}
            <button 
              onClick={() => setPlatformExpanded(!platformExpanded)}
              className="absolute top-4 right-4 z-20"
            >
              <div 
                className="w-8 h-8 flex items-center justify-center transition-transform duration-300"
                style={{ transform: platformExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <div className="absolute w-[24px] h-[4px] bg-white rounded-sm" />
                <div className="absolute w-[4px] h-[24px] bg-white rounded-sm" />
              </div>
            </button>
          </div>
          
          {/* Live Commerce 확장 오버레이 - 좌측에 표시 */}
          <div 
            className={`absolute inset-0 p-6 pt-6 transition-all duration-300 ${
              liveExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
            style={{ backgroundImage: 'url(/platform.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gray-100/80" />
            <div className="relative z-10 text-[14px]">
              <img src="/naver_live_logo.png" alt="네이버 쇼핑 LIVE" className="h-[32px] mb-4" />
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">기획 / 연출</p>
                <p className="text-[#666]">기획 및 관리 / 커뮤니케이션</p>
                <p className="text-[#666]">운영 기획안 및 스크립트 작성</p>
              </div>
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">촬영 / 기술지원</p>
                <p className="text-[#666]">스튜디오 셋업 · 송출 장비 운영</p>
                <p className="text-[#666]">VMD · 인포그래픽 · AI 대응</p>
              </div>
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">홍보 / 섭외</p>
                <p className="text-[#666]">DA광고 · SNS 마케팅</p>
                <p className="text-[#666]">전문 쇼호스트 섭외</p>
              </div>
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">구성 환경</p>
                <p className="text-[#666]">라이브커머스 전용 스튜디오 보유</p>
                <p className="text-[#666]">시청자 유입을 위한 사전 광고 [옵션]</p>
                <p className="text-[#666]">SNS 마케팅 (인스타그램 / 유튜브)</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 우측 - Live Commerce 또는 Platform 확장 내용 */}
        <div className="relative h-[440px] overflow-hidden">
          {/* Live Commerce 기본 */}
          <div 
            className={`absolute inset-0 bg-[#d4b89c] p-6 transition-all duration-300 ${
              platformExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{ backgroundImage: 'url(/livecommerce.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* + 버튼 */}
            <button 
              onClick={() => setLiveExpanded(!liveExpanded)}
              className="absolute top-4 left-4 z-20"
            >
              <div 
                className="w-8 h-8 flex items-center justify-center transition-transform duration-300"
                style={{ transform: liveExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <div className="absolute w-[24px] h-[4px] bg-white rounded-sm" />
                <div className="absolute w-[4px] h-[24px] bg-white rounded-sm" />
              </div>
            </button>
          </div>
          
          {/* Platform 확장 오버레이 - 우측에 표시 */}
          <div 
            className={`absolute inset-0 p-6 pt-6 transition-all duration-300 ${
              platformExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
            style={{ backgroundImage: 'url(/livecommerce.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gray-100/80" />
            <div className="relative z-10 text-[14px]">
              <p className="font-bold text-[18px] text-[#5b7cae] mb-4">Platform</p>
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">기획 / 설계</p>
                <p className="text-[#666]">비즈니스 요구사항 분석 · IA 설계</p>
                <p className="text-[#666]">Figma 기반 UX/UI 설계</p>
              </div>
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">개발 / 구축</p>
                <p className="text-[#666]">Next.js · React · Flutter 개발</p>
                <p className="text-[#666]">Supabase · AWS 기반 시스템 구축</p>
              </div>
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">운영 / 관리</p>
                <p className="text-[#666]">유지보수 · 기술지원 · 장애대응</p>
                <p className="text-[#666]">Vercel · GitHub 기반 배포관리</p>
              </div>
              
              <div className="mt-4">
                <p className="font-bold text-[#333] mb-1">확장 / 고도화</p>
                <p className="text-[#666]">AI 기능 연동 · API 확장 개발</p>
                <p className="text-[#666]">서비스 스케일업 · 성능 최적화</p>
                <p className="text-[#666]">신규 기능 개발 · 리뉴얼</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주력분야 상세 - 자동 슬라이더 */}
      <section className="bg-white relative">
        {/* 좌측 화살표 */}
        <button
          onClick={() => setActiveTab(activeTab === 'platform' ? 'live' : 'platform')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full shadow-md text-[#9ca3af] hover:text-[#5b7cae] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 우측 화살표 */}
        <button
          onClick={() => setActiveTab(activeTab === 'platform' ? 'live' : 'platform')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full shadow-md text-[#9ca3af] hover:text-[#5b7cae] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* 슬라이더 콘텐츠 */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500"
            style={{ transform: activeTab === 'platform' ? 'translateX(0)' : 'translateX(-100%)' }}
          >
            {/* Platform 콘텐츠 */}
            <div className="min-w-full px-[50px] py-16">
              {/* 로고 통합 이미지 */}
              <div className="flex justify-center mb-8">
                <img src="/logo_platform.png" alt="Platform 기술스택" className="w-full max-w-[440px]" />
              </div>
              
              {/* 카테고리 */}
              <p className="text-[#888] text-[15px] font-[400] mb-1 text-center">
                웹 / 앱 / 관리자 / API / 데이터베이스 까지
              </p>
              
              {/* 메인 카피 */}
              <h3 className="text-[#333] text-[28px] font-[900] mb-8 text-center">
                비즈니스를 위한 맞춤 플랫폼
              </h3>
              
              {/* 설명 */}
              <div className="text-[#000] text-[18px] font-[100] leading-[1.8] text-center">
                <p>보이는 것보다, 보이지 않는 것을 설계합니다</p>
                <p>데이터 구조, 운영 프로세스, 권한 관리, 자동화 등</p>
                <p>클라이언트가 필요로 하는 모든 기능을 코드로 구현하고</p>
                <p>지금 당장 필요한 것부터 앞으로 필요해질 것까지</p>
                <p>기획 단계에서 먼저 제안하고 설계합니다</p>
              </div>
              
              {/* 바로가기 버튼 */}
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => onGoToProjects?.({ category: 'platform' })}
                  className="px-3 py-1.5 bg-[#5b7cae] text-white text-[13px] rounded-[6px] hover:bg-[#4a6b9d] transition-all"
                >
                  프로젝트 보기 →
                </button>
              </div>
            </div>
            
            {/* Live Commerce 콘텐츠 */}
            <div className="min-w-full px-[50px] py-16">
              {/* 로고들 */}
              <div className="flex justify-center items-center gap-12 mb-8">
                <img src="/naver_live_logo.png" alt="네이버 쇼핑 LIVE" className="h-[30px]" />
                <img src="/logo_youtube.png" alt="YouTube" className="h-[22px]" />
              </div>
              
              {/* 카테고리 */}
              <p className="text-[#888] text-[15px] font-[400] mb-1 text-center">
                푸드 / 건강기능식품 / 미용 / 뷰티 / 패션소품 / 생활용품 까지
              </p>
              
              {/* 메인 카피 */}
              <h3 className="text-[#333] text-[28px] font-[900] mb-8 text-center">
                생생한 쇼핑! 라이브커머스
              </h3>
              
              {/* 설명 */}
              <div className="text-[#000] text-[18px] font-[100] leading-[1.8] text-center">
                <p>우리나라 대표적인 라이브커머스 플랫폼인</p>
                <p>'네이버 쇼핑라이브' 뿐만 아니라</p>
                <p>유튜브 라이브, 인스타그램 등의 SNS 마케팅 확장을 통해</p>
                <p>단순한 방송 판매가 아닌 브랜드를 설계하고 </p>
                <p>고객의 신뢰를 기반으로 하는 마케팅 구조를 만들어 드립니다</p>
              </div>
              
              {/* 바로가기 버튼 */}
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => onGoToProjects?.({ tag: '라이브커머스' })}
                  className="px-3 py-1.5 bg-[#5b7cae] text-white text-[13px] rounded-[6px] hover:bg-[#4a6b9d] transition-all"
                >
                  프로젝트 보기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <PWAFooter />
    </div>
  );
}
