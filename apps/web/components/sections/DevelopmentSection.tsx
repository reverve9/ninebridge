'use client';

import React from 'react';
import { Smartphone, Globe, Monitor, Settings } from 'lucide-react';

export default function DevelopmentSection() {
  const projects = [
    {
      title: '소개로드',
      description: '사용자-가맹점-소개자를 연결하는 순환형 앱',
      icon: <Smartphone className="w-8 h-8" />,
      tags: ['PWA', 'React', 'Supabase'],
      status: '운영중',
    },
    {
      title: '이브릿지',
      description: '선거 후보자와 유권자를 연결하는 소통 플랫폼',
      icon: <Globe className="w-8 h-8" />,
      tags: ['Next.js', 'PWA'],
      status: '개발중',
    },
    {
      title: '그룹웨어',
      description: '소규모 기업을 위한 사내 그룹웨어 커스텀 제작',
      icon: <Monitor className="w-8 h-8" />,
      tags: ['맞춤개발', 'B2B'],
      status: '수주가능',
    },
    {
      title: '어드민 시스템',
      description: '캠프 신청, 참가 등록, 수료증 발급 등 관리 기능',
      icon: <Settings className="w-8 h-8" />,
      tags: ['관리자페이지', '자동화'],
      status: '수주가능',
    },
  ];

  return (
    <section id="development" className="py-12 px-4 bg-white">
      {/* 섹션 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Development
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">개발</h2>
        <p className="text-gray-600 mt-2">
          웹, 앱, PWA 기획 및 제작
        </p>
      </div>

      {/* 프로젝트 카드 그리드 */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group p-5 bg-gray-50 rounded-2xl hover:bg-[#3071a5] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* 아이콘 */}
              <div className="p-3 bg-white rounded-xl text-[#3071a5] group-hover:bg-white/10 group-hover:text-white transition-colors">
                {project.icon}
              </div>
              
              {/* 내용 */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${project.status === '운영중' 
                      ? 'bg-green-100 text-green-700 group-hover:bg-green-500 group-hover:text-white' 
                      : project.status === '개발중'
                      ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-500 group-hover:text-white'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-white/20 group-hover:text-white'
                    } transition-colors`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 group-hover:text-white/80 transition-colors mb-3">
                  {project.description}
                </p>
                
                {/* 태그 */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-white/50 text-gray-600 rounded group-hover:bg-white/20 group-hover:text-white transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 문의 CTA */}
      <div className="mt-8 p-6 bg-gradient-to-r from-[#3071a5] to-[#4a90c2] rounded-2xl text-white text-center">
        <p className="text-lg font-semibold mb-2">개발 프로젝트 문의</p>
        <p className="text-sm opacity-80 mb-4">
          웹사이트, 앱, 관리자 페이지 등 맞춤 개발이 필요하신가요?
        </p>
        <button className="px-6 py-2 bg-white text-[#3071a5] rounded-full font-medium hover:bg-gray-100 transition-colors">
          상담 신청하기
        </button>
      </div>
    </section>
  );
}
