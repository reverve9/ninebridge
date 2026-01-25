'use client';

import React, { useState } from 'react';
import { Notice } from '@/lib/types';
import PageTitle from '@/components/common/PageTitle';
import { Pin, FileText, Briefcase, Megaphone, Paperclip } from 'lucide-react';

interface PWANoticePreviewProps {
  notices: Notice[];
}

const categoryLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  notice: { label: '공지사항', icon: <Megaphone size={12} />, color: 'bg-blue-100 text-blue-700' },
  press: { label: '보도자료', icon: <FileText size={12} />, color: 'bg-green-100 text-green-700' },
  recruit: { label: '채용공고', icon: <Briefcase size={12} />, color: 'bg-purple-100 text-purple-700' },
};

const categories = [
  { id: 'all', label: '전체' },
  { id: 'notice', label: '공지사항' },
  { id: 'press', label: '보도자료' },
  { id: 'recruit', label: '채용공고' },
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

  return (
    <div className="min-h-full bg-white">
      {/* 헤더 */}
      <div className="bg-[#3071a5] text-white px-4 h-[60px] flex items-center">
        <span className="text-[14px] font-medium">NOTICE 미리보기</span>
      </div>

      <PageTitle title="NOTICE" subtitle="공지사항" />

      {/* 카테고리 탭 */}
      <div className="px-4 pb-3">
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? notices.length 
              : notices.filter(n => n.category === cat.id).length;
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

      {/* 게시글 목록 */}
      <div className="px-4 py-2 space-y-2">
        {sortedNotices.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] py-8 text-center">등록된 게시글이 없습니다.</p>
        ) : (
          sortedNotices.map((notice) => {
            const cat = categoryLabels[notice.category] || categoryLabels.notice;
            return (
              <div
                key={notice.id}
                className="bg-white rounded-[8px] border border-[#e5e7eb] p-3 hover:bg-[#f9fafb] transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* 썸네일 */}
                  {notice.thumbnail && (
                    <div className="w-[60px] h-[60px] rounded-[4px] overflow-hidden flex-shrink-0">
                      <img src={notice.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded ${cat.color}`}>
                        {cat.icon}
                        {cat.label}
                      </span>
                      {notice.is_pinned && <Pin size={12} className="text-[#f59e0b]" />}
                    </div>
                    <h3 className="text-[14px] font-medium text-[#1f2937] truncate">{notice.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#9ca3af]">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                      </span>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <span className="flex items-center gap-0.5 text-[11px] text-[#9ca3af]">
                          <Paperclip size={10} />
                          {notice.attachments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
