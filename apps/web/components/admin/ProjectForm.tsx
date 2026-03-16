'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectInsert, GalleryItem } from '@/lib/types';
import { createProject, updateProject, uploadImage } from '@/lib/projects';
import { getYoutubeId } from '@/lib/utils';
import { ArrowLeft, Upload, X, Plus, Star, Play, Image, Monitor, Smartphone, Pencil, HelpCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import PWAPreview from '@/components/admin/PWAPreview';

interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean;
  allProjects?: Project[];
}

const categoryOptions = [
  { id: 'platform', label: '플랫폼' },
  { id: 'marketing', label: '마케팅' },
  { id: 'contents', label: '콘텐츠' },
  { id: 'etc', label: '기타' },
];

export default function ProjectForm({ project, isEdit = false, allProjects = [] }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [relatedSearch, setRelatedSearch] = useState('');
  const [showRelatedDropdown, setShowRelatedDropdown] = useState(false);
  
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    details: project?.details || '',
    thumbnail: project?.thumbnail || '',
    featured_thumbnail: project?.featured_thumbnail || '',
    categories: project?.categories || [],
    tags: project?.tags || [],
    client: project?.client || '',
    date_start: project?.date_start || '',
    date_end: project?.date_end || '',
    link: project?.link || '',
    gallery: project?.gallery || [],
    related_projects: project?.related_projects || [],
    is_published: project?.is_published || false,
    is_featured: project?.is_featured || false,
    has_detail: project?.has_detail ?? true,
    order: project?.order || 0,
  });

  // 갤러리 아이템 추가/수정 모달
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryItemType, setGalleryItemType] = useState<'hor' | 'ver' | 'img'>('hor');
  const [galleryItemUrl, setGalleryItemUrl] = useState('');
  const [galleryItemTitle, setGalleryItemTitle] = useState('');
  const [galleryItemDesc, setGalleryItemDesc] = useState('');
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null); // 수정 모드용

  // 미리보기용 프로젝트 객체
  const previewProject: Project = {
    id: project?.id || 'preview',
    title: form.title || '프로젝트명',
    description: form.description,
    content: form.content,
    details: form.details,
    thumbnail: form.thumbnail,
    featured_thumbnail: form.featured_thumbnail,
    categories: form.categories,
    tags: form.tags,
    client: form.client,
    date_start: form.date_start,
    date_end: form.date_end,
    link: form.link,
    gallery: form.gallery,
    related_projects: form.related_projects,
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

  // 갤러리 아이템 추가/수정
  const handleAddGalleryItem = async () => {
    if (!galleryItemUrl) return;

    if (editingGalleryIndex !== null) {
      // 수정 모드
      setForm(prev => ({
        ...prev,
        gallery: prev.gallery.map((item, i) => 
          i === editingGalleryIndex 
            ? { ...item, url: galleryItemUrl, title: galleryItemTitle, desc: galleryItemDesc }
            : item
        ),
      }));
    } else {
      // 추가 모드
      const newItem: GalleryItem = {
        type: galleryItemType,
        url: galleryItemUrl,
        title: galleryItemTitle,
        desc: galleryItemDesc,
        is_main: form.gallery.length === 0,
      };
      setForm(prev => ({ ...prev, gallery: [...prev.gallery, newItem] }));
    }

    setShowGalleryModal(false);
    setGalleryItemUrl('');
    setGalleryItemTitle('');
    setGalleryItemDesc('');
    setGalleryItemType('hor');
    setEditingGalleryIndex(null);
  };

  // 갤러리 아이템 수정 모달 열기
  const handleEditGalleryItem = (index: number) => {
    const item = form.gallery[index];
    if (!item || item.type === 'img') return; // 이미지는 수정 불가
    
    setEditingGalleryIndex(index);
    setGalleryItemType(item.type);
    setGalleryItemUrl(item.url);
    setGalleryItemTitle(item.title);
    setGalleryItemDesc(item.desc);
    setShowGalleryModal(true);
  };

  // 갤러리 이미지 직접 업로드
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'gallery');
      const newItem: GalleryItem = {
        type: 'img',
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
      if (prev.gallery[index]?.is_main && newGallery.length > 0 && newGallery[0]) {
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
        featured_thumbnail: form.featured_thumbnail || null,
        categories: form.categories,
        tags: form.tags,
        client: form.client || null,
        date_start: form.date_start || null,
        date_end: form.date_end || null,
        link: form.link || null,
        gallery: form.gallery,
        related_projects: form.related_projects,
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

  // 타입별 아이콘과 라벨
  const typeInfo: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    hor: { icon: <Monitor size={14} />, label: '가로영상', color: 'text-blue-500' },
    ver: { icon: <Smartphone size={14} />, label: '세로영상', color: 'text-purple-500' },
    img: { icon: <Image size={14} />, label: '이미지', color: 'text-green-500' },
    youtube: { icon: <Monitor size={14} />, label: '영상', color: 'text-blue-500' },
    image: { icon: <Image size={14} />, label: '이미지', color: 'text-green-500' },
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
                <label className="block text-[14px] text-[#374151] mb-1">한 줄 설명 (PWA용)</label>
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
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-[14px] text-[#374151]">Description (마크다운 지원)</label>
                  <button
                    type="button"
                    onClick={() => setShowGuide(true)}
                    title="마크다운 가이드"
                    className="text-[#9ca3af] hover:text-[#3071a5]"
                  >
                    <HelpCircle size={16} />
                  </button>
                </div>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5] resize-none"
                  placeholder="프로젝트 상세 설명 (마크다운 문법 사용 가능)"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-[14px] text-[#374151]">Details (마크다운 지원)</label>
                  <button
                    type="button"
                    onClick={() => setShowGuide(true)}
                    title="마크다운 가이드"
                    className="text-[#9ca3af] hover:text-[#3071a5]"
                  >
                    <HelpCircle size={16} />
                  </button>
                </div>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5] resize-none"
                  placeholder="제작 정보 (마크다운 문법 사용 가능)"
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isComposing) {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
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
            {/* 링크 */}
            <div className="mt-4">
              <label className="block text-[14px] text-[#374151] mb-1">바로가기 링크 (선택)</label>
              <input
                type="text"
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* 썸네일 (리스트용 1:1) */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">썸네일 (리스트용 1:1)</h2>
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

          {/* 대표 프로젝트용 썸네일 (3:2) */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-2">대표 프로젝트용 썸네일 (3:2)</h2>
            <p className="text-[13px] text-[#9ca3af] mb-4">⭐ 대표 프로젝트 체크 시 이 썸네일이 사용됩니다.</p>
            {form.featured_thumbnail ? (
              <div className="relative w-[300px] h-[200px]">
                <img src={form.featured_thumbnail} alt="대표 썸네일" className="w-full h-full object-cover rounded-[8px]" />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, featured_thumbnail: '' }))}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-[300px] h-[200px] border-2 border-dashed border-[#e5e7eb] rounded-[8px] cursor-pointer hover:border-[#3071a5] transition-colors">
                <Upload size={24} className="text-[#9ca3af] mb-2" />
                <span className="text-[13px] text-[#9ca3af]">3:2 비율 이미지 업로드</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadImage(file, 'featured');
                      setForm(prev => ({ ...prev, featured_thumbnail: url }));
                    } catch (error) {
                      console.error('썸네일 업로드 실패:', error);
                      alert('썸네일 업로드에 실패했습니다.');
                    }
                  }} 
                  className="hidden" 
                />
              </label>
            )}
          </div>

          {/* 갤러리 */}
          <div className="bg-white rounded-[12px] p-6">
            <h2 className="text-[16px] font-semibold text-[#1f2937] mb-4">프로젝트 갤러리</h2>
            <p className="text-[13px] text-[#9ca3af] mb-4">★ 표시된 항목이 대표 콘텐츠로 메인에 표시됩니다.</p>
            
            {/* 갤러리 아이템 목록 */}
            <div className="space-y-3 mb-4">
              {form.gallery.map((item, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 border rounded-[8px] ${item.is_main ? 'border-[#3071a5] bg-[#3071a5]/5' : 'border-[#e5e7eb]'}`}>
                  {/* 썸네일 */}
                  <div className="w-[80px] h-[45px] bg-[#f3f4f6] rounded overflow-hidden flex-shrink-0">
                    {(item.type === 'hor' || item.type === 'ver') ? (
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
                      <span className={typeInfo[item.type]?.color || 'text-gray-500'}>{typeInfo[item.type]?.icon}</span>
                      <span className="text-[11px] text-[#9ca3af]">{typeInfo[item.type]?.label || item.type}</span>
                      <span className="text-[14px] font-medium text-[#1f2937] truncate">{item.title || '제목 없음'}</span>
                      {item.is_main && <Star size={14} className="text-[#f59e0b] fill-[#f59e0b]" />}
                    </div>
                    {item.desc && <p className="text-[12px] text-[#9ca3af] truncate">{item.desc}</p>}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-1">
                    {/* 영상만 수정 가능 */}
                    {(item.type === 'hor' || item.type === 'ver') && (
                      <button
                        type="button"
                        onClick={() => handleEditGalleryItem(index)}
                        className="p-1.5 text-[#9ca3af] hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="수정"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
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
                      title="삭제"
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
                onClick={() => { setGalleryItemType('hor'); setShowGalleryModal(true); }}
                className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Monitor size={16} />
                가로영상
              </button>
              <button
                type="button"
                onClick={() => { setGalleryItemType('ver'); setShowGalleryModal(true); }}
                className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] hover:border-purple-500 hover:text-purple-500 transition-colors"
              >
                <Smartphone size={16} />
                세로영상
              </button>
              <label className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] hover:border-green-500 hover:text-green-500 transition-colors cursor-pointer">
                <Image size={16} />
                이미지
                <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Related Projects (대표 프로젝트용) */}
          {form.is_featured && (
            <div className="bg-white rounded-[12px] p-6">
              <h2 className="text-[16px] font-semibold text-[#1f2937] mb-2">연관 프로젝트</h2>
              <p className="text-[13px] text-[#9ca3af] mb-4">대표 프로젝트 우측에 표시될 연관 프로젝트를 선택하세요 (최대 5개)</p>
              
              {/* 선택된 프로젝트 */}
              {form.related_projects.length > 0 && (
                <div className="space-y-2 mb-4">
                  {form.related_projects.map((relatedId) => {
                    const relatedProject = allProjects.find(p => p.id === relatedId);
                    return (
                      <div key={relatedId} className="flex items-center justify-between px-3 py-2 bg-[#f3f4f6] rounded-[8px]">
                        <div className="flex items-center gap-3">
                          {relatedProject?.thumbnail && (
                            <img src={relatedProject.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                          )}
                          <span className="text-[13px] text-[#374151]">
                            {relatedProject?.title || `ID: ${relatedId.slice(0, 8)}...`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({
                            ...prev,
                            related_projects: prev.related_projects.filter(id => id !== relatedId)
                          }))}
                          className="text-[#9ca3af] hover:text-[#ef4444]"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* 프로젝트 검색 */}
              {form.related_projects.length < 5 && (
                <div className="relative">
                  <input
                    type="text"
                    value={relatedSearch}
                    onChange={(e) => {
                      setRelatedSearch(e.target.value);
                      setShowRelatedDropdown(e.target.value.length > 0);
                    }}
                    onFocus={() => relatedSearch.length > 0 && setShowRelatedDropdown(true)}
                    className="w-full px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                    placeholder="프로젝트 제목 또는 클라이언트로 검색..."
                  />
                  
                  {/* 드롭다운 */}
                  {showRelatedDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto z-10">
                      {allProjects
                        .filter(p => 
                          p.id !== project?.id && 
                          !form.related_projects.includes(p.id) &&
                          (p.title.toLowerCase().includes(relatedSearch.toLowerCase()) ||
                           p.client?.toLowerCase().includes(relatedSearch.toLowerCase()))
                        )
                        .slice(0, 10)
                        .map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                related_projects: [...prev.related_projects, p.id]
                              }));
                              setRelatedSearch('');
                              setShowRelatedDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#f3f4f6] text-left transition-colors"
                          >
                            {p.thumbnail ? (
                              <img src={p.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-[#e5e7eb]" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-[#374151] truncate">{p.title}</p>
                              {p.client && <p className="text-[11px] text-[#9ca3af] truncate">{p.client}</p>}
                            </div>
                          </button>
                        ))
                      }
                      {allProjects.filter(p => 
                        p.id !== project?.id && 
                        !form.related_projects.includes(p.id) &&
                        (p.title.toLowerCase().includes(relatedSearch.toLowerCase()) ||
                         p.client?.toLowerCase().includes(relatedSearch.toLowerCase()))
                      ).length === 0 && (
                        <div className="px-3 py-2 text-[13px] text-[#9ca3af]">검색 결과 없음</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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

      {/* 갤러리 아이템 추가/수정 모달 */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[12px] p-6 w-[400px]">
            <h3 className="text-[16px] font-semibold text-[#1f2937] mb-4">
              {editingGalleryIndex !== null 
                ? (galleryItemType === 'hor' ? '가로 영상 수정' : '세로 영상 수정')
                : (galleryItemType === 'hor' ? '가로 영상 추가' : galleryItemType === 'ver' ? '세로 영상 추가' : '이미지 추가')
              }
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">유튜브 URL</label>
                <input
                  type="text"
                  value={galleryItemUrl}
                  onChange={(e) => setGalleryItemUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-[14px] text-[#374151] mb-1">제목 (선택)</label>
                <input
                  type="text"
                  value={galleryItemTitle}
                  onChange={(e) => setGalleryItemTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
                  placeholder="영상 제목"
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
              {galleryItemUrl && getYoutubeId(galleryItemUrl) && (
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
                onClick={() => {
                  setShowGalleryModal(false);
                  setEditingGalleryIndex(null);
                  setGalleryItemUrl('');
                  setGalleryItemTitle('');
                  setGalleryItemDesc('');
                }}
                className="px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="px-4 py-2 bg-[#3071a5] text-white rounded-[8px] text-[14px]"
              >
                {editingGalleryIndex !== null ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
