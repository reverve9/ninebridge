'use client';

import React from 'react';
import { Camera, Film, Image, PlayCircle } from 'lucide-react';

export default function MediaSection() {
  const services = [
    { icon: <Film className="w-5 h-5" />, title: '홍보영상' },
    { icon: <Camera className="w-5 h-5" />, title: '제품촬영' },
    { icon: <PlayCircle className="w-5 h-5" />, title: '인터뷰영상' },
    { icon: <Image className="w-5 h-5" />, title: '행사촬영' },
  ];

  const portfolioItems = [
    { type: 'video', title: '브랜드 영상' },
    { type: 'photo', title: '제품 촬영' },
    { type: 'video', title: '라이브커머스' },
    { type: 'photo', title: '행사 촬영' },
    { type: 'video', title: '홍보 영상' },
    { type: 'photo', title: '프로필 촬영' },
  ];

  return (
    <section id="media" className="py-12 px-4 bg-gray-50">
      {/* 섹션 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Media Production
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">영상/사진</h2>
        <p className="text-gray-600 mt-2">
          프로페셔널한 영상 제작과 사진 촬영
        </p>
      </div>

      {/* 서비스 태그 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm"
          >
            <span className="text-[#3071a5]">{service.icon}</span>
            <span className="text-sm font-medium text-gray-700">{service.title}</span>
          </div>
        ))}
      </div>

      {/* 포트폴리오 그리드 */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {portfolioItems.map((item, index) => (
          <div
            key={index}
            className={`relative bg-gray-300 rounded-xl overflow-hidden cursor-pointer group
              ${index === 0 ? 'col-span-2 h-40' : 'h-32'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {item.type === 'video' && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                <PlayCircle className="w-4 h-4 text-[#3071a5]" />
              </div>
            )}
            
            <span className="absolute bottom-2 left-2 text-white text-sm font-medium">
              {item.title}
            </span>
            
            <div className="absolute inset-0 bg-[#3071a5]/0 group-hover:bg-[#3071a5]/40 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                자세히 보기
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <button className="w-full py-3 border-2 border-[#3071a5] text-[#3071a5] rounded-xl font-medium hover:bg-[#3071a5] hover:text-white transition-colors">
        포트폴리오 더보기
      </button>
    </section>
  );
}
