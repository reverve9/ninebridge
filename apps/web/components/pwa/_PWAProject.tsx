'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Project } from '@/lib/types';
import { getPublishedProjects } from '@/lib/projects';

interface PWAProjectProps {
  onProjectSelect?: (projectId: string) => void;
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
  contents: { label: '콘텐츠', bg: 'bg-[#eab308]/10', text: 'text-[#ca8a04]' },
  etc: { label: '기타', bg: 'bg-[#6b7280]/10', text: 'text-[#4b5563]' },
};

export default function PWAProject({ onProjectSelect }: PWAProjectProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getPublishedProjects();
      setProjects(data);
    } catch (error) {
      console.error('프로젝트 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별 개수
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return projects.length;
    return projects.filter(p => p.categories.includes(catId)).length;
  };

  // 현재 카테고리의 프로젝트
  const categoryProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.categories.includes(activeCategory));

  // 현재 카테고리에서 사용 가능한 태그 목록
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    categoryProjects.forEach(p => p.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [categoryProjects]);

  // 태그 필터 적용
  const filteredProjects = selectedTags.length === 0
    ? categoryProjects
    : categoryProjects.filter(p => selectedTags.some(tag => p.tags?.includes(tag)));

  // 카테고리 변경 시 태그 초기화
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setSelectedTags([]);
  };

  // 태그 토글
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div>
      <PageTitle title="PROJECT" subtitle="포트폴리오" />
      
      {/* 카테고리 탭 */}
      <div className="px-4 py-3">
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-[14px] rounded-[4px] transition-colors border
                  ${activeCategory === cat.id
                    ? 'bg-[#3071a5] text-white border-[#3071a5]'
                    : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#3071a5]'
                  }`}
              >
                {cat.label} <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 태그 필터 - 전체 탭이 아닐 때만 */}
      {activeCategory !== 'all' && availableTags.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-1.5 flex-wrap">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-2.5 py-1 text-[12px] rounded-full transition-colors
                  ${selectedTags.includes(tag)
                    ? 'bg-[#1f2937] text-white'
                    : 'bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]'
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 프로젝트 리스트 */}
      <div className="px-4 py-2 space-y-3">
        {loading ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">로딩 중...</p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">등록된 프로젝트가 없습니다.</p>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => project.has_detail && onProjectSelect?.(project.id)}
              className={`w-full bg-white rounded-[8px] border border-[#e5e7eb] overflow-hidden text-left transition-colors flex
                ${project.has_detail ? 'cursor-pointer hover:border-[#3071a5]' : 'cursor-default'}`}
            >
              {/* 썸네일 영역 */}
              <div className="w-[120px] h-[120px] flex items-center justify-center flex-shrink-0">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title} className="w-[100px] h-[100px] object-cover rounded-[0px]" />
                ) : (
                  <div className="w-[100px] h-[100px] bg-[#f3f4f6] rounded-[0px] flex items-center justify-center">
                    <span className="text-[#9ca3af] text-[12px]">이미지</span>
                  </div>
                )}
              </div>
              {/* 내용 */}
              <div className="py-3 pr-3 flex-1 min-w-0 flex flex-col justify-center">
                {/* 카테고리 배지 */}
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
                {/* 제목 */}
                <h3 className="text-[16px] font-bold text-[#1f2937] mt-0 truncate">{project.title}</h3>
                {/* 클라이언트 | 날짜 */}
                <p className="text-[12px] text-[#9ca3af] mt-0">
                  {project.client && <span>{project.client}</span>}
                  {project.client && project.date_start && <span> | </span>}
                  {project.date_start && (
                    <span>{project.date_start}{project.date_end && ` - ${project.date_end}`}</span>
                  )}
                </p>
                {/* 설명 */}
                {project.description && (
                  <p className="text-[15px] text-[#6b7280] mt-1 line-clamp-1">{project.description}</p>
                )}
                {/* 태그 */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-0 flex-wrap">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-[13px] text-[#6b7280]">
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[11px] text-[#9ca3af]">+{project.tags.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
