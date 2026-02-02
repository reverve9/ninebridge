'use client';

import React, { useState, useEffect } from 'react';
import { Project, GalleryItem } from '@/lib/types';
import { getPublishedProjects } from '@/lib/projects';
import { ProjectBadge, PROJECT_CATEGORY_MAP } from '@/components/common/Badge';
import ExtendedProjectDetail from './ExtendedProjectDetail';
import ExtendedFooter from './ExtendedFooter';
import ExtendedSNS from './ExtendedSNS';
import WhiteBox from '@/components/common/WhiteBox';

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
  allProjects: Project[];
  onProjectClick: (project: Project) => void;
  getYoutubeId: (url: string) => string | undefined;
}

function FeaturedSlider({ projects, allProjects, onProjectClick, getYoutubeId }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  // 10초 자동 슬라이드 (무한루프, 한 방향)
  useEffect(() => {
    if (projects.length <= 1) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(timer);
  }, [projects.length, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    // 마지막 복제 슬라이드에서 첫번째로 점프 (애니메이션 없이)
    if (currentIndex >= projects.length) {
      setIsJumping(true);
      setCurrentIndex(0);
      // 다음 프레임에서 점프 상태 해제
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsJumping(false);
        });
      });
    }
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
  };

  // 연관 프로젝트 가져오기
  const getRelatedProjects = (project: Project) => {
    if (!project.related_projects || project.related_projects.length === 0) return [];
    return project.related_projects
      .map(id => allProjects.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 5) as Project[];
  };

  // 무한루프를 위해 첫번째 슬라이드를 끝에 복제
  const slidesWithClone = projects.length > 0 ? [...projects, projects[0]] : [];

  if (projects.length === 0) return null;

  return (
    <div>
      {/* 슬라이드 래퍼 */}
      <div className="overflow-hidden">
        {/* 슬라이드 컨테이너 */}
        <div 
          className={`flex ${!isJumping ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slidesWithClone.map((project, idx) => {
            if (!project) return null;
            
            // 대표 프로젝트용 썸네일 (3:2) 또는 일반 썸네일
            const featuredThumbnail = project.featured_thumbnail || project.thumbnail;
            
            // 연관 프로젝트
            const relatedProjects = getRelatedProjects(project);

            return (
              <div 
                key={`${project.id}-${idx}`}
                className="flex flex-shrink-0 w-full gap-4"
              >
                {/* 좌측 2/3: 메인 썸네일 + 정보 */}
                <div 
                  className="w-2/3 cursor-pointer"
                  onClick={() => onProjectClick(project)}
                >
                  {/* 3:2 비율 썸네일 */}
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[8px] bg-[#f3f4f6]">
                    {featuredThumbnail ? (
                      <img
                        src={featuredThumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-[14px]">
                        이미지
                      </div>
                    )}
                  </div>
                  
                  {/* 하단 정보 */}
                  <div className="mt-3">
                    {/* 타이틀 + 클라이언트/제작일 */}
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-[15px] font-bold text-[#1f2937] line-clamp-1">{project.title}</h3>
                      <span className="text-[13px] font-[100] text-[#000000] flex-shrink-0">
                        {project.client && <span>{project.client}</span>}
                        {project.client && project.date_start && <span> · </span>}
                        {project.date_start && <span>{project.date_start}</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 우측 1/3: Related Projects */}
                <div className="w-1/3 flex flex-col">
                  {relatedProjects.length > 0 ? (
                    <div className="space-y-2">
                      {relatedProjects.map((related) => (
                        <div
                          key={related.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectClick(related);
                          }}
                          className="flex gap-3 cursor-pointer hover:bg-[#f5f5f5] rounded-[6px] p-1 -m-1 transition-colors"
                        >
                          {/* 썸네일 */}
                          <div className="w-[50px] h-[50px] flex-shrink-0 rounded-[4px] overflow-hidden bg-[#f3f4f6]">
                            {related.thumbnail ? (
                              <img
                                src={related.thumbnail}
                                alt={related.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-[10px]">
                                이미지
                              </div>
                            )}
                          </div>
                          {/* 정보 */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-[13px] font-medium text-[#1f2937] line-clamp-1">{related.title}</h4>
                            <p className="text-[11px] text-[#9ca3af] line-clamp-1">
                              {related.client && <span>{related.client}</span>}
                              {related.client && related.date_start && <span> · </span>}
                              {related.date_start && <span>{related.date_start}</span>}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-[#9ca3af] text-[13px]">
                      연관 프로젝트 없음
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
  const [visibleCount, setVisibleCount] = useState(10);

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

  // 대표 프로젝트 (랜덤 순서)
  const featuredProjects = projects
    .filter(p => p.is_featured)
    .sort(() => Math.random() - 0.5);

  // 전체 프로젝트를 연도순 정렬
  const allProjectsSorted = [...projects]
    .sort((a, b) => {
      const yearA = a.date_start?.split('/')[0] || '0';
      const yearB = b.date_start?.split('/')[0] || '0';
      return Number(yearB) - Number(yearA);
    });

  // 보여줄 프로젝트
  const visibleProjects = allProjectsSorted.slice(0, visibleCount);
  const hasMore = allProjectsSorted.length > visibleCount;

  // 보여줄 프로젝트를 연도별로 그룹핑
  const projectsByYear = visibleProjects.reduce((acc, project) => {
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
    return (
      <ExtendedProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  // 목록 표시
  return (
    <div className="space-y-[30px]">
      {/* SNS */}
      <ExtendedSNS title="WORX" subtitle="포트폴리오" />

      {/* 프로젝트 전체 박스 - macOS 스타일 음영 */}
      <WhiteBox>
        {/* Featured - 슬라이드 카드 */}
        {featuredProjects.length > 0 && (
          <FeaturedSlider 
            projects={featuredProjects}
            allProjects={projects}
            onProjectClick={(project) => project.has_detail && setSelectedProject(project)}
            getYoutubeId={getYoutubeId}
          />
        )}

        {/* 구분선 */}
        {featuredProjects.length > 0 && sortedYears.length > 0 && (
          <div className="border-t border-[#e5e7eb] my-[40px]" />
        )}

        {/* All Projects - 연도별 그룹 */}
        {sortedYears.map((year, idx) => (
          <div key={year} className={idx > 0 ? 'mt-[30px]' : ''}>
            {/* 연도 헤더 */}
            <div className="flex items-center justify-end mb-[10px] pr-[16px]">
              <span className="text-[13px] font-[300] text-white bg-[#333] rounded-[2px] px-2 py-0.5">{year}</span>
            </div>
              
              {/* 2열 그리드 */}
              <div className="grid grid-cols-2 gap-[10px]">
                {(projectsByYear[year] || []).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => project.has_detail && setSelectedProject(project)}
                    className={`rounded-[8px] overflow-hidden transition-all
                      ${project.has_detail ? 'cursor-pointer hover:bg-[#f5f5f5]' : 'cursor-default'}`}
                >
                {/* 썸네일 + 정보 */}
                <div className="flex gap-2.5 p-2.5 items-center">
                  {/* 썸네일 64x64 */}
                  <div className="w-[64px] h-[64px] flex-shrink-0 rounded-full overflow-hidden bg-[#f3f4f6]">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-[10px]">
                        이미지
                      </div>
                    )}
                  </div>
                  
                  {/* 우측 정보 */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    {/* 타이틀 + 배지 */}
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-[600] text-[#1f2937] truncate flex-1">{project.title}</h3>
                      {project.categories[0] && (
                        <ProjectBadge category={project.categories[0]} size="sm" className="flex-shrink-0" />
                      )}
                    </div>
                    {/* 클라이언트 | 날짜 */}
                    <p className="text-[11px] text-[#9ca3af] mt-0 truncate">
                      {project.client && <span>{project.client}</span>}
                      {project.client && project.date_start && <span> | </span>}
                      {project.date_start && (
                        <span>{project.date_start}</span>
                      )}
                    </p>
                    {/* 디스크립션 */}
                    {project.description && (
                      <p className="text-[12px] text-[#6b7280] mt-0.5 line-clamp-1">{project.description}</p>
                    )}
                    {/* 태그 */}
{project.tags && project.tags.length > 0 && (
  <div className="flex gap-1 mt-0 overflow-hidden whitespace-nowrap">
    {project.tags.map((tag) => (
      <span 
        key={tag} 
        className="text-[11px] flex-shrink-0"
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
  </div>
)}
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* 더보기 버튼 */}
        {hasMore && (
          <div className="flex justify-center pt-[20px]">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-6 py-2 text-[14px] text-[#666] bg-[#f5f5f5] rounded-[8px] hover:bg-[#e8e8e8] transition-all"
            >
              더보기
            </button>
          </div>
        )}
      </WhiteBox>

      {/* 푸터 */}
      <ExtendedFooter />
    </div>
  );
}
