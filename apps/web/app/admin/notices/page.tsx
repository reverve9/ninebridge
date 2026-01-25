'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import PWANoticePreview from '@/components/admin/PWANoticePreview';
import { Notice } from '@/lib/types';
import { getAllNotices, deleteNotice, swapNoticeOrder } from '@/lib/notices';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Pin, ExternalLink, FileText, Briefcase, Megaphone } from 'lucide-react';

const categoryLabels: Record<'notice' | 'press' | 'recruit', { label: string; icon: React.ReactNode; color: string }> = {
  notice: { label: '공지사항', icon: <Megaphone size={14} />, color: 'bg-blue-100 text-blue-700' },
  press: { label: '보도자료', icon: <FileText size={14} />, color: 'bg-green-100 text-green-700' },
  recruit: { label: '채용공고', icon: <Briefcase size={14} />, color: 'bg-purple-100 text-purple-700' },
};

export default function AdminNoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const data = await getAllNotices();
      setNotices(data);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteNotice(id);
      setNotices(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = notices[index];
    const prev = notices[index - 1];
    if (!current || !prev) return;
    
    try {
      await swapNoticeOrder(current.id, current.order, prev.id, prev.order);
      await loadNotices();
    } catch (error) {
      console.error('순서 변경 실패:', error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === notices.length - 1) return;
    const current = notices[index];
    const next = notices[index + 1];
    if (!current || !next) return;
    
    try {
      await swapNoticeOrder(current.id, current.order, next.id, next.order);
      await loadNotices();
    } catch (error) {
      console.error('순서 변경 실패:', error);
    }
  };

  const filteredNotices = activeCategory === 'all' 
    ? notices 
    : notices.filter(n => n.category === activeCategory);

  const preview = <PWANoticePreview notices={notices.filter(n => n.is_published)} />;

  return (
    <AdminLayout preview={preview} activeTab="notice">
      <main className="p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-bold text-[#1f2937]">게시판 관리</h1>
            <p className="text-[14px] text-[#6b7280] mt-1">공지사항, 보도자료, 채용공고를 관리합니다.</p>
          </div>
          <button
            onClick={() => router.push('/admin/notices/new')}
            className="flex items-center gap-2 px-4 py-2 bg-[#3071a5] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#265d8a] transition-colors"
          >
            <Plus size={18} />
            새 게시글
          </button>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-[14px] rounded-[8px] transition-colors
              ${activeCategory === 'all' ? 'bg-[#1f2937] text-white' : 'bg-white text-[#6b7280] border border-[#e5e7eb]'}`}
          >
            전체 ({notices.length})
          </button>
          {Object.entries(categoryLabels).map(([key, { label, icon }]) => {
            const count = notices.filter(n => n.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 text-[14px] rounded-[8px] transition-colors
                  ${activeCategory === key ? 'bg-[#1f2937] text-white' : 'bg-white text-[#6b7280] border border-[#e5e7eb]'}`}
              >
                {icon}
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white rounded-[12px] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#9ca3af]">로딩 중...</div>
          ) : filteredNotices.length === 0 ? (
            <div className="p-8 text-center text-[#9ca3af]">등록된 게시글이 없습니다.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                <tr>
                  <th className="px-4 py-3 text-left text-[12px] font-medium text-[#6b7280] w-[60px]">순서</th>
                  <th className="px-4 py-3 text-left text-[12px] font-medium text-[#6b7280] w-[100px]">카테고리</th>
                  <th className="px-4 py-3 text-left text-[12px] font-medium text-[#6b7280]">제목</th>
                  <th className="px-4 py-3 text-center text-[12px] font-medium text-[#6b7280] w-[80px]">상태</th>
                  <th className="px-4 py-3 text-center text-[12px] font-medium text-[#6b7280] w-[120px]">작성일</th>
                  <th className="px-4 py-3 text-center text-[12px] font-medium text-[#6b7280] w-[120px]">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.map((notice, index) => {
                  const cat = categoryLabels[notice.category];
                  return (
                    <tr key={notice.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-[#9ca3af] hover:text-[#3071a5] disabled:opacity-30"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === filteredNotices.length - 1}
                            className="p-1 text-[#9ca3af] hover:text-[#3071a5] disabled:opacity-30"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-[12px] rounded ${cat.color}`}>
                          {cat.icon}
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {notice.is_pinned && <Pin size={14} className="text-[#f59e0b]" />}
                          <span className="text-[14px] text-[#1f2937]">{notice.title}</span>
                          {notice.link && <ExternalLink size={14} className="text-[#9ca3af]" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[12px] px-2 py-1 rounded ${notice.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {notice.is_published ? '공개' : '비공개'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-[13px] text-[#6b7280]">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/notices/${notice.id}`)}
                            className="p-2 text-[#6b7280] hover:text-[#3071a5] hover:bg-[#f3f4f6] rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(notice.id)}
                            className="p-2 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
