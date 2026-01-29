'use client';

import React from 'react';
import { Play, TrendingUp, Share2, Video } from 'lucide-react';

export default function MarketingSection() {
  const services = [
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'SNS 마케팅',
      description: '인스타그램, 유튜브, 블로그 운영',
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: '홍보영상 제작',
      description: '브랜드 영상, 광고 영상 제작',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: '디지털 마케팅',
      description: '데이터 기반 성과 마케팅',
    },
  ];

  return (
    <section id="marketing" className="py-12 px-4 bg-white">
      {/* 섹션 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Marketing
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">마케팅</h2>
        <p className="text-gray-600 mt-2">
          SNS 마케팅, 라이브커머스, 홍보영상 제작
        </p>
      </div>

      {/* 라이브커머스 하이라이트 */}
      <div className="bg-gradient-to-br from-[#3071a5] to-[#4a90c2] rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-red-500 rounded text-xs font-semibold animate-pulse">
            LIVE
          </span>
          <span className="text-sm opacity-80">네이버 쇼핑라이브</span>
        </div>
        <h3 className="text-xl font-bold mb-2">생생한 쇼핑! 라이브커머스</h3>
        <p className="text-sm opacity-90 leading-relaxed mb-4">
          기획부터 송출까지 통합 서비스 제공.<br />
          브랜드를 설계하고 고객의 신뢰를 기반으로 하는 마케팅 구조를 만들어 드립니다.
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs px-3 py-1 bg-white/20 rounded-full">기획/연출</span>
          <span className="text-xs px-3 py-1 bg-white/20 rounded-full">촬영/기술지원</span>
          <span className="text-xs px-3 py-1 bg-white/20 rounded-full">홍보/성과</span>
        </div>
      </div>

      {/* 서비스 목록 */}
      <div className="space-y-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-[#3071a5]/10 rounded-xl flex items-center justify-center text-[#3071a5]">
              {service.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{service.title}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 취급 카테고리 */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">취급 카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {['푸드', '건강기능식품', '미용', '뷰티', '패션소품', '생활용품'].map((category) => (
            <span
              key={category}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-[#3071a5] hover:text-white transition-colors cursor-pointer"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
