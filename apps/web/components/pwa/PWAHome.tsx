'use client';

import React from 'react';
import { Code, Calendar, Megaphone, Camera, ChevronRight } from 'lucide-react';

interface PWAHomeProps {
  onMenuSelect?: (menu: string) => void;
}

export default function PWAHome({ onMenuSelect }: PWAHomeProps) {
  const menuItems = [
    {
      id: 'development',
      icon: <Code className="w-6 h-6" />,
      title: '개발',
      description: '웹, 앱, PWA 기획 및 제작',
      color: '#3071a5',
      bgColor: '#f0f7fb',
    },
    {
      id: 'event',
      icon: <Calendar className="w-6 h-6" />,
      title: '행사기획',
      description: '축제, 공연, 이벤트, 세미나',
      color: '#e67e22',
      bgColor: '#fef5e7',
    },
    {
      id: 'marketing',
      icon: <Megaphone className="w-6 h-6" />,
      title: '마케팅',
      description: 'SNS, 라이브커머스, 홍보영상',
      color: '#27ae60',
      bgColor: '#e8f8f0',
    },
    {
      id: 'media',
      icon: <Camera className="w-6 h-6" />,
      title: '영상/사진',
      description: '촬영 및 제작 서비스',
      color: '#9b59b6',
      bgColor: '#f5eef8',
    },
  ];

  return (
    <div className="px-4 py-6 animate-fade-in">
      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-br from-[#3071a5] to-[#1e4d6b] rounded-2xl p-6 text-white mb-6">
        <p className="text-xs tracking-widest uppercase mb-3 opacity-70">
          Connect Everything
        </p>
        <h1 className="font-score text-2xl font-extrabold mb-2 leading-tight">
          연결을 디자인합니다
        </h1>
        <p className="text-sm opacity-90 leading-relaxed">
          웹/앱 개발, 행사기획, 마케팅, 영상제작<br />
          나인브릿지가 당신의 비즈니스를 연결합니다
        </p>
      </div>

      {/* 메뉴 리스트 */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
          Business Areas
        </h2>
        
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onMenuSelect?.(item.id)}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-all text-left border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: item.bgColor, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 mb-0.5">{item.title}</h3>
              <p className="text-sm text-gray-500 truncate">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* 회사 정보 */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="font-score font-extrabold text-gray-800 mb-2">
            주식회사 나인브릿지
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            강원특별자치도 강릉시 하슬라로206번길 23-13<br />
            033-823-0133 | rev_nine@naver.com
          </p>
        </div>
      </div>
    </div>
  );
}
