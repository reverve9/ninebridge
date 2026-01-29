'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[500px] flex flex-col justify-center items-center bg-gradient-to-br from-[#3071a5] to-[#1e4d6b] text-white px-6 py-12">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white rounded-full" />
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center">
        <p className="text-sm tracking-widest uppercase mb-4 opacity-80">
          Connect Everything
        </p>
        
        <h1 className="text-3xl font-bold mb-6 leading-tight">
          연결을<br />
          디자인합니다
        </h1>
        
        <p className="text-base opacity-90 max-w-md mx-auto leading-relaxed">
          웹/앱 개발, 행사기획, 마케팅, 영상제작<br />
          나인브릿지가 당신의 비즈니스를 연결합니다
        </p>

        {/* 사업분야 태그 */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {['개발', '행사기획', '마케팅', '영상/사진'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 스크롤 유도 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown size={24} className="opacity-60" />
      </div>
    </section>
  );
}
