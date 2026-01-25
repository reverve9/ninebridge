'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Project } from '@/lib/types';
import { getPublishedProjects } from '@/lib/projects';
import { X } from 'lucide-react';

interface PWAProjectProps {
  onProjectSelect?: (projectId: string) => void;
  isPreview?: boolean;
  externalProjects?: Project[];
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

export default function PWAProject({ onProjectSelect, isPreview = false, externalProjects }: PWAProjectProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false);

  useEffect(() => {
    if (isPreview && externalProjects) {
      setProjects(externalProjects);
      setLoading(false);
    } else {
      loadProjects();
    }
  }, [isPreview, externalProjects]);

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

  // 유튜브 ID 추출
  const getYoutubeId = (url: string) => {
    return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1];
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

  // 프로젝트 클릭 핸들러
  const handleProjectClick = (project: Project) => {
    if (!project.has_detail) return;
    
    // 모바일 (768px 미만)에서는 모달, 웹에서는 우측 확장
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setModalProject(project);
      setIsYoutubePlaying(false);
    } else {
      onProjectSelect?.(project.id);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setModalProject(null);
    setIsYoutubePlaying(false);
  };

  // 대표 갤러리 아이템 가져오기
  const getMainGalleryItem = (project: Project) => {
    if (!project.gallery || project.gallery.length === 0) return null;
    return project.gallery.find(item => item.is_main) || project.gallery[0];
  };

  return (
    <div className="relative h-full">
      <PageTitle title="WORKS" subtitle="포트폴리오" />
      
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
              onClick={() => handleProjectClick(project)}
              className={`w-full bg-white rounded-[8px] border border-[#e5e7eb] overflow-hidden text-left transition-all flex
                ${project.has_detail ? 'cursor-pointer hover:bg-[#f0f0f0]' : 'cursor-default'}`}
            >
              {/* 썸네일 영역 */}
              <div className="w-[130px] h-[130px] flex items-center justify-center flex-shrink-0 self-center">
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

      {/* 모바일 상세 모달 */}
      {modalProject && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-5"
          onClick={closeModal}
        >
          <div 
            className="bg-white w-full max-h-[80vh] rounded-[16px] overflow-hidden flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between z-10">
              <h2 className="text-[16px] font-bold text-[#1f2937] truncate flex-1">{modalProject.title}</h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-[#f3f4f6] rounded-full ml-2"
              >
                <X size={22} className="text-[#6b7280]" />
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div className="flex-1 overflow-y-auto">
              {/* 메인 영상/이미지 */}
              {(() => {
                const mainItem = getMainGalleryItem(modalProject);
                const youtubeId = mainItem && (mainItem.type === 'hor' || mainItem.type === 'ver') 
                  ? getYoutubeId(mainItem.url) 
                  : null;

                if (mainItem) {
                  return (
                    <div className="w-full aspect-video bg-black relative">
                      {youtubeId ? (
                        isYoutubePlaying ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                            title={modalProject.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div 
                            className="relative w-full h-full cursor-pointer"
                            onClick={() => setIsYoutubePlaying(true)}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                              alt={modalProject.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        )
                      ) : mainItem.type === 'img' ? (
                        <img
                          src={mainItem.url}
                          alt={modalProject.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                  );
                } else if (modalProject.thumbnail) {
                  return (
                    <img
                      src={modalProject.thumbnail}
                      alt={modalProject.title}
                      className="w-full aspect-video object-cover"
                    />
                  );
                }
                return null;
              })()}

              {/* 정보 */}
              <div className="p-4 space-y-3">
                {/* Description */}
                {modalProject.description && (
                  <p className="text-[14px] text-[#374151]">
                    {modalProject.description}
                  </p>
                )}

                {/* PC에서 확인 안내 */}
                <div className="bg-[#f5f5f5] rounded-[8px] p-3 text-center">
                  <p className="text-[13px] text-[#6b7280]">
                    더 자세한 내용은 데스크탑 (width 1280px 이상)에서 확인하실 수 있습니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
