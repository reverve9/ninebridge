'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { TabButton, TagButton } from '@/components/common/Button';
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

export default function PWAProject({ onProjectSelect, isPreview = false, externalProjects }: PWAProjectProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (isPreview && externalProjects) {
      setProjects(externalProjects);
      setLoading(false);
    } else {
      loadProjects();
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isPreview, externalProjects]);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

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
    
    if (isMobile) {
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
      <PageTitle title="WORX" subtitle="포트폴리오" />
      
      {/* 카테고리 탭 */}
      <div className="px-4 py-3">
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <TabButton
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label} <span className="opacity-70">{count}</span>
              </TabButton>
            );
          })}
        </div>
      </div>

      {/* 태그 필터 - 전체 탭이 아닐 때만 */}
      {activeCategory !== 'all' && availableTags.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-1.5 flex-wrap">
            {availableTags.map((tag) => (
              <TagButton
                key={tag}
                active={selectedTags.includes(tag)}
                onClick={() => handleTagToggle(tag)}
              >
                #{tag}
              </TagButton>
            ))}
          </div>
        </div>
      )}
      
      {/* 프로젝트 그리드 - 3열 */}
      <div className="px-3 py-2 pb-28">
        {loading ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">로딩 중...</p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {filteredProjects.map((project) => {
              const isHovered = hoveredId === project.id;
              
              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative aspect-square overflow-hidden
                    ${project.has_detail ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* 썸네일 이미지 */}
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f3f4f6] flex items-center justify-center">
                      <span className="text-[#9ca3af] text-[11px]">이미지</span>
                    </div>
                  )}
                  
                  {/* 오버레이 - 데스크탑 호버시만 */}
                  {!isMobile && (
                    <div 
                      className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300
                        ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                      {/* 하단 그라데이션 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* 텍스트 */}
                      <div className="relative p-3">
                        <h3 className="text-[14px] font-bold text-white leading-tight truncate">
                          {project.title}
                        </h3>
                        {project.client && (
                          <p className="text-[12px] text-white/70 mt-0.5 truncate">
                            {project.client}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
                {/* 클라이언트 | 날짜 */}
                {(modalProject.client || modalProject.date_start) && (
                  <p className="text-[13px] text-[#6b7280]">
                    {modalProject.client && <span>{modalProject.client}</span>}
                    {modalProject.client && modalProject.date_start && <span> · </span>}
                    {modalProject.date_start && (
                      <span>{modalProject.date_start}{modalProject.date_end && ` - ${modalProject.date_end}`}</span>
                    )}
                  </p>
                )}

                {/* Description */}
                {modalProject.description && (
                  <p className="text-[14px] text-[#374151]">
                    {modalProject.description}
                  </p>
                )}

                {/* 태그 */}
                {modalProject.tags && modalProject.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {modalProject.tags.map((tag) => (
                      <span key={tag} className="text-[13px] text-[#6b7280]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* PC에서 확인 안내 */}
                <div className="bg-[#f5f5f5] rounded-[8px] p-3 text-center">
                  <p className="text-[13px] text-[#6b7280]">
                    더 자세한 내용은 데스크탑에서 확인하실 수 있습니다
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
