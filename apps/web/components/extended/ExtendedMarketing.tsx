'use client';

import React from 'react';
import { Play, Share2, Video, TrendingUp } from 'lucide-react';

export default function ExtendedMarketing() {
  const services = [
    {
      icon: <Play className="w-8 h-8" />,
      title: '라이브커머스',
      description: '네이버 쇼핑라이브, 유튜브 라이브 등 다양한 플랫폼에서 라이브커머스를 진행합니다. 기획부터 송출까지 통합 서비스.',
      highlight: true,
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: 'SNS 마케팅',
      description: '인스타그램, 유튜브, 블로그 등 SNS 채널 운영 및 콘텐츠 제작.',
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: '홍보영상 제작',
      description: '브랜드 영상, 광고 영상, 제품 홍보 영상 기획 및 제작.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '디지털 마케팅',
      description: '데이터 기반 성과 마케팅, DA광고, SNS 마케팅 전략 수립.',
    },
  ];

  const categories = ['푸드', '건강기능식품', '미용', '뷰티', '패션소품', '생활용품'];

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Marketing
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-1">마케팅</h1>
        <p className="text-gray-600 mt-2">
          나인커머스에서 쌓아온 마케팅 노하우.<br />
          소상공인과 중소기업을 위한 맞춤형 마케팅 솔루션을 제공합니다.
        </p>
      </div>

      {/* 라이브커머스 하이라이트 */}
      <div className="bg-gradient-to-br from-[#3071a5] to-[#4a90c2] rounded-2xl p-8 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-semibold animate-pulse">
            LIVE
          </span>
          <span className="text-lg font-medium">네이버 쇼핑라이브</span>
        </div>
        <h3 className="text-2xl font-bold mb-3">생생한 쇼핑! 라이브커머스</h3>
        <p className="opacity-90 leading-relaxed mb-6">
          우리나라 대표적인 라이브커머스 플랫폼인 '네이버 쇼핑라이브' 뿐만 아니라
          유튜브 라이브, 인스타그램 등의 SNS 마케팅 확장을 통해 단순한 방송 판매가 아닌
          브랜드를 설계하고 고객의 신뢰를 기반으로 하는 마케팅 구조를 만들어 드립니다.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">기획/연출</p>
            <p className="text-sm opacity-80 mt-1">프로젝트 기획 및 관리</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">촬영/기술</p>
            <p className="text-sm opacity-80 mt-1">스튜디오 및 장비 운영</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">홍보/성과</p>
            <p className="text-sm opacity-80 mt-1">DA광고 및 SNS 마케팅</p>
          </div>
        </div>
      </div>

      {/* 기타 서비스 */}
      <div className="space-y-4 mb-8">
        {services.filter(s => !s.highlight).map((service, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-14 h-14 bg-[#3071a5]/10 rounded-xl flex items-center justify-center text-[#3071a5] flex-shrink-0">
              {service.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 취급 카테고리 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">취급 카테고리</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-[#3071a5] hover:text-white transition-colors cursor-pointer"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
