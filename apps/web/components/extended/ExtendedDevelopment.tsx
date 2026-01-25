'use client';

import React from 'react';
import { ExternalLink, Smartphone, Globe, Monitor, Settings } from 'lucide-react';

export default function ExtendedDevelopment() {
  const projects = [
    {
      title: '소개로드',
      description: '사용자-가맹점-소개자를 연결하는 순환형 리워드 플랫폼. 쿠폰 발급, 할인, 소개 포인트 지급 등의 기능을 제공합니다.',
      icon: <Smartphone className="w-8 h-8" />,
      tags: ['PWA', 'React', 'Supabase', 'Vercel'],
      status: '운영중',
      statusColor: 'bg-green-500',
      image: '/portfolio/sogaeroad.png',
    },
    {
      title: '이브릿지',
      description: '6월 9대 지방선거 후보자와 유권자를 연결하는 소통 플랫폼. 후보자의 정책 및 프로필을 제공하고 양방향 소통을 지원합니다.',
      icon: <Globe className="w-8 h-8" />,
      tags: ['Next.js', 'PWA', 'Supabase'],
      status: '개발중',
      statusColor: 'bg-blue-500',
      image: '/portfolio/ebridge.png',
    },
    {
      title: '그룹웨어 솔루션',
      description: '소규모 기업을 위한 사내 그룹웨어 커스텀 제작. 일정관리, 결재시스템, 사내 메신저 등 필요한 기능만 선택하여 구축합니다.',
      icon: <Monitor className="w-8 h-8" />,
      tags: ['맞춤개발', 'B2B', 'SaaS'],
      status: '수주가능',
      statusColor: 'bg-gray-400',
      image: null,
    },
    {
      title: '어드민 시스템',
      description: '캠프 신청, 참가 등록, 수료증 발급 등 즉각적인 관리가 필요한 웹사이트를 위한 관리자 페이지 개발.',
      icon: <Settings className="w-8 h-8" />,
      tags: ['관리자페이지', '자동화', 'Dashboard'],
      status: '수주가능',
      statusColor: 'bg-gray-400',
      image: null,
    },
  ];

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Development
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-1">개발</h1>
        <p className="text-gray-600 mt-2">
          웹, 앱, PWA 기획부터 제작, 배포까지 전 과정을 담당합니다.<br />
          "브릿지"라는 이름처럼, 사람과 사람을 연결하는 플랫폼을 만듭니다.
        </p>
      </div>

      {/* 프로젝트 목록 */}
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* 아이콘 또는 이미지 */}
              <div className="w-16 h-16 bg-[#3071a5]/10 rounded-xl flex items-center justify-center text-[#3071a5] flex-shrink-0">
                {project.icon}
              </div>
              
              {/* 내용 */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
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
      <div className="mt-8 bg-gradient-to-r from-[#3071a5] to-[#4a90c2] rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-2">개발 프로젝트 문의</h3>
        <p className="opacity-90 mb-4">
          웹사이트, 앱, 관리자 페이지 등 맞춤 개발이 필요하신가요?<br />
          아이디어만 있으면 됩니다. 기획부터 배포까지 함께합니다.
        </p>
        <button className="px-6 py-3 bg-white text-[#3071a5] rounded-xl font-semibold hover:bg-gray-100 transition-colors">
          상담 신청하기
        </button>
      </div>
    </div>
  );
}
