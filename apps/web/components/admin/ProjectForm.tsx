'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectInsert } from '@/lib/types';
import { createProject, updateProject, uploadImage } from '@/lib/projects';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import PWAPreview from '@/components/admin/PWAPreview';

interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean;
}

const categoryOptions = [
  { id: 'platform', label: '플랫폼' },
  { id: 'marketing', label: '마케팅' },
  { id: 'contents', label: '콘텐츠' },
  { id: 'etc', label: '기타' },
];

export default function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [mainVisualType, setMainVisualType] = useState<'image' | 'youtube'>(
    project?.youtube_url ? 'youtube' : 'image'
  );
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    details: project?.details || '',
    thumbnail: project?.thumbnail || '',
    main_visual: project?.main_visual || '',
    youtube_url: project?.youtube_url || '',
    categories: project?.categories || [],
    tags: project?.tags || [],
    client: project?.client || '',
    date_start: project?.date_start || '',
    date_end: project?.date_end || '',
    link: project?.link || '',
    images: project?.images || [],
    is_published: project?.is_published || false,
    is_featured: project?.is_featured || false,
    has_detail: project?.has_detail ?? true,
    order: project?.order || 0,
  });

  // 미리보기용 프로젝트 객체
  const previewProject: Project = {
    id: project?.id || 'preview',
    title: form.title || '프로젝트명',
    description: form.description,
    content: form.content,
    details: form.details,
    thumbnail: form.thumbnail,
    main_visual: form.main_visual,
    youtube_url: form.youtube_url,
    categories: form.categories,
    tags: form.tags,
    client: form.client,
    date_start: form.date_start,
    date_end: form.date_end,
    link: form.link,
    images: form.images,
    is_published: true,
    is_featured: form.is_featured,
    has_detail: form.has_detail,
    order: form.order,
    created_at: '',
    updated_at: '',
  };

  // 태그 추가
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'thumbnails');
      setForm(prev => ({ ...prev, thumbnail: url }));
    } catch (error) {
      console.error('썸네일 업로드 실패:', error);
      alert('썸네일 업로드에 실패했습니다.');
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `gallery/${Date.now()}_${file.name}`;
        const url = await uploadImage(file, path);
        urls.push(url);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert('프로젝트명을 입력하세요.');
      return;
    }

    setLoading(true);

    try {
      const data: ProjectInsert = {
        title: form.title,
        description: form.description || null,
        content: form.content || null,
        details: form.details || null,
        thumbnail: form.thumbnail || null,
        main_visual: mainVisualType === 'image' ? (form.main_visual || null) : null,
        youtube_url: mainVisualType === 'youtube' ? (form.youtube_url || null) : null,
        categories: form.categories,
        tags: form.tags,
        client: form.client || null,
        date_start: form.date_start || null,
        date_end: form.date_end || null,
        link: form.link || null,
        images: form.images,
        is_published: form.is_published,
        is_featured: form.is_featured,
        has_detail: form.has_detail,
        order: form.order,
      };

      if (isEdit && project) {
        await updateProject(project.id, data);
      } else {
        await createProject(data);
      }

      router.push('/admin/projects');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      preview={<PWAPreview projects={[previewProject]} selectedProject={previewProject} onSelectProject={() => {}} />}
    >
      {/* 헤더 */}
      <header className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/projects')}
            className="p-2 hover:bg-[#f3f4f6] rounded-[6px] transition-colors"
          >
            <ArrowLeft size={20} className="text-[#6b7280]" />
          </button>
          <h1 className="text-[20px] font-bold text-[#1f2937]">
            {isEdit ? '프로젝트 수정' : '새 프로젝트'}
          </h1>
        </div>
      </header>

      {/* 폼 */}
      <main className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">기본 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">프로젝트명 *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="프로젝트명 입력"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#374151] mb-1">클라이언트</label>
                <input
                  type="text"
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="클라이언트명"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#374151] mb-1">짧은 설명 (카드용)</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="한 줄 설명"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#374151] mb-1">상세 설명</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5] resize-none"
                  placeholder="프로젝트 상세 설명"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#374151] mb-1">Details (제작 정보)</label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5] resize-none"
                  placeholder="해상도: 1920x1080&#10;길이: 2분 30초&#10;비율: 16:9"
                />
              </div>
            </div>
          </div>

          {/* 카테고리 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">카테고리</h2>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-4 py-2 rounded-[8px] text-[14px] border transition-colors
                    ${form.categories.includes(cat.id)
                      ? 'bg-[#3071a5] text-white border-[#3071a5]'
                      : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#3071a5]'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 태그 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">태그</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                placeholder="태그 입력 후 Enter 또는 추가 버튼"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#3071a5] text-white rounded-[8px] text-[14px] hover:bg-[#265d8a] transition-colors"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#f3f4f6] text-[#374151] rounded-full text-[13px]"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#9ca3af] hover:text-[#ef4444]"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {form.tags.length === 0 && (
                <p className="text-[13px] text-[#9ca3af]">태그를 추가해주세요 (예: 라이브커머스, 네이버, 식품)</p>
              )}
            </div>
          </div>

          {/* 날짜 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">날짜</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">시작일</label>
                <input
                  type="text"
                  name="date_start"
                  value={form.date_start}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="예: 2025/04 또는 2025/04/15"
                />
              </div>
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">종료일 (선택)</label>
                <input
                  type="text"
                  name="date_end"
                  value={form.date_end}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="예: 2025/06"
                />
              </div>
            </div>
          </div>

          {/* 썸네일 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">썸네일 (리스트용)</h2>
            {form.thumbnail ? (
              <div className="relative w-[200px] h-[200px]">
                <img src={form.thumbnail} alt="썸네일" className="w-full h-full object-cover rounded-[8px]" />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, thumbnail: '' }))}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-[200px] h-[200px] border-2 border-dashed border-[#e5e7eb] rounded-[8px] cursor-pointer hover:border-[#3071a5] transition-colors">
                <Upload size={24} className="text-[#9ca3af] mb-2" />
                <span className="text-[13px] text-[#9ca3af]">이미지 업로드</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* 메인 비주얼 (상세페이지용) */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">메인 비주얼 (상세페이지용, 16:9)</h2>
            
            {/* 타입 선택 */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mainVisualType"
                  checked={mainVisualType === 'image'}
                  onChange={() => setMainVisualType('image')}
                  className="w-4 h-4 text-[#3071a5]"
                />
                <span className="text-[14px] text-[#374151]">이미지 업로드</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mainVisualType"
                  checked={mainVisualType === 'youtube'}
                  onChange={() => setMainVisualType('youtube')}
                  className="w-4 h-4 text-[#3071a5]"
                />
                <span className="text-[14px] text-[#374151]">유튜브 링크</span>
              </label>
            </div>

            {/* 이미지 업로드 */}
            {mainVisualType === 'image' && (
              <>
                {form.main_visual ? (
                  <div className="relative w-full max-w-[400px] aspect-video">
                    <img src={form.main_visual} alt="메인 비주얼" className="w-full h-full object-cover rounded-[8px]" />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, main_visual: '' }))}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-[400px] aspect-video border-2 border-dashed border-[#e5e7eb] rounded-[8px] cursor-pointer hover:border-[#3071a5] transition-colors">
                    <Upload size={24} className="text-[#9ca3af] mb-2" />
                    <span className="text-[13px] text-[#9ca3af]">16:9 이미지 업로드</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file, 'main-visuals');
                          if (url) setForm(prev => ({ ...prev, main_visual: url }));
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                )}
              </>
            )}

            {/* 유튜브 링크 */}
            {mainVisualType === 'youtube' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.youtube_url}
                  onChange={(e) => setForm(prev => ({ ...prev, youtube_url: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {form.youtube_url && (
                  <div className="w-full max-w-[400px] aspect-video bg-[#f3f4f6] rounded-[8px] overflow-hidden">
                    <img 
                      src={`https://img.youtube.com/vi/${form.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1]}/maxresdefault.jpg`}
                      alt="유튜브 썸네일"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${form.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1]}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 갤러리 이미지 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">갤러리 이미지</h2>
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, index) => (
                <div key={index} className="relative w-[120px] h-[120px]">
                  <img src={url} alt={`갤러리 ${index + 1}`} className="w-full h-full object-cover rounded-[8px]" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-[120px] h-[120px] border-2 border-dashed border-[#e5e7eb] rounded-[8px] cursor-pointer hover:border-[#3071a5] transition-colors">
                <Plus size={20} className="text-[#9ca3af]" />
                <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* 기타 설정 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">기타 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">외부 링크</label>
                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="https://"
                />
              </div>

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
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleCheckbox}
                  className="w-5 h-5 rounded border-[#e5e7eb] text-[#f59e0b] focus:ring-[#f59e0b]"
                />
                <label className="text-[14px] text-[#374151]">⭐ 대표 프로젝트</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="has_detail"
                  checked={form.has_detail}
                  onChange={handleCheckbox}
                  className="w-5 h-5 rounded border-[#e5e7eb] text-[#10b981] focus:ring-[#10b981]"
                />
                <label className="text-[14px] text-[#374151]">📄 상세 페이지 사용</label>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
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
      </main>
    </AdminLayout>
  );
}
