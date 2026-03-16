'use client';

import React, { useState } from 'react';
import { Notice } from '@/lib/types';
import PageTitle from '@/components/common/PageTitle';
import { TabButton } from '@/components/common/Button';
import { NoticeBadge } from '@/components/common/Badge';
import { Pin, Paperclip, ExternalLink, Eye } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { NOTICE_CATEGORIES } from '@/lib/constants';

interface PWANoticePreviewProps {
  notices: Notice[];
}

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
          {NOTICE_CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <TabButton
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label} <span className="opacity-70">{count}</span>
              </TabButton>
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
            return (
              <div
                key={notice.id}
                className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 hover:bg-[#f0f0f0] transition-all cursor-pointer"
              >
                {/* 고정 + 배지 + 제목 (한 줄) */}
                <div className="flex items-center gap-2 mb-2">
                  {notice.is_pinned && <Pin size={14} className="text-[#f59e0b] flex-shrink-0" />}
                  <NoticeBadge category={notice.category} size="sm" className="flex-shrink-0" />
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
