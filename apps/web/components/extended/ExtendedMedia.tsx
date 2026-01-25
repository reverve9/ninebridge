'use client';

import React from 'react';
import { Film, Camera, PlayCircle, Image } from 'lucide-react';

export default function ExtendedMedia() {
  const services = [
    { icon: <Film className="w-6 h-6" />, title: '홍보영상', description: '브랜드, 기업, 제품 홍보 영상' },
    { icon: <Camera className="w-6 h-6" />, title: '제품촬영', description: '상세페이지, 카탈로그용 촬영' },
    { icon: <PlayCircle className="w-6 h-6" />, title: '인터뷰영상', description: '인물 인터뷰, 다큐멘터리' },
    { icon: <Image className="w-6 h-6" />, title: '행사촬영', description: '행사, 이벤트 현장 기록' },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Media Production
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-1">영상/사진</h1>
        <p className="text-gray-600 mt-2">
          프로페셔널한 영상 제작과 사진 촬영 서비스.<br />
          행사기획, 마케팅과 연계된 종합 미디어 솔루션을 제공합니다.
        </p>
      </div>

      {/* 서비스 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="w-12 h-12 bg-[#3071a5]/10 rounded-xl flex items-center justify-center text-[#3071a5] mb-3">
              {service.icon}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{service.title}</h3>
            <p className="text-sm text-gray-500">{service.description}</p>
          </div>
        ))}
      </div>

      {/* 포트폴리오 그리드 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">포트폴리오</h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <div 
              key={item} 
              className={`bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer
                ${item === 1 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {item % 2 === 0 && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-[#3071a5]" />
                </div>
              )}
              <div className="absolute inset-0 bg-[#3071a5]/0 group-hover:bg-[#3071a5]/40 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  자세히 보기
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3 border-2 border-[#3071a5] text-[#3071a5] rounded-xl font-medium hover:bg-[#3071a5] hover:text-white transition-colors">
          포트폴리오 더보기
        </button>
      </div>
    </div>
  );
}
