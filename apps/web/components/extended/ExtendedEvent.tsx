'use client';

import React from 'react';
import { Calendar, Mic, Users, Award } from 'lucide-react';

export default function ExtendedEvent() {
  const services = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: '축제 기획',
      description: '지역축제, 문화행사 기획 및 연출. 컨셉 기획부터 현장 운영까지 토탈 솔루션을 제공합니다.',
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: '공연 기획',
      description: '콘서트, 공연, 페스티벌 기획. 아티스트 섭외, 무대 연출, 음향/조명까지.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '세미나/포럼',
      description: '기업 세미나, 컨퍼런스, 포럼 대행. 장소 섭외, 진행, 참가자 관리 등.',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: '이벤트 대행',
      description: '프로모션, 론칭쇼, 기업행사. 브랜드에 맞는 맞춤형 이벤트 기획.',
    },
  ];

  const stats = [
    { number: '150+', label: '진행 행사' },
    { number: '10년+', label: '업력' },
    { number: '50+', label: '파트너사' },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Event Planning
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-1">행사기획</h1>
        <p className="text-gray-600 mt-2">
          리버브나인에서 시작된 10년 이상의 행사기획 노하우.<br />
          축제, 공연, 이벤트, 세미나, 포럼까지 모든 행사를 기획하고 운영합니다.
        </p>
      </div>

      {/* 실적 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-3xl font-bold text-[#3071a5]">{stat.number}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 서비스 목록 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-14 h-14 bg-[#3071a5]/10 rounded-xl flex items-center justify-center text-[#3071a5] mb-4">
              {service.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>

      {/* 포트폴리오 미리보기 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 진행 행사</h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
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
