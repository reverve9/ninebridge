'use client';

import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

interface SidePanelProps {
  activeSection?: string;
}

export default function SidePanel({ activeSection = 'home' }: SidePanelProps) {
  const businessAreas = [
    { id: 'development', label: '개발', count: 4 },
    { id: 'event', label: '행사기획', count: 12 },
    { id: 'marketing', label: '마케팅', count: 8 },
    { id: 'media', label: '영상/사진', count: 20 },
  ];

  const sectionInfo: Record<string, { title: string; description: string }> = {
    home: {
      title: '연결을 디자인합니다',
      description: '웹/앱 개발부터 행사기획, 마케팅, 영상제작까지. 나인브릿지가 당신의 비즈니스를 연결합니다.',
    },
    development: {
      title: '개발',
      description: '웹, 앱, PWA 기획 및 제작. 소개로드, 이브릿지 등 연결 플랫폼을 만듭니다.',
    },
    event: {
      title: '행사기획',
      description: '축제, 공연, 이벤트, 세미나, 포럼. 기획부터 연출, 대행까지.',
    },
    marketing: {
      title: '마케팅',
      description: 'SNS 마케팅, 라이브커머스, 홍보영상 제작. 소상공인과 중소기업을 위한 마케팅 솔루션.',
    },
    media: {
      title: '영상/사진',
      description: '프로페셔널한 영상 제작과 사진 촬영 서비스.',
    },
  };

  const currentInfo = sectionInfo[activeSection] || sectionInfo['home']!;

  return (
    <div className="flex flex-col h-full gap-8">
      {/* 로고 영역 */}
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-wider text-gray-800">
          NIN<span className="text-[#3071a5]">E</span>
        </h1>
        <h1 className="text-4xl font-light tracking-wider text-gray-800">
          BRIDG<span className="text-[#3071a5]">E</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">주식회사 나인브릿지</p>
      </div>

      {/* 현재 섹션 정보 - 동적 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          {currentInfo.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {currentInfo.description}
        </p>
      </div>

      {/* 사업분야 네비게이션 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
          Business Areas
        </h3>
        <div className="space-y-2">
          {businessAreas.map((area) => (
            <a
              key={area.id}
              href={`#${area.id}`}
              className={`flex items-center justify-between p-3 rounded-xl transition-all
                ${activeSection === area.id 
                  ? 'bg-[#3071a5] text-white' 
                  : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
              <span className="font-medium">{area.label}</span>
              <span className={`text-sm px-2 py-1 rounded-full
                ${activeSection === area.id 
                  ? 'bg-white/20' 
                  : 'bg-gray-100'
                }`}>
                {area.count}건
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 문의 버튼들 */}
      <div className="space-y-3">
        <a
          href="mailto:rev_nine@naver.com"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#3071a5] text-white rounded-xl hover:bg-[#265d8a] transition-colors"
        >
          <Mail size={18} />
          <span>이메일 문의</span>
        </a>
        <a
          href="tel:033-823-0133"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-[#3071a5] text-[#3071a5] rounded-xl hover:bg-[#3071a5] hover:text-white transition-colors"
        >
          <Phone size={18} />
          <span>033-823-0133</span>
        </a>
        <a
          href="#"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-yellow-400 text-yellow-900 rounded-xl hover:bg-yellow-500 transition-colors"
        >
          <MessageCircle size={18} />
          <span>카카오톡 문의</span>
        </a>
      </div>

      {/* 회사 정보 */}
      <div className="text-sm text-gray-500 space-y-1 mt-auto">
        <p>강원특별자치도 강릉시 하슬라로206번길 23-13</p>
        <p>사업자등록번호: 502-86-43421</p>
        <p className="pt-2 text-xs">© 2025 Nine Bridge Co., Ltd.</p>
      </div>
    </div>
  );
}
