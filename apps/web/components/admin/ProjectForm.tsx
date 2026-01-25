'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectInsert, GalleryItem } from '@/lib/types';
import { createProject, updateProject, uploadImage } from '@/lib/projects';
import { ArrowLeft, Upload, X, Plus, Star, Play, Image } from 'lucide-react';
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
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    details: project?.details || '',
    thumbnail: project?.thumbnail || '',
    categories: project?.categories || [],
    tags: project?.tags || [],
    client: project?.client || '',
    date_start: project?.date_start || '',
    date_end: project?.date_end || '',
    link: project?.link || '',
    gallery: project?.gallery || [],
    is_published: project?.is_published || false,
    is_featured: project?.is_featured || false,
    has_detail: project?.has_detail ?? true,
    order: project?.order || 0,
  });

  // 갤러리 아이템 추가 모달
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryItemType, setGalleryItemType] = useState<'youtube' | 'image'>('youtube');
  const [galleryItemUrl, setGalleryItemUrl] = useState('');
  const [galleryItemTitle, setGalleryItemTitle] = useState('');
  const [galleryItemDesc, setGalleryItemDesc] = useState('');

  // 미리보기용 프로젝트 객체
  const previewProject: Project = {
    id: project?.id || 'preview',
    title: form.title || '프로젝트명',
    description: form.description,
    content: form.content,
    details: form.details,
    thumbnail: form.thumbnail,
    categories: form.categories,
    tags: form.tags,
    client: form.client,
    date_start: form.date_start,
    date_end: form.date_end,
    link: form.link,
    gallery: form.gallery,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

  // 갤러리 아이템 추가
  const handleAddGalleryItem = async () => {
    if (!galleryItemUrl) return;

    const newItem: GalleryItem = {
      type: galleryItemType,
      url: galleryItemUrl,
      title: galleryItemTitle,
      desc: galleryItemDesc,
      is_main: form.gallery.length === 0, // 첫 번째 아이템은 자동으로 대표
    };

    setForm(prev => ({ ...prev, gallery: [...prev.gallery, newItem] }));
    setShowGalleryModal(false);
    setGalleryItemUrl('');
    setGalleryItemTitle('');
    setGalleryItemDesc('');
  };

  // 갤러리 이미지 직접 업로드
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'gallery');
      const newItem: GalleryItem = {
        type: 'image',
        url: url,
        title: '',
        desc: '',
        is_main: form.gallery.length === 0,
      };
      setForm(prev => ({ ...prev, gallery: [...prev.gallery, newItem] }));
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 갤러리 아이템 삭제
  const handleRemoveGalleryItem = (index: number) => {
    setForm(prev => {
      const newGallery = prev.gallery.filter((_, i) => i !== index);
      // 삭제된 게 대표였으면 첫 번째를 대표로
      if (prev.gallery[index]?.is_main && newGallery.length > 0) {
        newGallery[0] = { ...newGallery[0], is_main: true };
      }
      return { ...prev, gallery: newGallery };
    });
  };

  // 대표 설정
  const handleSetMain = (index: number) => {
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.map((item, i) => ({
        ...item,
        is_main: i === index,
      })),
    }));
  };

  // 유튜브 ID 추출
  const getYoutubeId = (url: string) => {
    return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/)?.[1];
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
        categories: form.categories,
        tags: form.tags,
        client: form.client || null,
        date_start: form.date_start || null,
        date_end: form.date_end || null,
        link: form.link || null,
        gallery: form.gallery,
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
            className="p-2 hover:bg-[#f3f4f6] rounded-[8px] transition-colors"
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-[800px]">
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
                  placeholder="프로젝트명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#374151] mb-1">한 줄 설명</label>
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
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                placeholder="태그 입력 후 Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#3071a5] text-white rounded-[8px] text-[14px]"
              >
                추가
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#f3f4f6] rounded-full text-[13px] text-[#374151]">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[#9ca3af] hover:text-[#ef4444]">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 클라이언트 & 날짜 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">클라이언트 & 날짜</h2>
            <div className="grid grid-cols-3 gap-4">
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
                <label className="block text-[14px] text-[#374151] mb-1">시작일</label>
                <input
                  type="text"
                  name="date_start"
                  value={form.date_start}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="예: 2025/04"
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

          {/* 썸네일 (리스트용) */}
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

          {/* 갤러리 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">갤러리 (상세페이지용)</h2>
            <p className="text-[13px] text-[#9ca3af] mb-4">★ 표시된 항목이 대표 콘텐츠로 메인에 표시됩니다.</p>
            
            {/* 갤러리 아이템 목록 */}
            <div className="space-y-3 mb-4">
              {form.gallery.map((item, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 border rounded-[8px] ${item.is_main ? 'border-[#3071a5] bg-[#3071a5]/5' : 'border-[#e5e7eb]'}`}>
                  {/* 썸네일 */}
                  <div className="w-[80px] h-[45px] bg-[#f3f4f6] rounded overflow-hidden flex-shrink-0">
                    {item.type === 'youtube' ? (
                      <img 
                        src={`https://img.youtube.com/vi/${getYoutubeId(item.url)}/mqdefault.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.type === 'youtube' ? <Play size={14} className="text-red-500" /> : <Image size={14} className="text-[#3071a5]" />}
                      <span className="text-[14px] font-medium text-[#1f2937] truncate">{item.title || (item.type === 'youtube' ? '유튜브 영상' : '이미지')}</span>
                      {item.is_main && <Star size={14} className="text-[#f59e0b] fill-[#f59e0b]" />}
                    </div>
                    {item.desc && <p className="text-[12px] text-[#9ca3af] truncate">{item.desc}</p>}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-1">
                    {!item.is_main && (
                      <button
                        type="button"
                        onClick={() => handleSetMain(index)}
                        className="p-1.5 text-[#9ca3af] hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded transition-colors"
                        title="대표로 설정"
                      >
                        <Star size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(index)}
                      className="p-1.5 text-[#9ca3af] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 추가 버튼 */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setGalleryItemType('youtube'); setShowGalleryModal(true); }}
                className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] hover:border-[#3071a5] hover:text-[#3071a5] transition-colors"
              >
                <Play size={16} />
                유튜브 추가
              </button>
              <label className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] hover:border-[#3071a5] hover:text-[#3071a5] transition-colors cursor-pointer">
                <Image size={16} />
                이미지 추가
                <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* 기타 설정 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">기타 설정</h2>
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

      {/* 갤러리 아이템 추가 모달 */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[12px] p-6 w-[400px]">
            <h3 className="text-[16px] font-semibold text-[#1f2937] mb-4">
              {galleryItemType === 'youtube' ? '유튜브 영상 추가' : '이미지 추가'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">
                  {galleryItemType === 'youtube' ? '유튜브 URL' : '이미지 URL'}
                </label>
                <input
                  type="text"
                  value={galleryItemUrl}
                  onChange={(e) => setGalleryItemUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder={galleryItemType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                />
              </div>
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">제목 (선택)</label>
                <input
                  type="text"
                  value={galleryItemTitle}
                  onChange={(e) => setGalleryItemTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="영상/이미지 제목"
                />
              </div>
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">설명 (선택)</label>
                <input
                  type="text"
                  value={galleryItemDesc}
                  onChange={(e) => setGalleryItemDesc(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="FHD | 16:9 | 2분 30초"
                />
              </div>
              {/* 유튜브 미리보기 */}
              {galleryItemType === 'youtube' && galleryItemUrl && getYoutubeId(galleryItemUrl) && (
                <div className="w-full aspect-video bg-[#f3f4f6] rounded-[8px] overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${getYoutubeId(galleryItemUrl)}/maxresdefault.jpg`}
                    alt="미리보기"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(galleryItemUrl)}/hqdefault.jpg`;
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="px-4 py-2 bg-[#3071a5] text-white rounded-[8px] text-[14px]"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
