'use client';

import React, { useState } from 'react';
import { Notice } from '@/lib/types';
import PageTitle from '@/components/common/PageTitle';
import { Pin, Paperclip, ExternalLink, Eye } from 'lucide-react';

interface PWANoticePreviewProps {
  notices: Notice[];
}

const categoryLabels: Record<'notice' | 'press' | 'recruit', { label: string; color: string }> = {
  notice: { label: '공지사항', color: 'bg-[#ef4444]/10 text-[#dc2626]' },
  press: { label: '언론자료', color: 'bg-[#3071a5]/10 text-[#3071a5]' },
  recruit: { label: '기타', color: 'bg-[#eab308]/10 text-[#ca8a04]' },
};

const categories = [
  { id: 'all', label: '전체' },
  { id: 'notice', label: '공지사항' },
  { id: 'press', label: '언론자료' },
  { id: 'recruit', label: '기타' },
];

export default function PWANoticePreview({ notices }: PWANoticePreviewProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredNotices = activeCategory === 'all'
    ? notices
    : notices.filter(n => n.category === activeCategory);

  // 고정글 우선, 나머지는 order 순
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

  return (
    <div className="min-h-full bg-white">
      {/* 헤더 */}
      <div className="bg-[#3071a5] text-white px-4 h-[60px] flex items-center">
        <span className="text-[14px] font-medium">NEWS 미리보기</span>
      </div>

      <PageTitle title="NEWS" subtitle="소식&공지" />

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

      {/* 게시글 목록 - 메인 앱과 동일한 카드형 */}
      <div className="px-4 py-2 space-y-3">
        {sortedNotices.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">등록된 게시글이 없습니다.</p>
        ) : (
          sortedNotices.map((notice) => {
            const cat = categoryLabels[notice.category] || categoryLabels.notice;
            return (
              <div
                key={notice.id}
                className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 hover:bg-[#f0f0f0] transition-all cursor-pointer"
              >
                {/* 고정 + 배지 + 제목 (한 줄) */}
                <div className="flex items-center gap-2 mb-2">
                  {notice.is_pinned && <Pin size={14} className="text-[#f59e0b] flex-shrink-0" />}
                  <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded flex-shrink-0 ${cat.color}`}>
                    {cat.label}
                  </span>
                  <h3 className="flex-1 text-[15px] font-medium text-[#1f2937] truncate min-w-0">
                    {notice.title}
                  </h3>
                  {notice.link && <ExternalLink size={14} className="text-[#9ca3af] flex-shrink-0" />}
                </div>

                {/* 작성일시 · 첨부 | 조회수 (우측정렬) */}
                <div className="flex items-center justify-between text-[12px] text-[#9ca3af] mb-2">
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
          })
        )}
      </div>
    </div>
  );
}
