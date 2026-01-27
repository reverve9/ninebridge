'use client';

import React, { useState, useEffect } from 'react';
import { Project, GalleryItem } from '@/lib/types';
import { getPublishedProjects } from '@/lib/projects';
import { ProjectBadge, PROJECT_CATEGORY_MAP } from '@/components/common/Badge';

interface ExtendedProjectProps {
  selectedProjectId?: string | null;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  platform: { bg: 'bg-[#384155]', text: 'text-white' },
  marketing: { bg: 'bg-[#b87a5a]', text: 'text-white' },
  contents: { bg: 'bg-[#5b7cae]', text: 'text-white' },
  etc: { bg: 'bg-[#7c8a96]', text: 'text-white' },
};

const categoryLabels: Record<string, string> = {
  platform: '플랫폼',
  marketing: '마케팅',
  contents: '콘텐츠',
  etc: '기타',
};

// Featured 슬라이더 컴포넌트
interface FeaturedSliderProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  getYoutubeId: (url: string) => string | undefined;
}

function FeaturedSlider({ projects, onProjectClick, getYoutubeId }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 10초 자동 슬라이드 (무한루프, 한 방향)
  useEffect(() => {
    if (projects.length <= 1) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(timer);
  }, [projects.length, currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    // 마지막 복제 슬라이드에서 첫번째로 점프 (애니메이션 없이)
    if (currentIndex >= projects.length) {
      setCurrentIndex(0);
    }
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
  };

  // 무한루프를 위해 첫번째 슬라이드를 끝에 복제
  const slidesWithClone = projects.length > 0 ? [...projects, projects[0]] : [];

  if (projects.length === 0) return null;

  return (
    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4">
      {/* 슬라이드 래퍼 */}
      <div className="overflow-hidden">
        {/* 슬라이드 컨테이너 */}
        <div 
          className={`flex ${isTransitioning || currentIndex < projects.length ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slidesWithClone.map((project, idx) => {
            if (!project) return null;
            // 메인 썸네일 가져오기
            const mainItem = project.gallery?.find(item => item.is_main) || project.gallery?.[0];
            const mainThumbnail = mainItem 
              ? (mainItem.type === 'hor' || mainItem.type === 'ver')
                ? `https://img.youtube.com/vi/${getYoutubeId(mainItem.url)}/maxresdefault.jpg`
                : mainItem.url
              : project.thumbnail;
            const youtubeId = mainItem && (mainItem.type === 'hor' || mainItem.type === 'ver') 
              ? getYoutubeId(mainItem.url) 
              : null;

            // 갤러리 썸네일들 (메인 제외, 최대 6개)
            const galleryThumbnails = (project.gallery || [])
              .filter(item => !item.is_main)
              .slice(0, 6)
              .map(item => {
                if (item.type === 'hor' || item.type === 'ver') {
                  const ytId = getYoutubeId(item.url);
                  return ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
                }
                return item.url;
              })
              .filter(Boolean);

            return (
              <div 
                key={`${project.id}-${idx}`}
                className="flex cursor-pointer flex-shrink-0 w-full"
                onClick={() => onProjectClick(project)}
              >
                {/* 좌측 2/3: 메인 썸네일 */}
              <div className="w-2/3 relative">
                <div className="aspect-video overflow-hidden rounded-[8px] bg-[#f3f4f6]">
                  {mainThumbnail ? (
                    <img
                      src={mainThumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (youtubeId) {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-[14px]">
                      이미지
                    </div>
                  )}
                  {/* 유튜브 재생 아이콘 */}
                  {youtubeId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {/* 카테고리 배지 */}
                  <div className="absolute top-3 left-3 flex gap-1">
                    {project.categories.map((cat) => (
                      <ProjectBadge key={cat} category={cat} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측 1/3: 정보 + 갤러리 썸네일 */}
              <div className="w-1/3 pl-4 flex flex-col">
                {/* 타이틀 */}
                <h3 className="text-[18px] font-bold text-[#1f2937] mb-1 line-clamp-2">{project.title}</h3>
                
                {/* 클라이언트 | 날짜 */}
                <p className="text-[13px] text-[#9ca3af] mb-3">
                  {project.client && <span>{project.client}</span>}
                  {project.client && project.date_start && <span> | </span>}
                  {project.date_start && <span>{project.date_start}</span>}
                </p>

                {/* 갤러리 썸네일 그리드 */}
                {galleryThumbnails.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 mt-auto">
                    {galleryThumbnails.map((thumb, thumbIdx) => (
                      <div key={thumbIdx} className="aspect-square rounded-[4px] overflow-hidden bg-[#f3f4f6]">
                        <img
                          src={thumb as string}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Dot Indicator */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-[#384155] w-4' 
                  : 'bg-[#d1d5db] hover:bg-[#9ca3af]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExtendedProject({ selectedProjectId }: ExtendedProjectProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isHoveringMain, setIsHoveringMain] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === selectedProjectId);
      setSelectedProject(project || null);
    } else {
      setSelectedProject(null);
    }
  }, [selectedProjectId, projects]);

  // 프로젝트 변경 시 상태 초기화
  useEffect(() => {
    setIsYoutubePlaying(false);
    if (selectedProject?.gallery) {
      const mainIndex = selectedProject.gallery.findIndex(item => item.is_main);
      setCurrentGalleryIndex(mainIndex >= 0 ? mainIndex : 0);
    } else {
      setCurrentGalleryIndex(0);
    }
  }, [selectedProject]);

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

  // 갤러리에서 메인 이미지/영상 URL 가져오기
  const getGalleryThumbnail = (project: Project) => {
    const mainItem = project.gallery?.find(item => item.is_main) || project.gallery?.[0];
    if (!mainItem) return project.thumbnail;
    
    if (mainItem.type === 'hor' || mainItem.type === 'ver') {
      const youtubeId = getYoutubeId(mainItem.url);
      return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : project.thumbnail;
    }
    
    return mainItem.url || project.thumbnail;
  };

  // 대표 프로젝트
  const featuredProjects = projects.filter(p => p.is_featured);

  // 년도별 그룹핑 (최신순)
  const projectsByYear = projects.reduce((acc, project) => {
    const year = project.date_start?.split('/')[0] || '기타';
    if (!acc[year]) acc[year] = [];
    acc[year].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const sortedYears = Object.keys(projectsByYear).sort((a, b) => {
    if (a === '기타') return 1;
    if (b === '기타') return -1;
    return Number(b) - Number(a);
  });

  // 썸네일 그리드 컴포넌트
  const ThumbnailGrid = ({ items }: { items: Project[] }) => (
    <div className="grid grid-cols-6 gap-2">
      {items.map((project) => {
        const mainCategory = project.categories[0] || 'etc';
        const color = categoryColors[mainCategory] ?? categoryColors.etc;
        return (
          <div
            key={project.id}
            onClick={() => project.has_detail && setSelectedProject(project)}
            className={`relative aspect-square overflow-hidden rounded-[6px] group
              ${project.has_detail ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                className={`w-full h-full object-cover transition-transform
                  ${project.has_detail ? 'group-hover:scale-105' : ''}`}
              />
            ) : (
              <div className="w-full h-full bg-[#e5e7eb] flex items-center justify-center text-[#9ca3af] text-[11px]">
                이미지
              </div>
            )}
            
            <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded ${color?.bg || 'bg-[#7c8a96]'} ${color?.text || 'text-white'}`}>
              {categoryLabels[mainCategory] || mainCategory}
            </span>

            {project.has_detail && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                <p className="text-white text-[12px] font-medium text-center line-clamp-2">
                  {project.title}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[#9ca3af]">
        로딩 중...
      </div>
    );
  }

  // 프로젝트 선택 시 상세 표시
  if (selectedProject) {
    const gallery = selectedProject.gallery || [];
    const currentItem = gallery[currentGalleryIndex];
    const isVertical = currentItem?.type === 'ver';
    const youtubeId = (currentItem?.type === 'hor' || currentItem?.type === 'ver') ? getYoutubeId(currentItem.url) : null;

    // 세로영상 2열 레이아웃
    if (isVertical) {
      return (
        <div className="space-y-6">
          {/* 상단: 뒤로버튼 + 제목 + 카테고리 배지 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-all hover:scale-105 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-[21px] text-[#1f2937] flex-1 truncate" style={{ fontFamily: 'S-CoreDream', fontWeight: 900, letterSpacing: '-0.03em' }}>{selectedProject.title}</h2>
            <div className="flex gap-2 flex-shrink-0">
              {selectedProject.categories.map((cat) => {
                const color = categoryColors[cat] ?? categoryColors.etc;
                return (
                  <span key={cat} className={`px-3 py-1 text-[12px] font-medium rounded-full ${color?.bg || 'bg-[#7c8a96]'} ${color?.text || 'text-white'}`}>
                    {categoryLabels[cat] || cat}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 2열 레이아웃: 세로영상 + 정보 */}
          <div className="flex gap-6">
            {/* 좌측: 세로영상 */}
            <div 
              className="w-[380px] flex-shrink-0"
              onMouseEnter={() => setIsHoveringMain(true)}
              onMouseLeave={() => setIsHoveringMain(false)}
            >
              <div className="aspect-[9/16] rounded-[12px] overflow-hidden relative bg-black">
                {youtubeId ? (
                  isYoutubePlaying ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                          title={currentItem?.title || selectedProject.title}
                          className="w-[320%] h-full"
                          style={{ marginLeft: '0' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </>
                  ) : (
                    <div 
                      className="relative w-full h-full cursor-pointer group"
                      onClick={() => setIsYoutubePlaying(true)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                        alt={currentItem?.title || selectedProject.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                        }}
                      />
                      <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-[#1f2937] ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                ) : currentItem?.type === 'img' ? (
                  <img
                    src={currentItem.url}
                    alt={currentItem.title || selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>

            {/* 우측: 정보 */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Client</p>
                  <p className="text-[15px] text-[#1f2937]">{selectedProject.client || '-'}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Date</p>
                  <p className="text-[15px] text-[#1f2937]">
                    {selectedProject.date_start 
                      ? `${selectedProject.date_start}${selectedProject.date_end ? ` - ${selectedProject.date_end}` : ''}`
                      : '-'
                    }
                  </p>
                </div>
              </div>
              {selectedProject.content && (
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Description</p>
                  <p className="text-[15px] text-[#374151] leading-relaxed whitespace-pre-wrap">
                    {selectedProject.content}
                  </p>
                </div>
              )}
              {selectedProject.details && (
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Details</p>
                  <p className="text-[15px] text-[#374151] leading-relaxed whitespace-pre-wrap">
                    {selectedProject.details}
                  </p>
                </div>
              )}
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Tags</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="text-[13px] text-[#6b7280] bg-[#f3f4f6] px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 갤러리 썸네일 */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {gallery.map((item, index) => {
                const itemYoutubeId = (item.type === 'hor' || item.type === 'ver') ? getYoutubeId(item.url) : null;
                const thumbUrl = itemYoutubeId 
                  ? `https://img.youtube.com/vi/${itemYoutubeId}/mqdefault.jpg`
                  : item.url;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentGalleryIndex(index);
                      setIsYoutubePlaying(false);
                    }}
                    className={`w-20 h-20 flex-shrink-0 rounded-[8px] overflow-hidden border-2 transition-all
                      ${currentGalleryIndex === index ? 'border-[#384155]' : 'border-transparent hover:border-[#5b7cae]'}`}
                  >
                    <img
                      src={thumbUrl}
                      alt={item.title || `Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // 가로영상/이미지 기본 레이아웃
    return (
      <div className="space-y-6">
        {/* 상단: 뒤로버튼 + 제목 + 카테고리 배지 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-all hover:scale-105 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-[21px] text-[#1f2937] flex-1 truncate" style={{ fontFamily: 'S-CoreDream', fontWeight: 900, letterSpacing: '-0.03em' }}>{selectedProject.title}</h2>
          <div className="flex gap-2 flex-shrink-0">
            {selectedProject.categories.map((cat) => {
              const color = categoryColors[cat] ?? categoryColors.etc;
              return (
                <span key={cat} className={`px-3 py-1 text-[12px] font-medium rounded-full ${color?.bg || 'bg-[#7c8a96]'} ${color?.text || 'text-white'}`}>
                  {categoryLabels[cat] || cat}
                </span>
              );
            })}
          </div>
        </div>

        {/* 메인 영상/이미지 */}
        <div 
          className="aspect-video rounded-[12px] overflow-hidden relative bg-black"
          onMouseEnter={() => setIsHoveringMain(true)}
          onMouseLeave={() => setIsHoveringMain(false)}
        >
          {youtubeId ? (
            isYoutubePlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={currentItem?.title || selectedProject.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div 
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setIsYoutubePlaying(true)}
              >
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                  alt={currentItem?.title || selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                  }}
                />
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-[#1f2937] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )
          ) : currentItem?.type === 'img' ? (
            <img
              src={currentItem.url}
              alt={currentItem.title || selectedProject.title}
              className="w-full h-full object-cover"
            />
          ) : selectedProject.thumbnail ? (
            <img
              src={selectedProject.thumbnail}
              alt={selectedProject.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af]">
              이미지 없음
            </div>
          )}
        </div>

        {/* 갤러리 썸네일 */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gallery.map((item, index) => {
              const itemYoutubeId = (item.type === 'hor' || item.type === 'ver') ? getYoutubeId(item.url) : null;
              const thumbUrl = itemYoutubeId 
                ? `https://img.youtube.com/vi/${itemYoutubeId}/mqdefault.jpg`
                : item.url;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentGalleryIndex(index);
                    setIsYoutubePlaying(false);
                  }}
                  className={`w-20 h-20 flex-shrink-0 rounded-[8px] overflow-hidden border-2 transition-all
                    ${currentGalleryIndex === index ? 'border-[#384155]' : 'border-transparent hover:border-[#5b7cae]'}`}
                >
                  <img
                    src={thumbUrl}
                    alt={item.title || `Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* 정보 영역 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Client</p>
              <p className="text-[15px] text-[#1f2937]">{selectedProject.client || '-'}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Date</p>
              <p className="text-[15px] text-[#1f2937]">
                {selectedProject.date_start 
                  ? `${selectedProject.date_start}${selectedProject.date_end ? ` - ${selectedProject.date_end}` : ''}`
                  : '-'
                }
              </p>
            </div>
          </div>
          {selectedProject.content && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Description</p>
              <p className="text-[15px] text-[#374151] leading-relaxed whitespace-pre-wrap">
                {selectedProject.content}
              </p>
            </div>
          )}
          {selectedProject.details && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Details</p>
              <p className="text-[15px] text-[#374151] leading-relaxed whitespace-pre-wrap">
                {selectedProject.details}
              </p>
            </div>
          )}
          {selectedProject.tags && selectedProject.tags.length > 0 && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Tags</p>
              <div className="flex gap-2 flex-wrap">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="text-[13px] text-[#6b7280] bg-[#f3f4f6] px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 목록 표시
  return (
    <div className="space-y-[30px]">
      {/* Featured - 슬라이드 카드 */}
      {featuredProjects.length > 0 && (
        <FeaturedSlider 
          projects={featuredProjects} 
          onProjectClick={(project) => project.has_detail && setSelectedProject(project)}
          getYoutubeId={getYoutubeId}
        />
      )}

      {/* All Projects - 연도별 그룹 */}
      {sortedYears.map((year) => (
        <div key={year}>
          {/* 연도 헤더 */}
          <div className="flex items-center justify-start mb-0 pl-[20px]">
            <span className="text-[15px] font-[500] text-[#333333]">{year}</span>
          </div>
          
          {/* 2열 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            {projectsByYear[year].map((project) => (
              <div
                key={project.id}
                onClick={() => project.has_detail && setSelectedProject(project)}
                className={`bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden transition-all
                  ${project.has_detail ? 'cursor-pointer hover:border-[#384155] hover:shadow-sm' : 'cursor-default'}`}
              >
                {/* 썸네일 + 정보 */}
                <div className="flex gap-3 p-3">
                  {/* 썸네일 90x90 */}
                  <div className="w-[80px] h-[80px] flex-shrink-0 rounded-full overflow-hidden bg-[#f3f4f6]">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-[12px]">
                        이미지
                      </div>
                    )}
                  </div>
                  
                  {/* 우측 정보 */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    {/* 타이틀 + 배지 */}
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-[500] text-[#1f2937] truncate flex-1">{project.title}</h3>
                      {project.categories[0] && (
                        <ProjectBadge category={project.categories[0]} size="sm" className="flex-shrink-0" />
                      )}
                    </div>
                    {/* 클라이언트 | 날짜 */}
                    <p className="text-[12px] text-[#9ca3af] mt-0 truncate">
                      {project.client && <span>{project.client}</span>}
                      {project.client && project.date_start && <span> | </span>}
                      {project.date_start && (
                        <span>{project.date_start}</span>
                      )}
                    </p>
                    {/* 디스크립션 */}
                    {project.description && (
                      <p className="text-[14px] text-[#6b7280] mt-0.5 line-clamp-1">{project.description}</p>
                    )}
                    {/* 태그 */}
{project.tags && project.tags.length > 0 && (
  <div className="flex gap-1.5 mt-0 flex-wrap">
    {project.tags.slice(0, 3).map((tag) => (
      <span 
        key={tag} 
        className="text-[12px]"
        style={{ 
          color: project.categories[0] === 'platform' ? '#5b7cae' 
               : project.categories[0] === 'contents' ? '#b87a5a'
               : project.categories[0] === 'marketing' ? '#6b9b7a'
               : '#7c8a96'
        }}
      >
        #{tag}
      </span>
    ))}
    {project.tags.length > 3 && (
      <span 
        className="text-[12px]"
        style={{ 
          color: project.categories[0] === 'platform' ? '#5b7cae' 
               : project.categories[0] === 'contents' ? '#b87a5a'
               : project.categories[0] === 'marketing' ? '#6b9b7a'
               : '#7c8a96'
        }}
      >
        +{project.tags.length - 3}
      </span>
    )}
  </div>
)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
