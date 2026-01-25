'use client';

import React, { useState, useEffect } from 'react';
import { Project, GalleryItem } from '@/lib/types';
import { getPublishedProjects } from '@/lib/projects';

interface ExtendedProjectProps {
  selectedProjectId?: string | null;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  platform: { bg: 'bg-[#3071a5]', text: 'text-white' },
  marketing: { bg: 'bg-[#ef4444]', text: 'text-white' },
  contents: { bg: 'bg-[#eab308]', text: 'text-white' },
  etc: { bg: 'bg-[#6b7280]', text: 'text-white' },
};

const categoryLabels: Record<string, string> = {
  platform: '플랫폼',
  marketing: '마케팅',
  contents: '콘텐츠',
  etc: '기타',
};

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
            
            <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded ${color?.bg || 'bg-[#6b7280]'} ${color?.text || 'text-white'}`}>
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
                  <span key={cat} className={`px-3 py-1 text-[12px] font-medium rounded-full ${color?.bg || 'bg-[#6b7280]'} ${color?.text || 'text-white'}`}>
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
                      {/* iframe을 16:9 → 9:16 비율 맞추기 위해 확대 */}
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
                      <button
                        onClick={() => setIsYoutubePlaying(false)}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-all hover:scale-105 z-10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
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
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all hover:scale-105">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af]">
                    영상 없음
                  </div>
                )}

                {/* 호버 시 갤러리 썸네일 */}
                {gallery.length > 1 && isHoveringMain && !isYoutubePlaying && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
                    <div className="flex gap-2 justify-center">
                      {gallery.map((item, index) => {
                        const thumbYoutubeId = (item.type === 'hor' || item.type === 'ver') ? getYoutubeId(item.url) : null;
                        return (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentGalleryIndex(index);
                              setIsYoutubePlaying(false);
                            }}
                            className={`w-[50px] h-[50px] rounded overflow-hidden border-2 transition-all
                              ${currentGalleryIndex === index ? 'border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                          >
                            {thumbYoutubeId ? (
                              <img src={`https://img.youtube.com/vi/${thumbYoutubeId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <img src={item.url} alt="" className="w-full h-full object-cover" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 우측: 정보 */}
            <div className="flex-1 bg-[#f5f5f5] rounded-[12px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#6b7280] uppercase tracking-wide">Project Information</h3>
                {selectedProject.link && (
                  <a 
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] text-[#3071a5] hover:text-[#265d8a] transition-colors"
                  >
                    바로가기
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              
              <div className="space-y-4">
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
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 일반 가로영상/이미지 레이아웃
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
                <span key={cat} className={`px-3 py-1 text-[12px] font-medium rounded-full ${color?.bg || 'bg-[#6b7280]'} ${color?.text || 'text-white'}`}>
                  {categoryLabels[cat] || cat}
                </span>
              );
            })}
          </div>
        </div>

        {/* 메인 비주얼 (16:9) */}
        {gallery.length > 0 ? (
          <div 
            className="w-full aspect-video rounded-[12px] overflow-hidden relative"
            onMouseEnter={() => setIsHoveringMain(true)}
            onMouseLeave={() => setIsHoveringMain(false)}
          >
            {(currentItem?.type === 'hor') && youtubeId ? (
              isYoutubePlaying ? (
                <>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                    title={currentItem?.title || selectedProject.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setIsYoutubePlaying(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all hover:scale-105">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
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

            {/* 호버 시 갤러리 썸네일 */}
            {gallery.length > 1 && isHoveringMain && !isYoutubePlaying && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
                <div className="flex gap-2 justify-center">
                  {gallery.map((item, index) => {
                    const thumbYoutubeId = (item.type === 'hor' || item.type === 'ver') ? getYoutubeId(item.url) : null;
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentGalleryIndex(index);
                          setIsYoutubePlaying(false);
                        }}
                        className={`w-[80px] h-[45px] rounded overflow-hidden border-2 transition-all
                          ${currentGalleryIndex === index ? 'border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        {thumbYoutubeId ? (
                          <img src={`https://img.youtube.com/vi/${thumbYoutubeId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : selectedProject.thumbnail ? (
          <img
            src={selectedProject.thumbnail}
            alt={selectedProject.title}
            className="w-full aspect-video object-cover rounded-[12px]"
          />
        ) : null}

        {/* 프로젝트 인포메이션 박스 */}
        <div className="bg-[#f5f5f5] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#6b7280] uppercase tracking-wide">Project Information</h3>
            {selectedProject.link && (
              <a 
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-[#3071a5] hover:text-[#265d8a] transition-colors"
              >
                바로가기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
          
          {/* 1열 구조 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
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
          </div>
        </div>
      </div>
    );
  }

  // 목록 표시
  return (
    <div className="space-y-8 pt-[60px]">
      {featuredProjects.length > 0 && (
        <div>
          <h3 className="text-[18px] font-bold text-[#1f2937] mb-2">Featured</h3>
          <ThumbnailGrid items={featuredProjects} />
        </div>
      )}

      {sortedYears.map((year) => (
        <div key={year}>
          <h3 className="text-[18px] font-bold text-[#1f2937] mb-2">{year}</h3>
          <ThumbnailGrid items={projectsByYear[year] || []} />
        </div>
      ))}
    </div>
  );
}
