'use client';

import React from 'react';
import { Calendar, Mic, Users, Award } from 'lucide-react';

export default function EventSection() {
  const services = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: '축제 기획',
      description: '지역축제, 문화행사 기획 및 연출',
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: '공연 기획',
      description: '콘서트, 공연, 페스티벌 기획',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '세미나/포럼',
      description: '기업 세미나, 컨퍼런스, 포럼 대행',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: '이벤트 대행',
      description: '프로모션, 론칭쇼, 기업행사',
    },
  ];

  const portfolioItems = [
    { title: '2024 강릉 페스티벌' },
    { title: '기업 세미나' },
    { title: '지역 축제' },
  ];

  return (
    <section id="event" className="py-12 px-4 bg-gray-50">
      {/* 섹션 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Event Planning
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">행사기획</h2>
        <p className="text-gray-600 mt-2">
          축제, 공연, 이벤트, 세미나, 포럼
        </p>
      </div>

      {/* 서비스 그리드 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-[#3071a5]/10 rounded-lg flex items-center justify-center text-[#3071a5] mb-3">
              {service.icon}
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              {service.title}
            </h3>
            <p className="text-xs text-gray-500">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* 포트폴리오 미리보기 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">최근 진행 행사</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 h-28 bg-gray-300 rounded-xl overflow-hidden relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 실적 */}
      <div className="bg-white rounded-2xl p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#3071a5]">150+</p>
            <p className="text-xs text-gray-500 mt-1">진행 행사</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#3071a5]">10년+</p>
            <p className="text-xs text-gray-500 mt-1">업력</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#3071a5]">50+</p>
            <p className="text-xs text-gray-500 mt-1">파트너사</p>
          </div>
        </div>
      </div>
    </section>
  );
}
