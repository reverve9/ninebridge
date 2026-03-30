'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { ProjectBadge } from '@/components/common/Badge';
import { getYoutubeId } from '@/lib/utils';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';

interface ExtendedProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export default function ExtendedProjectDetail({ project, onBack }: ExtendedProjectDetailProps) {
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isHoveringMain, setIsHoveringMain] = useState(false);

  // 프로젝트 변경 시 상태 초기화
  useEffect(() => {
    setIsYoutubePlaying(false);
    if (project?.gallery) {
      const mainIndex = project.gallery.findIndex(item => item.is_main);
      setCurrentGalleryIndex(mainIndex >= 0 ? mainIndex : 0);
    } else {
      setCurrentGalleryIndex(0);
    }
  }, [project]);



  const gallery = project.gallery || [];
  const currentItem = gallery[currentGalleryIndex];
  const youtubeId = (currentItem?.type === 'hor' || currentItem?.type === 'ver') ? getYoutubeId(currentItem.url) : null;
  
  // 레이아웃 타입 결정: ver(세로영상), hor(가로영상), img(이미지)
  const layoutType = currentItem?.type || 'img';

  // 세로영상 레이아웃 (가로영상과 동일한 구조로 처리)
  if (layoutType === 'ver') {
    return (
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] px-10 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]">
        <div className="space-y-6">
          {/* 상단: 뒤로버튼 + 제목 + 카테고리 배지 */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-[#f5f5f5] text-[#666] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-[19px] text-[#1f2937] flex-1 truncate" style={{ fontFamily: 'S-CoreDream', fontWeight: 500, letterSpacing: '-0.03em' }}>{project.title}</h2>
            <div className="flex gap-2 flex-shrink-0">
              {project.categories.map((cat) => (
                <ProjectBadge key={cat} category={cat} size="md" />
              ))}
            </div>
          </div>

          {/* 메인 영상 - 가로영상과 동일한 구조 */}
          <div 
            className="w-full aspect-video rounded-[12px] overflow-hidden relative"
            onMouseEnter={() => setIsHoveringMain(true)}
            onMouseLeave={() => setIsHoveringMain(false)}
          >
            {youtubeId ? (
              isYoutubePlaying ? (
                <>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                    title={currentItem?.title || project.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setIsYoutubePlaying(false)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-all hover:scale-105"
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
                    alt={currentItem?.title || project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-13 h-13 text-[#E62117] ml-0.3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full h-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af]">
                No video available
              </div>
            )}
            
            {/* 좌우 화살표 - 갤러리 2개 이상일 때만 */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentGalleryIndex(prev => prev === 0 ? gallery.length - 1 : prev - 1);
                    setIsYoutubePlaying(false);
                  }}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md text-[#666] hover:bg-white transition-all ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentGalleryIndex(prev => prev === gallery.length - 1 ? 0 : prev + 1);
                    setIsYoutubePlaying(false);
                  }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md text-[#666] hover:bg-white transition-all ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* 갤러리 썸네일 */}
          {gallery.length > 1 && (() => {
            const videoItems = gallery.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => item.type === 'hor' || item.type === 'ver');
            const imageItems = gallery.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => item.type === 'img');
            
            return (
              <div className="space-y-4">
                {/* PLAYLIST - 영상 */}
                {videoItems.length > 0 && (
                  <div>
                    <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Playlist</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {videoItems.map((item) => {
                        const itemYoutubeId = getYoutubeId(item.url);
                        const thumbUrl = `https://img.youtube.com/vi/${itemYoutubeId}/mqdefault.jpg`;
                        
                        return (
                          <button
                            key={item.originalIndex}
                            onClick={() => {
                              setCurrentGalleryIndex(item.originalIndex);
                              setIsYoutubePlaying(false);
                            }}
                            className={`w-[80px] flex-shrink-0 transition-all ${currentGalleryIndex === item.originalIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                          >
                            <div className={`w-[80px] h-[80px] rounded-[8px] overflow-hidden relative border-2 transition-all
                              ${currentGalleryIndex === item.originalIndex ? 'border-[#384155]' : 'border-transparent'}`}>
                              <img
                                src={thumbUrl}
                                alt={item.title || `Video ${item.originalIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* 오버레이 - 하단 그라데이션 + 제목 */}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-[11px] text-white truncate">{item.title || '제목 없음'}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* GALLERY - 이미지 */}
                {imageItems.length > 0 && (
                  <div>
                    <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Gallery</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {imageItems.map((item) => (
                        <button
                          key={item.originalIndex}
                          onClick={() => {
                            setCurrentGalleryIndex(item.originalIndex);
                            setIsYoutubePlaying(false);
                          }}
                          className={`w-[80px] h-[80px] flex-shrink-0 rounded-[8px] overflow-hidden border-2 transition-all
                            ${currentGalleryIndex === item.originalIndex ? 'border-[#384155]' : 'border-transparent'} 
                            ${currentGalleryIndex === item.originalIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        >
                          <img
                            src={item.url}
                            alt={item.title || `Image ${item.originalIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 정보 영역 - 회색 박스 */}
          <div className="bg-[#f5f5f5] p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Client</p>
                <p className="text-[15px] text-[#1f2937]">{project.client || '-'}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Date</p>
                <p className="text-[15px] text-[#1f2937]">
                  {project.date_start 
                    ? `${project.date_start}${project.date_end ? ` - ${project.date_end}` : ''}`
                    : '-'
                  }
                </p>
              </div>
            </div>
            {project.content && (
              <div>
                <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Description</p>
                <MarkdownRenderer content={project.content} />
              </div>
            )}
            {project.details && (
              <div>
                <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Details</p>
                <MarkdownRenderer content={project.details} />
              </div>
            )}
            {project.tags && project.tags.length > 0 && (
              <div>
                <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[13px] text-[#6b7280] bg-white px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 가로영상 레이아웃
  if (layoutType === 'hor') {
    return (
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] px-10 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]">
        <div className="space-y-6">
          {/* 상단: 뒤로버튼 + 제목 + 카테고리 배지 */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-[#f5f5f5] text-[#666] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-[19px] text-[#1f2937] flex-1 truncate" style={{ fontFamily: 'S-CoreDream', fontWeight: 500, letterSpacing: '-0.03em' }}>{project.title}</h2>
            <div className="flex gap-2 flex-shrink-0">
              {project.categories.map((cat) => (
                <ProjectBadge key={cat} category={cat} size="md" />
              ))}
            </div>
          </div>

        {/* 메인 영상 */}
        <div 
          className="w-full aspect-video rounded-[12px] overflow-hidden relative"
          onMouseEnter={() => setIsHoveringMain(true)}
          onMouseLeave={() => setIsHoveringMain(false)}
        >
          {youtubeId ? (
            isYoutubePlaying ? (
              <>
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  title={currentItem?.title || project.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setIsYoutubePlaying(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-all hover:scale-105"
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
                  alt={currentItem?.title || project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                  }}
                />
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-13 h-13 text-[#E62117] ml-0.3" fill="currentColor" viewBox="0 0 24 24">
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
          
          {/* 좌우 화살표 - 갤러리 2개 이상일 때만 */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentGalleryIndex(prev => prev === 0 ? gallery.length - 1 : prev - 1);
                  setIsYoutubePlaying(false);
                }}
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md text-[#666] hover:bg-white transition-all ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentGalleryIndex(prev => prev === gallery.length - 1 ? 0 : prev + 1);
                  setIsYoutubePlaying(false);
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md text-[#666] hover:bg-white transition-all ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* 갤러리 썸네일 */}
        {gallery.length > 1 && (() => {
          const videoItems = gallery.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => item.type === 'hor' || item.type === 'ver');
          const imageItems = gallery.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => item.type === 'img');
          
          return (
            <div className="space-y-4">
              {/* PLAYLIST - 영상 */}
              {videoItems.length > 0 && (
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Playlist</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {videoItems.map((item) => {
                      const itemYoutubeId = getYoutubeId(item.url);
                      const thumbUrl = `https://img.youtube.com/vi/${itemYoutubeId}/mqdefault.jpg`;
                      
                      return (
                        <button
                          key={item.originalIndex}
                          onClick={() => {
                            setCurrentGalleryIndex(item.originalIndex);
                            setIsYoutubePlaying(false);
                          }}
                          className={`w-[80px] flex-shrink-0 transition-all ${currentGalleryIndex === item.originalIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        >
                          <div className={`w-[80px] h-[80px] rounded-[8px] overflow-hidden relative border-2 transition-all
                            ${currentGalleryIndex === item.originalIndex ? 'border-[#384155]' : 'border-transparent'}`}>
                            <img
                              src={thumbUrl}
                              alt={item.title || `Video ${item.originalIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* 오버레이 - 하단 그라데이션 + 제목 */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-[11px] text-white truncate">{item.title || '제목 없음'}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GALLERY - 이미지 */}
              {imageItems.length > 0 && (
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Gallery</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {imageItems.map((item) => (
                      <button
                        key={item.originalIndex}
                        onClick={() => {
                          setCurrentGalleryIndex(item.originalIndex);
                          setIsYoutubePlaying(false);
                        }}
                        className={`w-[80px] h-[80px] flex-shrink-0 rounded-[8px] overflow-hidden border-2 transition-all
                          ${currentGalleryIndex === item.originalIndex ? 'border-[#384155]' : 'border-transparent'} 
                          ${currentGalleryIndex === item.originalIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <img
                          src={item.url}
                          alt={item.title || `Image ${item.originalIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 정보 영역 - 회색 박스 */}
        <div className="bg-[#f5f5f5] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Client</p>
              <p className="text-[15px] text-[#1f2937]">{project.client || '-'}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Date</p>
              <p className="text-[15px] text-[#1f2937]">
                {project.date_start 
                  ? `${project.date_start}${project.date_end ? ` - ${project.date_end}` : ''}`
                  : '-'
                }
              </p>
            </div>
          </div>
          {project.content && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Description</p>
              <MarkdownRenderer content={project.content} />
            </div>
          )}
          {project.details && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Details</p>
              <MarkdownRenderer content={project.details} />
            </div>
          )}
          {project.tags && project.tags.length > 0 && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Tags</p>
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[13px] text-[#6b7280] bg-white px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    );
  }

  // 이미지 레이아웃
  return (
    <div className="bg-white rounded-[12px] border border-[#e5e7eb] px-10 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]">
      <div className="space-y-6">
        {/* 상단: 뒤로버튼 + 제목 + 카테고리 배지 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-[#f5f5f5] text-[#666] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition-all flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-[19px] text-[#1f2937] flex-1 truncate" style={{ fontFamily: 'S-CoreDream', fontWeight: 500, letterSpacing: '-0.03em' }}>{project.title}</h2>
          <div className="flex gap-2 flex-shrink-0">
            {project.categories.map((cat) => (
              <ProjectBadge key={cat} category={cat} size="md" />
            ))}
          </div>
        </div>

        {/* 메인 이미지 */}
        <div 
          className="w-full aspect-video rounded-[12px] overflow-hidden relative group"
        >
          {currentItem?.url ? (
            <img
              src={currentItem.url}
              alt={currentItem.title || project.title}
              className="w-full h-full object-cover"
            />
          ) : project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af]">
              이미지 없음
            </div>
          )}
          
          {/* 좌우 화살표 - 갤러리 2개 이상일 때만 */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => {
                  setCurrentGalleryIndex(prev => prev === 0 ? gallery.length - 1 : prev - 1);
                  setIsYoutubePlaying(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md text-[#666] hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setCurrentGalleryIndex(prev => prev === gallery.length - 1 ? 0 : prev + 1);
                  setIsYoutubePlaying(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md text-[#666] hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* 갤러리 썸네일 */}
        {gallery.length > 1 && (() => {
          const videoItems = gallery.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => item.type === 'hor' || item.type === 'ver');
          const imageItems = gallery.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => item.type === 'img');
          
          return (
            <div className="space-y-4">
              {/* PLAYLIST - 영상 */}
              {videoItems.length > 0 && (
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Playlist</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {videoItems.map((item) => {
                      const itemYoutubeId = getYoutubeId(item.url);
                      const thumbUrl = `https://img.youtube.com/vi/${itemYoutubeId}/mqdefault.jpg`;
                      
                      return (
                        <button
                          key={item.originalIndex}
                          onClick={() => {
                            setCurrentGalleryIndex(item.originalIndex);
                            setIsYoutubePlaying(false);
                          }}
                          className={`w-[80px] flex-shrink-0 transition-all ${currentGalleryIndex === item.originalIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        >
                          <div className={`w-[80px] h-[80px] rounded-[8px] overflow-hidden relative border-2 transition-all
                            ${currentGalleryIndex === item.originalIndex ? 'border-[#384155]' : 'border-transparent'}`}>
                            <img
                              src={thumbUrl}
                              alt={item.title || `Video ${item.originalIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* 오버레이 - 하단 그라데이션 + 제목 */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-[11px] text-white truncate">{item.title || '제목 없음'}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GALLERY - 이미지 */}
              {imageItems.length > 0 && (
                <div>
                  <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Gallery</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {imageItems.map((item) => (
                      <button
                        key={item.originalIndex}
                        onClick={() => {
                          setCurrentGalleryIndex(item.originalIndex);
                          setIsYoutubePlaying(false);
                        }}
                        className={`w-[80px] h-[80px] flex-shrink-0 rounded-[8px] overflow-hidden border-2 transition-all
                          ${currentGalleryIndex === item.originalIndex ? 'border-[#384155]' : 'border-transparent'} 
                          ${currentGalleryIndex === item.originalIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <img
                          src={item.url}
                          alt={item.title || `Image ${item.originalIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 정보 영역 - 회색 박스 */}
        <div className="bg-[#f5f5f5] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Client</p>
              <p className="text-[15px] text-[#1f2937]">{project.client || '-'}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-1">Date</p>
              <p className="text-[15px] text-[#1f2937]">
                {project.date_start 
                  ? `${project.date_start}${project.date_end ? ` - ${project.date_end}` : ''}`
                  : '-'
                }
              </p>
            </div>
          </div>
          {project.content && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Description</p>
              <MarkdownRenderer content={project.content} />
            </div>
          )}
          {project.details && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Details</p>
              <MarkdownRenderer content={project.details} />
            </div>
          )}
          {project.tags && project.tags.length > 0 && (
            <div>
              <p className="text-[12px] text-[#9ca3af] uppercase tracking-wide mb-2">Tags</p>
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[13px] text-[#6b7280] bg-white px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
