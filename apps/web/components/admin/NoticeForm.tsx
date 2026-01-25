'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Notice, NoticeInsert, Attachment } from '@/lib/types';
import { createNotice, updateNotice, uploadNoticeThumbnail, uploadAttachment, deleteAttachment } from '@/lib/notices';
import { ArrowLeft, Upload, X, Paperclip, Image, HelpCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import PWANoticePreview from '@/components/admin/PWANoticePreview';

interface NoticeFormProps {
  notice?: Notice;
  isEdit?: boolean;
}

const categoryOptions: { id: 'notice' | 'press' | 'recruit'; label: string }[] = [
  { id: 'notice', label: '공지사항' },
  { id: 'press', label: '언론자료' },
  { id: 'recruit', label: '기타' },
];

export default function NoticeForm({ notice, isEdit = false }: NoticeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({
    category: notice?.category || 'notice',
    title: notice?.title || '',
    content: notice?.content || '',
    thumbnail: notice?.thumbnail || '',
    attachments: notice?.attachments || [],
    link: notice?.link || '',
    is_published: notice?.is_published || false,
    is_pinned: notice?.is_pinned || false,
    order: notice?.order || 0,
  });

  // 미리보기용 Notice 객체
  const previewNotice: Notice = {
    id: notice?.id || 'preview',
    category: form.category as 'notice' | 'press' | 'recruit',
    title: form.title || '제목 없음',
    content: form.content,
    thumbnail: form.thumbnail,
    attachments: form.attachments,
    link: form.link,
    is_published: true,
    is_pinned: form.is_pinned,
    view_count: notice?.view_count || 0,
    order: form.order,
    created_at: notice?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadNoticeThumbnail(file);
      setForm(prev => ({ ...prev, thumbnail: url }));
    } catch (error) {
      console.error('썸네일 업로드 실패:', error);
      alert('썸네일 업로드에 실패했습니다.');
    }
  };

  // 본문에 이미지 삽입
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const url = await uploadNoticeThumbnail(file); // 같은 버킷 사용
      
      // 현재 커서 위치에 마크다운 이미지 삽입
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = form.content;
        const imageMarkdown = `\n![이미지](${url})\n`;
        const newContent = text.substring(0, start) + imageMarkdown + text.substring(end);
        setForm(prev => ({ ...prev, content: newContent }));
        
        // 커서 위치 업데이트
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
          textarea.focus();
        }, 0);
      } else {
        // textarea ref 없으면 끝에 추가
        setForm(prev => ({ ...prev, content: prev.content + `\n![이미지](${url})\n` }));
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const attachment = await uploadAttachment(file);
      setForm(prev => ({ ...prev, attachments: [...prev.attachments, attachment] }));
    } catch (error) {
      console.error('첨부파일 업로드 실패:', error);
      alert('첨부파일 업로드에 실패했습니다.');
    }
  };

  const handleRemoveAttachment = async (index: number) => {
    const attachment = form.attachments[index];
    if (!attachment) return;

    try {
      await deleteAttachment(attachment.url);
      setForm(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error('첨부파일 삭제 실패:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert('제목을 입력하세요.');
      return;
    }

    setLoading(true);

    try {
      const data: NoticeInsert = {
        category: form.category as 'notice' | 'press' | 'recruit',
        title: form.title,
        content: form.content || null,
        thumbnail: form.thumbnail || null,
        attachments: form.attachments,
        link: form.link || null,
        is_published: form.is_published,
        is_pinned: form.is_pinned,
        order: form.order,
      };

      if (isEdit && notice) {
        await updateNotice(notice.id, data);
      } else {
        await createNotice(data);
      }

      router.push('/admin/notices');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const preview = <PWANoticePreview notices={[previewNotice]} />;

  return (
    <AdminLayout preview={preview} activeTab="notice">
      <main className="p-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/notices')}
            className="p-2 hover:bg-[#f3f4f6] rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-[#6b7280]" />
          </button>
          <h1 className="text-[24px] font-bold text-[#1f2937]">
            {isEdit ? '게시글 수정' : '새 게시글'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">카테고리</h2>
            <div className="flex gap-3">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, category: cat.id }))}
                  className={`flex items-center gap-2 px-4 py-3 rounded-[8px] border transition-colors
                    ${form.category === cat.id
                      ? 'border-[#3071a5] bg-[#3071a5]/5 text-[#3071a5]'
                      : 'border-[#e5e7eb] text-[#6b7280] hover:border-[#3071a5]'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">기본 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">제목 *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="게시글 제목을 입력하세요"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[14px] text-[#374151]">내용 (마크다운 지원)</label>
                    <button
                      type="button"
                      onClick={() => setShowGuide(true)}
                      className="p-1 text-[#9ca3af] hover:text-[#3071a5] transition-colors"
                      title="마크다운 가이드"
                    >
                      <HelpCircle size={16} />
                    </button>
                  </div>
                  <label className={`inline-flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-[6px] cursor-pointer transition-colors
                    ${imageUploading 
                      ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed' 
                      : 'bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]'}`}
                  >
                    <Image size={14} />
                    {imageUploading ? '업로드 중...' : '이미지 삽입'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleContentImageUpload} 
                      disabled={imageUploading}
                      className="hidden" 
                    />
                  </label>
                </div>
                <textarea
                  ref={textareaRef}
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={12}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5] resize-none font-mono"
                  placeholder="마크다운 문법을 사용할 수 있습니다.&#10;&#10;# 제목&#10;## 소제목&#10;**굵게** *기울임*&#10;- 목록&#10;![이미지설명](이미지URL)"
                />
              </div>
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">외부 링크</label>
                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* 첨부파일 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">첨부파일</h2>
            
            {form.attachments.length > 0 && (
              <div className="space-y-2 mb-4">
                {form.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-[8px]">
                    <Paperclip size={16} className="text-[#6b7280]" />
                    <span className="flex-1 text-[14px] text-[#374151] truncate">{file.name}</span>
                    <span className="text-[12px] text-[#9ca3af]">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="p-1 text-[#9ca3af] hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="inline-flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] cursor-pointer hover:border-[#3071a5] hover:text-[#3071a5] transition-colors">
              <Paperclip size={16} />
              파일 첨부
              <input type="file" onChange={handleAttachmentUpload} className="hidden" />
            </label>
          </div>

          {/* 설정 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">설정</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleCheckbox}
                  className="w-5 h-5 rounded border-[#e5e7eb] text-[#3071a5] focus:ring-[#3071a5]"
                />
                <label className="text-[14px] text-[#374151]">공개</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_pinned"
                  checked={form.is_pinned}
                  onChange={handleCheckbox}
                  className="w-5 h-5 rounded border-[#e5e7eb] text-[#f59e0b] focus:ring-[#f59e0b]"
                />
                <label className="text-[14px] text-[#374151]">📌 상단 고정</label>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/notices')}
              className="px-6 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] hover:bg-[#f3f4f6] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#3071a5] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#265d8a] transition-colors disabled:opacity-50"
            >
              {loading ? '저장 중...' : (isEdit ? '수정' : '등록')}
            </button>
          </div>
        </form>

        {/* 마크다운 가이드 모달 */}
        {showGuide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGuide(false)}>
            <div className="bg-white rounded-[12px] w-[500px] max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                <h3 className="text-[18px] font-bold text-[#1f2937]">마크다운 가이드</h3>
                <button onClick={() => setShowGuide(false)} className="p-1 text-[#9ca3af] hover:text-[#1f2937]">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-[#e5e7eb]">
                      <th className="text-left py-2 text-[#6b7280] font-medium">입력</th>
                      <th className="text-left py-2 text-[#6b7280] font-medium">결과</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    <tr>
                      <td className="py-3 font-mono text-[#374151]"># 제목</td>
                      <td className="py-3 text-[20px] font-bold">제목</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">## 소제목</td>
                      <td className="py-3 text-[18px] font-bold">소제목</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">### 작은제목</td>
                      <td className="py-3 text-[16px] font-semibold">작은제목</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">**굵게**</td>
                      <td className="py-3"><strong>굵게</strong></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">*기울임*</td>
                      <td className="py-3"><em>기울임</em></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">~~취소선~~</td>
                      <td className="py-3"><s>취소선</s></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">[링크](URL)</td>
                      <td className="py-3"><span className="text-[#3071a5] underline">링크</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">- 목록</td>
                      <td className="py-3">• 목록</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">1. 번호목록</td>
                      <td className="py-3">1. 번호목록</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">&gt; 인용문</td>
                      <td className="py-3 border-l-4 border-[#3071a5] pl-2 text-[#6b7280]">인용문</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151]">---</td>
                      <td className="py-3"><hr className="border-[#e5e7eb]" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[#374151] text-[12px]">![설명](이미지URL)</td>
                      <td className="py-3 text-[#6b7280]">이미지 삽입</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-4 text-[13px] text-[#9ca3af]">
                  💡 이미지는 상단의 "이미지 삽입" 버튼으로 쉽게 추가할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
