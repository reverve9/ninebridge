'use client';

import React, { useState, useEffect } from 'react';
import { Notice } from '@/lib/types';
import { getPublishedNotices, incrementViewCount } from '@/lib/notices';
import { formatDateTime, formatFileSize } from '@/lib/utils';
import { Pin, Paperclip, ExternalLink, ChevronDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import ExtendedFooter from './ExtendedFooter';
import ExtendedSNS from './ExtendedSNS';
import WhiteBox from '@/components/common/WhiteBox';

const categoryConfig: Record<'notice' | 'press' | 'recruit', { label: string; color: string }> = {
  notice: { label: '공지사항', color: 'text-[#dc2626]' },
  press: { label: '언론자료', color: 'text-[#3071a5]' },
  recruit: { label: '기타', color: 'text-[#ca8a04]' },
};

const ITEMS_PER_PAGE = 5;

interface ExtendedNoticeProps {
  selectedNoticeId?: string | null;
}

export default function ExtendedNotice({ selectedNoticeId }: ExtendedNoticeProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [initialExpanded, setInitialExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    notice: 1,
    press: 1,
    recruit: 1,
  });

  useEffect(() => {
    loadNotices();
  }, []);

  // 최초 로드 시 is_expanded가 true인 게시글들 열기, 없으면 첫 번째 열기
  useEffect(() => {
    if (!initialExpanded && notices.length > 0 && !selectedNoticeId) {
      const expandedNotices = notices.filter(n => n.is_expanded);
      if (expandedNotices.length > 0) {
        setExpandedIds(new Set(expandedNotices.map(n => n.id)));
      } else {
        const firstNotice = notices[0];
        if (firstNotice) {
          setExpandedIds(new Set([firstNotice.id]));
        }
      }
      setInitialExpanded(true);
    }
  }, [notices, initialExpanded, selectedNoticeId]);

  // selectedNoticeId 변경시 해당 게시글 열기 + 스크롤
  useEffect(() => {
    if (!selectedNoticeId) return;
    
    setExpandedIds(prev => new Set([...prev, selectedNoticeId]));
    
    // 약간의 딜레이 후 스크롤 (DOM 업데이트 대기)
    setTimeout(() => {
      const element = document.getElementById(`notice-${selectedNoticeId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, [selectedNoticeId]);

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

  // 카테고리별 그룹핑
  const groupedNotices = {
    notice: notices.filter(n => n.category === 'notice'),
    press: notices.filter(n => n.category === 'press'),
    recruit: notices.filter(n => n.category === 'recruit'),
  };

  const handleToggle = async (notice: Notice) => {
    if (notice.link) {
      window.open(notice.link, '_blank');
      return;
    }

    if (expandedIds.has(notice.id)) {
      setExpandedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notice.id);
        return newSet;
      });
    } else {
      // 조회수 증가
      await incrementViewCount(notice.id);
      setNotices(prev => prev.map(n => 
        n.id === notice.id ? { ...n, view_count: (n.view_count || 0) + 1 } : n
      ));
      setExpandedIds(prev => new Set([...prev, notice.id]));
    }
  };

  const getTotalPages = (category: 'notice' | 'press' | 'recruit') => {
    return Math.ceil(groupedNotices[category].length / ITEMS_PER_PAGE);
  };

  const getPaginatedItems = (category: 'notice' | 'press' | 'recruit') => {
    const items = groupedNotices[category];
    const page = currentPage[category] || 1;
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const handlePageChange = (category: 'notice' | 'press' | 'recruit', page: number) => {
    setCurrentPage(prev => ({ ...prev, [category]: page }));
    setExpandedIds(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#9ca3af]">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SNS */}
      <ExtendedSNS title="NEWS" subtitle="소식&공지" />

      {/* 노티스 전체 박스 - macOS 스타일 음영 */}
      <WhiteBox>
        {(['notice', 'press', 'recruit'] as const).map((category, categoryIdx) => {
          const config = categoryConfig[category];
          const items = groupedNotices[category];
          const paginatedItems = getPaginatedItems(category);
          const totalPages = getTotalPages(category);
          const page = currentPage[category] || 1;
          
          if (items.length === 0) return null;

          return (
            <div key={category}>
              {categoryIdx > 0 && (
                <div className="border-t border-[#e5e7eb] my-[40px]" />
              )}
              {/* 카테고리 헤더 */}
              <div className="flex items-center justify-end mb-[10px] pr-[16px]">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-[300] text-white bg-[#333] rounded-[2px] px-2 py-0.5">{config.label}</span>
                  <span className="text-[12px] text-[#9ca3af]">({items.length})</span>
                  
                  {/* 페이지네이션 - 5개 초과시만 표시 */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handlePageChange(category, page - 1)}
                        disabled={page === 1}
                        className="p-1 text-[#9ca3af] hover:text-[#3071a5] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-[12px] text-[#6b7280]">
                        {page}/{totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(category, page + 1)}
                        disabled={page === totalPages}
                        className="p-1 text-[#9ca3af] hover:text-[#3071a5] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 게시글 리스트 */}
              <div className="space-y-[10px]">
                {paginatedItems.map((notice) => {
                  const isExpanded = expandedIds.has(notice.id);

                  return (
                    <div 
                      key={notice.id} 
                      id={`notice-${notice.id}`}
                      className="rounded-[8px] overflow-hidden"
                    >
                      {/* 게시글 헤더 (클릭 영역) */}
                      <div
                        onClick={() => handleToggle(notice)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#f5f5f5] transition-colors text-left cursor-pointer rounded-[8px]"
                      >
                        {/* 펼침 아이콘 */}
                        <ChevronDown 
                          size={18} 
                          className={`text-[#9ca3af] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        />

                        {/* 고정 핀 */}
                        {notice.is_pinned && <Pin size={14} className="text-[#f59e0b] flex-shrink-0" />}

                        {/* 제목 */}
                        <span className="flex-1 text-[15px] font-[500] text-[#1f2937] truncate">
                          {notice.title}
                        </span>

                        {/* 외부 링크 표시 */}
                        {notice.link && <ExternalLink size={14} className="text-[#9ca3af] flex-shrink-0" />}

                        {/* 첨부파일 표시 */}
                        {notice.attachments && notice.attachments.length > 0 && (
                          <span className="flex items-center gap-1 text-[#9ca3af] flex-shrink-0">
                            <Paperclip size={14} />
                            <span className="text-[12px]">{notice.attachments.length}</span>
                          </span>
                        )}

                        {/* 날짜 */}
                        <span className="text-[13px] text-[#9ca3af] flex-shrink-0 w-[140px] text-right">
                          {formatDateTime(notice.created_at)}
                        </span>

                        {/* 조회수 */}
                        <span className="flex items-center gap-1 text-[#9ca3af] flex-shrink-0 w-[50px] justify-end">
                          <Eye size={14} />
                          <span className="text-[12px]">{notice.view_count || 0}</span>
                        </span>
                      </div>

                      {/* 펼침 내용 */}
                      {isExpanded && (
                        <div className="ml-[34px] px-5 pb-5 pt-2 bg-[#fafafa] rounded-b-[8px]">
                          {/* 내용 - 마크다운 렌더링 */}
                          {notice.content && (
                            <div className="mb-4 text-[13px]">
                              <MarkdownRenderer content={notice.content} />
                            </div>
                          )}

                          {/* 첨부파일 */}
                          {notice.attachments && notice.attachments.length > 0 && (
                            <div className="pt-4 border-t border-[#e5e7eb]">
                              <p className="text-[12px] text-[#6b7280] mb-2">첨부파일</p>
                              <div className="flex flex-wrap gap-2">
                                {notice.attachments.map((file, idx) => (
                                  <a
                                    key={idx}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#e5e7eb] rounded-[6px] hover:border-[#3071a5] hover:text-[#3071a5] transition-colors"
                                  >
                                    <Paperclip size={14} />
                                    <span className="text-[13px] max-w-[200px] truncate">{file.name}</span>
                                    <span className="text-[11px] text-[#9ca3af]">({formatFileSize(file.size)})</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </WhiteBox>

      {notices.length === 0 && (
        <div className="text-center py-12 text-[#9ca3af]">
          등록된 게시글이 없습니다.
        </div>
      )}

      {/* 푸터 */}
      <ExtendedFooter />
    </div>
  );
}
