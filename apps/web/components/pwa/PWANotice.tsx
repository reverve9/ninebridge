'use client';

import React, { useState, useEffect } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Notice } from '@/lib/types';
import { getPublishedNotices, incrementViewCount } from '@/lib/notices';
import { Pin, FileText, Briefcase, Megaphone, Paperclip, ExternalLink, X, Eye } from 'lucide-react';

const categoryLabels: Record<'notice' | 'press' | 'recruit', { label: string; icon: React.ReactNode; color: string }> = {
  notice: { label: '공지사항', icon: <Megaphone size={10} />, color: 'bg-blue-100 text-blue-700' },
  press: { label: '보도자료', icon: <FileText size={10} />, color: 'bg-green-100 text-green-700' },
  recruit: { label: '채용공고', icon: <Briefcase size={10} />, color: 'bg-purple-100 text-purple-700' },
};

const categories = [
  { id: 'all', label: '전체' },
  { id: 'notice', label: '공지사항' },
  { id: 'press', label: '보도자료' },
  { id: 'recruit', label: '채용공고' },
];

export default function PWANotice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    loadNotices();
  }, []);

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

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return notices.length;
    return notices.filter(n => n.category === catId).length;
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleNoticeClick = async (notice: Notice) => {
    // 조회수 증가
    await incrementViewCount(notice.id);
    
    // 로컬 상태 업데이트
    setNotices(prev => prev.map(n => 
      n.id === notice.id ? { ...n, view_count: (n.view_count || 0) + 1 } : n
    ));

    if (notice.link) {
      window.open(notice.link, '_blank');
    } else {
      setSelectedNotice({ ...notice, view_count: (notice.view_count || 0) + 1 });
    }
  };

  return (
    <div className="relative min-h-full">
      <PageTitle title="NOTICE" subtitle="공지사항" />

      {/* 카테고리 탭 */}
      <div className="px-4 pb-3">
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-[13px] rounded-[4px] transition-colors border
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

      {/* 게시글 목록 - 카드형 */}
      <div className="px-4 py-2 space-y-3">
        {loading ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">로딩 중...</p>
        ) : sortedNotices.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">등록된 게시글이 없습니다.</p>
        ) : (
          sortedNotices.map((notice) => {
            const cat = categoryLabels[notice.category] || categoryLabels.notice;
            return (
              <div
                key={notice.id}
                onClick={() => handleNoticeClick(notice)}
                className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 hover:border-[#3071a5] hover:shadow-sm transition-all cursor-pointer"
              >
                {/* 카테고리 배지 + 고정 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded ${cat.color}`}>
                    {cat.icon}
                    {cat.label}
                  </span>
                  {notice.is_pinned && <Pin size={12} className="text-[#f59e0b]" />}
                  {notice.link && <ExternalLink size={12} className="text-[#9ca3af]" />}
                </div>

                {/* 타이틀 */}
                <h3 className="text-[15px] font-medium text-[#1f2937] mb-2 line-clamp-1">
                  {notice.title}
                </h3>

                {/* 작성일시 · 조회수 */}
                <div className="flex items-center gap-3 text-[12px] text-[#9ca3af] mb-2">
                  <span>{formatDateTime(notice.created_at)}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {notice.view_count || 0}
                  </span>
                  {notice.attachments && notice.attachments.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Paperclip size={12} />
                      {notice.attachments.length}
                    </span>
                  )}
                </div>

                {/* 한줄 내용 */}
                {notice.content && (
                  <p className="text-[13px] text-[#6b7280] line-clamp-1">
                    {notice.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 상세 모달 */}
      {selectedNotice && (
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
                {(() => {
                  const cat = categoryLabels[selectedNotice.category] || categoryLabels.notice;
                  return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded ${cat.color}`}>
                      {cat.icon}
                      {cat.label}
                    </span>
                  );
                })()}
                {selectedNotice.is_pinned && <Pin size={12} className="text-[#f59e0b]" />}
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

              {/* 내용 */}
              {selectedNotice.content && (
                <div className="text-[14px] text-[#374151] whitespace-pre-wrap leading-relaxed mb-4">
                  {selectedNotice.content}
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
