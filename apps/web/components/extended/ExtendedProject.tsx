'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
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

  // 프로젝트 변경 시 유튜브 재생 상태 초기화
  useEffect(() => {
    setIsYoutubePlaying(false);
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
            {/* 썸네일 */}
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
            
            {/* 우상단 배지 */}
            <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded ${color?.bg || 'bg-[#6b7280]'} ${color?.text || 'text-white'}`}>
              {categoryLabels[mainCategory] || mainCategory}
            </span>

            {/* 호버 시 제목 표시 (상세 있는 경우만) */}
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
    // 유튜브 ID 추출
    const youtubeId = selectedProject.youtube_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1];

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
          <h2 className="text-[21px] font-bold text-[#1f2937] flex-1 truncate" style={{ fontFamily: 'S-CoreDream', fontWeight: 900, letterSpacing: '-0.03em' }}>{selectedProject.title}</h2>
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
        {youtubeId ? (
          <div className="w-full aspect-video rounded-[12px] overflow-hidden relative">
            {isYoutubePlaying ? (
              <>
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  title={selectedProject.title}
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
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                  }}
                />
                {/* 재생 버튼 오버레이 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all hover:scale-105">
                    <svg className="w-13 h-13 text-white ml-0.3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : selectedProject.main_visual ? (
          <img
            src={selectedProject.main_visual}
            alt={selectedProject.title}
            className="w-full aspect-video object-cover rounded-[12px]"
          />
        ) : selectedProject.thumbnail ? (
          <img
            src={selectedProject.thumbnail}
            alt={selectedProject.title}
            className="w-full aspect-video object-cover rounded-[12px]"
          />
        ) : null}

        {/* 텍스트 영역 - 연한 그레이 박스 */}
        <div className="bg-[#f5f5f5] p-6">
          {/* 2열 그리드: Client, Date */}
          <div className="grid grid-cols-2 gap-6 mb-6">
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

          {/* Description */}
          {selectedProject.content && (
            <div className="mb-6">
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Description</p>
              <p className="text-[15px] text-[#374151] leading-relaxed whitespace-pre-wrap">
                {selectedProject.content}
              </p>
            </div>
          )}

          {/* Details */}
          {selectedProject.details && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Details</p>
              <p className="text-[15px] text-[#374151] leading-relaxed whitespace-pre-wrap">
                {selectedProject.details}
              </p>
            </div>
          )}
        </div>

        {/* 갤러리 */}
        {selectedProject.images && selectedProject.images.length > 0 && (
          <div>
            <h3 className="text-[16px] font-semibold text-[#1f2937] mb-3">Gallery</h3>
            <div className="grid grid-cols-4 gap-3">
              {selectedProject.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`갤러리 ${idx + 1}`}
                  className="w-full h-[100px] object-cover rounded-[8px] cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>
        )}

        {/* 링크 */}
        {selectedProject.link && (
          <a
            href={selectedProject.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#3071a5] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#265d8a] transition-colors"
          >
            바로가기 →
          </a>
        )}
      </div>
    );
  }

  // 기본: 상단 여백(텍스트 영역) + 대표 프로젝트 + 연도별 그리드
  return (
    <div>
      {projects.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] text-[#9ca3af] text-[14px]">
          등록된 프로젝트가 없습니다
        </div>
      ) : (
        <div className="space-y-8">
          {/* 상단 텍스트 영역 (나중에 사용) */}
          <div className="h-[60px]">
            {/* 추후 텍스트 박스 */}
          </div>

          {/* 대표 프로젝트 */}
          {featuredProjects.length > 0 && (
            <div>
              <h3 className="text-[16px] font-semibold text-[#1f2937] mb-2">Featured</h3>
              <ThumbnailGrid items={featuredProjects} />
            </div>
          )}

          {/* 연도별 리스트 */}
          {sortedYears.map((year) => (
            <div key={year}>
              <h3 className="text-[18px] font-bold text-[#1f2937] mb-2">{year}</h3>
              <ThumbnailGrid items={projectsByYear[year] || []} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
