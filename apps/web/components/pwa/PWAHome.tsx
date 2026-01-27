'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import PWAFooter from '@/components/pwa/PWAFooter';

// 전체 사업 분야 4개
const businessAreas = [
  {
    id: 'platform',
    title: '플랫폼',
    description: '오픈마켓, 쇼핑몰 운영 및 관리',
    detail: '네이버 스마트스토어, 쿠팡, 11번가 등 다양한 오픈마켓 입점부터 자사몰 구축까지. 상품 등록, 재고 관리, CS 대응까지 원스톱으로 관리해드립니다.',
    image: '/images/home/business01.jpg',
  },
  {
    id: 'marketing',
    title: '마케팅',
    description: 'SNS, 디지털 마케팅 전략 수립',
    detail: '인스타그램, 유튜브, 틱톡 등 SNS 채널 운영과 퍼포먼스 마케팅. 브랜드 인지도 향상부터 전환까지 데이터 기반으로 설계합니다.',
    image: '/images/home/business02.jpg',
  },
  {
    id: 'contents',
    title: '콘텐츠',
    description: '브랜딩, 상세페이지, 영상 제작',
    detail: '제품의 가치를 전달하는 상세페이지, 브랜드 스토리를 담은 영상 콘텐츠. 기획부터 제작까지 크리에이티브 솔루션을 제공합니다.',
    image: '/images/home/business03.jpg',
  },
  {
    id: 'event',
    title: '행사기획대행',
    description: '기업 행사, 프로모션 기획 및 운영',
    detail: '기업 세미나, 제품 런칭, 프로모션 이벤트 등. 컨셉 기획부터 현장 운영까지 성공적인 행사를 만들어드립니다.',
    image: '/images/home/business04.jpg',
  },
];

// 대표 사업 분야
const mainServices = [
  {
    id: 'live-commerce',
    subtitle: '생생한 쇼핑! 라이브커머스',
    description: '네이버 쇼핑라이브, 유튜브 라이브 등 다양한 플랫폼을 통해 단순한 방송 판매가 아닌 브랜드를 설계하고 고객의 신뢰를 기반으로 하는 마케팅 구조를 만들어 드립니다',
    tags: ['푸드', '건강기능식품', '미용', '뷰티', '패션소품', '생활용품'],
  },
  {
    id: 'digital-marketing',
    title: '디지털 마케팅',
    subtitle: 'SNS 플랫폼으로의 확장',
    description: '다양한 플랫폼을 통해 제품을 더 많은 사람들에게 효율적으로 전달합니다.',
    features: [
      { title: '인플루언서 마케팅', desc: '다양한 분야의 인플루언서 네트워크 보유' },
      { title: '크리에이터 전용 판매 솔루션', desc: '크리에이터별 고유 판매 링크 제공' },
      { title: '리워드 제휴', desc: '간편결제 리워드 서비스 제휴' },
      { title: '크로스 채널 연동', desc: 'SNS·유튜브 등 다양한 채널로의 확장' },
    ],
  },
];

interface PWAHomeProps {
  onMenuSelect?: (menu: string) => void;
  onBusinessAreaSelect?: (areaId: string) => void;
}

export default function PWAHome({ onMenuSelect, onBusinessAreaSelect }: PWAHomeProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleAreaClick = (areaId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setClickPosition({ x, y });
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedArea(areaId);
    }, 100);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSelectedArea(null);
    }, 300);
  };

  const selectedAreaData = businessAreas.find(a => a.id === selectedArea);

  return (
    <div className="min-h-full bg-white relative">
      {/* 히어로 영역 */}
      <section className="px-5 pt-6 pb-8 bg-white">
        {/* 데코 라인 */}
        <div className="w-10 h-1 bg-[#384155] mb-6" />
        
        {/* 메인 카피 */}
        <h1 className="text-[26px] font-light text-[#333] leading-tight mb-6 font-raleway">
          <span className="block">building commerce</span>
          <span className="block pl-4">growing commerce</span>
        </h1>
        
        {/* 서브 타이틀 */}
        <h2 className="text-[15px] font-bold text-[#333] mb-3">
          플랫폼, 콘텐츠, 마케팅을 연결하는<br />
          디지털 마케팅 전문 기업
        </h2>
        
        {/* 설명 */}
        <p className="text-[13px] text-[#666] leading-relaxed">
          (주)나인브릿지는 라이브커머스 기획 및 운영, 오픈마켓 관리, 쇼핑몰 운영, 
          상세페이지 제작 및 SNS 마케팅까지 아우르는 디지털 마케팅 전문 기업입니다.
        </p>
      </section>

      {/* 전체 사업 분야 - 스퀘어 그리드 */}
      <section className="grid grid-cols-2">
        {businessAreas.map((area) => (
          <button
            key={area.id}
            onClick={(e) => handleAreaClick(area.id, e)}
            className="aspect-square relative overflow-hidden group"
          >
            {/* 배경 이미지 */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ 
                backgroundImage: `url(${area.image})`,
              }}
            />
            
            {/* 기본 오버레이 */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* 호버 시 더 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* 텍스트 - 센터 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <h4 className="text-[18px] font-bold text-white mb-1">{area.title}</h4>
              <p className="text-[12px] text-white/80 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {area.description}
              </p>
            </div>
          </button>
        ))}
      </section>

      {/* 풀스크린 오버레이 */}
      {selectedArea && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: '#384155',
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
          
          {/* 콘텐츠 */}
          <div className={`px-8 text-center text-white transition-all duration-500 delay-200 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-[28px] font-bold mb-4">{selectedAreaData?.title}</h2>
            <p className="text-[14px] text-white/80 leading-relaxed mb-6">
              {selectedAreaData?.detail}
            </p>
            <button 
              onClick={() => {
                handleClose();
                onBusinessAreaSelect?.(selectedArea);
              }}
              className="px-6 py-3 bg-white text-[#333] text-[14px] font-medium rounded-[8px] hover:bg-white/90 transition-colors"
            >
              자세히 보기
            </button>
          </div>
        </div>
      )}

      {/* 대표 사업 분야 1: 라이브커머스 */}
      <section className="py-8">
        <div className="px-5 mb-4">
          {/* 플랫폼 로고 */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[13px] font-bold text-[#03c75a]">N 쇼핑 LIVE</span>
            <span className="text-[13px] font-bold text-[#ff0000]">▶ YouTube</span>
          </div>
          
          {/* 태그 */}
          <p className="text-[11px] text-[#999] mb-2">
            {mainServices[0].tags.join(' / ')}
          </p>
          
          <h3 className="text-[20px] font-bold text-[#333] mb-3">
            {mainServices[0].subtitle}
          </h3>
          
          <p className="text-[13px] text-[#666] leading-relaxed">
            {mainServices[0].description}
          </p>
        </div>
        
        {/* 이미지 슬라이드 */}
        <div className="relative">
          <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide pb-2">
            {[1, 2, 3, 4].map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[130px] h-[170px] bg-[#eee] rounded-[8px] overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-b from-[#e0e0e0] to-[#c0c0c0]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 대표 사업 분야 2: 디지털 마케팅 */}
      <section className="py-8 bg-[#384155] text-white">
        <div className="px-5">
          <p className="text-[12px] text-white/60 mb-2">
            브랜드와 소비자가 만나는 결정적 순간
          </p>
          
          <h3 className="text-[24px] font-bold mb-2">
            {mainServices[1].title}
          </h3>
          
          <p className="text-[13px] text-white/70 leading-relaxed mb-6">
            유입은 리워드로, 전환은 공동구매로<br />
            성과를 설계하는 디지털 마케팅
          </p>
          
          {/* 피처 리스트 */}
          <div className="space-y-4">
            {mainServices[1].features.map((feature, idx) => (
              <div key={idx}>
                <h4 className="text-[13px] font-bold text-white mb-0.5">
                  {feature.title}
                </h4>
                <p className="text-[12px] text-white/50">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 비주얼 그리드 */}
      <section className="grid grid-cols-2 gap-[1px] bg-[#eee]">
        {[
          { bg: 'from-[#2c3e50] to-[#1a252f]' },
          { bg: 'from-[#7f8c8d] to-[#95a5a6]' },
          { bg: 'from-[#bdc3c7] to-[#95a5a6]' },
          { 
            bg: 'from-[#384155] to-[#2d3545]', 
            overlay: true,
            label: 'Option 04',
            title: '디지털 마케팅',
            desc: 'SNS 플랫폼으로의 확장'
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="aspect-square relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.bg}`} />
            {item.overlay && (
              <div className="absolute inset-0 flex flex-col justify-center px-4">
                <span className="text-[10px] text-white/50 italic mb-1">{item.label}</span>
                <h4 className="text-[15px] font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[11px] text-white/70">{item.desc}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-5 py-8 text-center">
        <p className="text-[13px] text-[#666] mb-4 leading-relaxed">
          콘텐츠 제작부터 스토어 운영, 그리고 SNS 마케팅까지<br />
          이 모든 마케팅 여정의 중심에 <strong className="text-[#333]">나인브릿지</strong>가 있습니다
        </p>
        
        <button 
          onClick={() => onMenuSelect?.('contact')}
          className="px-6 py-3 bg-[#5b7cae] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#4a6b9d] transition-colors"
        >
          문의하기
        </button>
      </section>

      {/* 푸터 */}
      <PWAFooter />
    </div>
  );
}
