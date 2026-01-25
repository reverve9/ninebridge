'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { X } from 'lucide-react';
import PageTitle from '@/components/common/PageTitle';

interface PWAPreviewProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
}

const categories = [
  { id: 'all', label: '전체' },
  { id: 'platform', label: '플랫폼' },
  { id: 'marketing', label: '마케팅' },
  { id: 'contents', label: '콘텐츠' },
  { id: 'etc', label: '기타' },
];

const categoryBadgeMap: Record<string, { label: string; bg: string; text: string }> = {
  platform: { label: '플랫폼', bg: 'bg-[#3071a5]/10', text: 'text-[#3071a5]' },
  marketing: { label: '마케팅', bg: 'bg-[#ef4444]/10', text: 'text-[#dc2626]' },
  contents: { label: '콘텐츠', bg: 'bg-[#f59e0b]/10', text: 'text-[#d97706]' },
  etc: { label: '기타', bg: 'bg-[#6b7280]/10', text: 'text-[#4b5563]' },
};

export default function PWAPreview({ projects, selectedProject, onSelectProject }: PWAPreviewProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const publishedProjects = projects.filter(p => p.is_published);
  
  const filteredProjects = activeCategory === 'all'
    ? publishedProjects
    : publishedProjects.filter(p => p.categories.includes(activeCategory));

  const handleProjectClick = (project: Project) => {
    onSelectProject(project);
    setShowModal(true);
  };

  const formatDate = (start: string | null, end: string | null) => {
    if (!start) return '';
    if (!end) return start;
    return `${start} - ${end}`;
  };

  return (
    <div className="relative h-full">
      {/* PWA 헤더 */}
      <div className="bg-[#3071a5] text-white px-4 h-[80px] flex flex-col justify-center">
        <span className="text-[18px] font-bold tracking-tight">NINE BRIDGE</span>
        <span className="text-[11px] opacity-70">나인브릿지는 모두의 내일을 연결합니다</span>
      </div>

      {/* 페이지 타이틀 */}
      <PageTitle title="PROJECT" subtitle="포트폴리오" />

      {/* 탭 */}
      <div className="px-4 py-3">
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-[14px] rounded-[4px] transition-colors border
                ${activeCategory === cat.id
                  ? 'bg-[#3071a5] text-white border-[#3071a5]'
                  : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#3071a5]'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 프로젝트 리스트 */}
      <div className="px-4 py-2 space-y-3">
        {filteredProjects.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] text-center py-8">
            공개된 프로젝트가 없습니다.
          </p>
        ) : (
          filteredProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className={`w-full bg-white rounded-[8px] border overflow-hidden text-left transition-colors flex items-center
                ${selectedProject?.id === project.id ? 'border-[#3071a5]' : 'border-[#e5e7eb] hover:border-[#3071a5]'}`}
            >
              {/* 썸네일 영역 */}
              <div className="w-[120px] h-[120px] flex items-center justify-center flex-shrink-0">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title} className="w-[110px] h-[110px] object-cover rounded-[4px]" />
                ) : (
                  <div className="w-[110px] h-[110px] bg-[#f3f4f6] rounded-[4px] flex items-center justify-center">
                    <span className="text-[#9ca3af] text-[12px]">이미지</span>
                  </div>
                )}
              </div>
              {/* 내용 */}
              <div className="p-3 flex-1 min-w-0">
                {/* 1행: 배지 */}
                <div className="flex items-center gap-1">
                  {project.categories.map((cat) => {
                    const badge = categoryBadgeMap[cat] || { label: cat, bg: 'bg-[#6b7280]/10', text: 'text-[#4b5563]' };
                    return (
                      <span key={cat} className={`text-[11px] font-medium px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    );
                  })}
                </div>
                {/* 2행: 제목 */}
                <h3 className="text-[16px] font-semibold text-[#1f2937] mt-1 truncate">{project.title}</h3>
                {/* 3행: 클라이언트 | 날짜 */}
                <p className="text-[12px] text-[#9ca3af] mt-0.5">
                  {project.client && <span>{project.client}</span>}
                  {project.client && project.date_start && <span> | </span>}
                  {project.date_start && (
                    <span>{project.date_start}{project.date_end && ` - ${project.date_end}`}</span>
                  )}
                </p>
                {/* 4행: 설명 */}
                {project.description && (
                  <p className="text-[13px] text-[#6b7280] mt-1 line-clamp-1">{project.description}</p>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* 모달 미리보기 */}
      {showModal && selectedProject && (
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="bg-white w-full rounded-t-[20px] max-h-[80%] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#1f2937]">{selectedProject.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-[#f3f4f6] rounded-full"
              >
                <X size={20} className="text-[#6b7280]" />
              </button>
            </div>
            <div className="p-4">
              {/* 썸네일 */}
              {selectedProject.thumbnail && (
                <img 
                  src={selectedProject.thumbnail} 
                  alt={selectedProject.title} 
                  className="w-full h-[200px] object-cover rounded-[8px] mb-4"
                />
              )}
              
              {/* 정보 */}
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {selectedProject.categories.map((cat) => {
                    const badge = categoryBadgeMap[cat] || { label: cat, bg: 'bg-[#6b7280]/10', text: 'text-[#4b5563]' };
                    return (
                      <span key={cat} className={`text-[12px] font-medium px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    );
                  })}
                </div>
                
                {selectedProject.client && (
                  <p className="text-[14px] text-[#6b7280]">
                    <span className="font-medium">클라이언트:</span> {selectedProject.client}
                  </p>
                )}
                
                {selectedProject.date_start && (
                  <p className="text-[14px] text-[#6b7280]">
                    <span className="font-medium">날짜:</span> {formatDate(selectedProject.date_start, selectedProject.date_end)}
                  </p>
                )}
                
                {selectedProject.content && (
                  <p className="text-[14px] text-[#374151] leading-relaxed whitespace-pre-wrap">
                    {selectedProject.content}
                  </p>
                )}
                
                {/* 갤러리 */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {selectedProject.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`갤러리 ${idx + 1}`} className="w-full h-[100px] object-cover rounded-[8px]" />
                    ))}
                  </div>
                )}
                
                {selectedProject.link && (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-[#3071a5] text-white text-[14px] rounded-[8px]"
                  >
                    바로가기
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
