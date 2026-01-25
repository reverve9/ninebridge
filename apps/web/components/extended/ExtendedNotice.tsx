'use client';

import React, { useState, useEffect } from 'react';
import { Notice } from '@/lib/types';
import { getPublishedNotices, incrementViewCount } from '@/lib/notices';
import { Pin, FileText, Briefcase, Megaphone, Paperclip, ExternalLink, ChevronDown, Eye } from 'lucide-react';

const categoryConfig: Record<'notice' | 'press' | 'recruit', { label: string; icon: React.ReactNode; color: string }> = {
  notice: { label: '공지사항', icon: <Megaphone size={18} />, color: 'text-blue-600' },
  press: { label: '보도자료', icon: <FileText size={18} />, color: 'text-green-600' },
  recruit: { label: '채용공고', icon: <Briefcase size={18} />, color: 'text-purple-600' },
};

export default function ExtendedNotice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  // 카테고리별 그룹핑
  const groupedNotices = {
    notice: notices.filter(n => n.category === 'notice'),
    press: notices.filter(n => n.category === 'press'),
    recruit: notices.filter(n => n.category === 'recruit'),
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

  const handleToggle = async (notice: Notice) => {
    if (notice.link) {
      window.open(notice.link, '_blank');
      return;
    }

    if (expandedId === notice.id) {
      setExpandedId(null);
    } else {
      // 조회수 증가
      await incrementViewCount(notice.id);
      setNotices(prev => prev.map(n => 
        n.id === notice.id ? { ...n, view_count: (n.view_count || 0) + 1 } : n
      ));
      setExpandedId(notice.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#9ca3af]">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-[700px] mx-auto space-y-6">
        {(['notice', 'press', 'recruit'] as const).map((category) => {
          const config = categoryConfig[category];
          const items = groupedNotices[category];
          
          if (items.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
              {/* 카테고리 헤더 */}
              <div className={`flex items-center gap-2 px-5 py-4 border-b border-[#e5e7eb] bg-[#f9fafb] ${config.color}`}>
                {config.icon}
                <h2 className="text-[16px] font-semibold">{config.label}</h2>
                <span className="text-[13px] text-[#9ca3af] ml-1">({items.length})</span>
              </div>

              {/* 게시글 리스트 */}
              <div>
                {items.map((notice, index) => {
                  const isExpanded = expandedId === notice.id;
                  const isLast = index === items.length - 1;

                  return (
                    <div key={notice.id} className={!isLast ? 'border-b border-[#e5e7eb]' : ''}>
                      {/* 게시글 헤더 (클릭 영역) */}
                      <button
                        onClick={() => handleToggle(notice)}
                        className="w-full px-5 py-4 flex items-center gap-3 hover:bg-[#f9fafb] transition-colors text-left"
                      >
                        {/* 펼침 아이콘 */}
                        <ChevronDown 
                          size={18} 
                          className={`text-[#9ca3af] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        />

                        {/* 고정 핀 */}
                        {notice.is_pinned && <Pin size={14} className="text-[#f59e0b] flex-shrink-0" />}

                        {/* 제목 */}
                        <span className="flex-1 text-[14px] text-[#1f2937] truncate">
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

                        {/* 조회수 */}
                        <span className="flex items-center gap-1 text-[#9ca3af] flex-shrink-0 w-[60px]">
                          <Eye size={14} />
                          <span className="text-[12px]">{notice.view_count || 0}</span>
                        </span>

                        {/* 날짜 */}
                        <span className="text-[13px] text-[#9ca3af] flex-shrink-0 w-[140px] text-right">
                          {formatDateTime(notice.created_at)}
                        </span>
                      </button>

                      {/* 펼침 내용 */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 bg-[#fafafa] border-t border-[#e5e7eb]">
                          {/* 내용 */}
                          {notice.content && (
                            <div className="text-[14px] text-[#374151] whitespace-pre-wrap leading-relaxed mb-4">
                              {notice.content}
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

        {notices.length === 0 && (
          <div className="text-center py-12 text-[#9ca3af]">
            등록된 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
