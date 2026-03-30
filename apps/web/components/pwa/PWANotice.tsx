'use client';

import React, { useState, useEffect, useRef } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { TabButton } from '@/components/common/Button';
import { NoticeBadge } from '@/components/common/Badge';
import { Notice } from '@/lib/types';
import { getPublishedNotices, incrementViewCount } from '@/lib/notices';
import { formatDateTime, formatFileSize } from '@/lib/utils';
import { NOTICE_CATEGORIES } from '@/lib/constants';
import { Pin, Paperclip, ExternalLink, X, Eye } from 'lucide-react';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';

const ITEMS_PER_PAGE = 5;

interface PWANoticeProps {
  onSelectNotice?: (noticeId: string | null) => void;
  selectedNoticeId?: string | null;
  isPreview?: boolean;
  externalNotices?: Notice[];
}

export default function PWANotice({ onSelectNotice, selectedNoticeId, isPreview = false, externalNotices }: PWANoticeProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPreview && externalNotices) {
      setNotices(externalNotices);
      setLoading(false);
    } else {
      loadNotices();
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isPreview, externalNotices]);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // 카테고리 변경시 displayCount 리셋
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [activeCategory]);

  const loadNotices = async () => {
    try {
      const data = await getPublishedNotices();
      setNotices(data);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = activeCategory === 'all'
    ? notices
    : notices.filter(n => n.category === activeCategory);

  // 고정글 우선
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return a.order - b.order;
  });

  const displayedNotices = sortedNotices.slice(0, displayCount);
  const hasMore = displayCount < sortedNotices.length;

  // PWA wrapper 스크롤 감지
  useEffect(() => {
    const pwaWrapper = document.getElementById('pwa-wrapper');
    if (!pwaWrapper) return;

    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = pwaWrapper;
      
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setLoadingMore(true);
        setTimeout(() => {
          setDisplayCount(prev => prev + ITEMS_PER_PAGE);
          setLoadingMore(false);
        }, 300);
      }
    };

    pwaWrapper.addEventListener('scroll', handleScroll);
    return () => pwaWrapper.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  const handleNoticeClick = async (notice: Notice) => {
    // 조회수 증가
    try {
      await incrementViewCount(notice.id);
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
    
    // 로컬 상태 업데이트
    setNotices(prev => prev.map(n => 
      n.id === notice.id ? { ...n, view_count: (n.view_count || 0) + 1 } : n
    ));

    if (notice.link) {
      window.open(notice.link, '_blank');
      return;
    }

    // 768 미만: 모달, 768 이상: 우측 아코디언
    if (isMobile) {
      setSelectedNotice({ ...notice, view_count: (notice.view_count || 0) + 1 });
    } else {
      // 데스크탑: 우측에 알림
      if (onSelectNotice) {
        onSelectNotice(notice.id);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-full">
      <PageTitle title="NEWS" subtitle="소식&공지" />

      {/* 카테고리 탭 - 좌측 정렬 */}
      <div className="px-4 py-3">
        <div className="flex gap-1 flex-wrap justify-start">
          {NOTICE_CATEGORIES.map((cat) => (
            <TabButton
              key={cat.id}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </TabButton>
          ))}
        </div>
      </div>

      {/* 게시글 목록 - 카드형 */}
      <div className="px-4 py-2 space-y-3 pb-4">
        {loading ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">로딩 중...</p>
        ) : sortedNotices.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">등록된 게시글이 없습니다.</p>
        ) : (
          <>
            {displayedNotices.map((notice) => {
              const isSelected = selectedNoticeId === notice.id;
              return (
                <div
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice)}
                  className={`rounded-[12px] border border-[#e5e7eb] p-4 transition-all cursor-pointer
                    ${isSelected ? 'bg-[#f0f0f0]' : 'bg-white hover:bg-[#f0f0f0]'}`}
                >
                  {/* 고정 + 배지 + 제목 (한 줄) */}
                  <div className="flex items-center gap-2 mb-1">
                    {notice.is_pinned && <Pin size={14} className="text-[#f59e0b] flex-shrink-0" />}
                    <NoticeBadge category={notice.category} size="sm" className="flex-shrink-0" />
                    <h3 className="flex-1 text-[15px] font-medium text-[#1f2937] truncate min-w-0">
                      {notice.title}
                    </h3>
                    {notice.link && <ExternalLink size={14} className="text-[#9ca3af] flex-shrink-0" />}
                  </div>

                  {/* 작성일시 · 첨부 | 조회수 (우측정렬) */}
                  <div className="flex items-center justify-between text-[12px] text-[#9ca3af] mb-1">
                    <div className="flex items-center gap-3">
                      <span>{formatDateTime(notice.created_at)}</span>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Paperclip size={12} />
                          {notice.attachments.length}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {notice.view_count || 0}
                    </span>
                  </div>

                  {/* 한줄 내용 */}
                  {notice.content && (
                    <p className="text-[13px] text-[#6b7280] line-clamp-1">
                      {notice.content}
                    </p>
                  )}
                </div>
              );
            })}
            
            {/* 로딩 더 보기 */}
            {loadingMore && (
              <p className="text-[13px] text-[#9ca3af] py-4 text-center">로딩 중...</p>
            )}
            {!hasMore && sortedNotices.length > ITEMS_PER_PAGE && (
              <p className="text-[13px] text-[#9ca3af] py-4 text-center">모든 게시글을 불러왔습니다.</p>
            )}
          </>
        )}
      </div>

      {/* 상세 모달 (768 미만만) */}
      {selectedNotice && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-5"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="bg-white w-full max-h-[80vh] rounded-[16px] overflow-hidden flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                {selectedNotice.is_pinned && <Pin size={12} className="text-[#f59e0b]" />}
                <NoticeBadge category={selectedNotice.category} size="sm" />
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 hover:bg-[#f3f4f6] rounded-full"
              >
                <X size={22} className="text-[#6b7280]" />
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* 제목 */}
              <h2 className="text-[18px] font-bold text-[#1f2937] mb-2">{selectedNotice.title}</h2>
              
              {/* 메타 정보 */}
              <div className="flex items-center gap-3 text-[12px] text-[#9ca3af] mb-4">
                <span>{formatDateTime(selectedNotice.created_at)}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {selectedNotice.view_count || 0}
                </span>
              </div>

              {/* 내용 - 마크다운 렌더링 */}
              {selectedNotice.content && (
                <div className="mb-4">
                  <MarkdownRenderer content={selectedNotice.content} />
                </div>
              )}

              {/* 첨부파일 */}
              {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                <div className="border-t border-[#e5e7eb] pt-4">
                  <p className="text-[12px] text-[#6b7280] mb-2">첨부파일</p>
                  <div className="space-y-2">
                    {selectedNotice.attachments.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-[#f9fafb] rounded-[6px] hover:bg-[#f3f4f6]"
                      >
                        <Paperclip size={14} className="text-[#6b7280]" />
                        <span className="flex-1 text-[13px] text-[#374151] truncate">{file.name}</span>
                        <span className="text-[11px] text-[#9ca3af]">{formatFileSize(file.size)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
