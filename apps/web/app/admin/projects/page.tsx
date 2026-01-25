'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Project } from '@/lib/types';
import { getAllProjects, deleteProject, swapProjectOrder } from '@/lib/projects';
import { Plus, Edit, Trash2, LogOut, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import PWAPreview from '@/components/admin/PWAPreview';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    checkAuth();
    loadProjects();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin');
    }
  };

  const loadProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('프로젝트 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 프로젝트를 삭제하시겠습니까?`)) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = projects[index];
    const target = projects[index - 1];
    
    try {
      await swapProjectOrder(current.id, current.order, target.id, target.order);
      await loadProjects();
    } catch (error) {
      console.error('순서 변경 실패:', error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === projects.length - 1) return;
    const current = projects[index];
    const target = projects[index + 1];
    
    try {
      await swapProjectOrder(current.id, current.order, target.id, target.order);
      await loadProjects();
    } catch (error) {
      console.error('순서 변경 실패:', error);
    }
  };

  const formatDate = (start: string | null, end: string | null) => {
    if (!start) return '-';
    if (!end) return start;
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <AdminLayout showPreview={false}>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-[#6b7280]">로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      preview={<PWAPreview projects={projects} selectedProject={selectedProject} onSelectProject={setSelectedProject} />}
    >
      {/* 헤더 */}
      <header className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-[#1f2937]">프로젝트 관리</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/projects/new')}
              className="flex items-center gap-2 px-4 py-2 bg-[#3071a5] text-white rounded-[8px] text-[14px] hover:bg-[#265d8a] transition-colors"
            >
              <Plus size={18} />
              새 프로젝트
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#6b7280] hover:bg-[#f3f4f6] transition-colors"
            >
              <LogOut size={18} />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 목록 */}
      <main className="px-6 py-8">
        {projects.length === 0 ? (
          <div className="bg-white rounded-[12px] p-12 text-center">
            <p className="text-[#9ca3af] mb-4">등록된 프로젝트가 없습니다.</p>
            <button
              onClick={() => router.push('/admin/projects/new')}
              className="px-6 py-3 bg-[#3071a5] text-white rounded-[8px] text-[14px] hover:bg-[#265d8a] transition-colors"
            >
              첫 프로젝트 등록하기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[12px] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                <tr>
                  <th className="px-2 py-4 text-center text-[13px] font-medium text-[#6b7280] w-[80px]">순서</th>
                  <th className="px-4 py-4 text-left text-[13px] font-medium text-[#6b7280]">상태</th>
                  <th className="px-4 py-4 text-left text-[13px] font-medium text-[#6b7280]">프로젝트명</th>
                  <th className="px-4 py-4 text-left text-[13px] font-medium text-[#6b7280]">카테고리</th>
                  <th className="px-4 py-4 text-left text-[13px] font-medium text-[#6b7280]">날짜</th>
                  <th className="px-4 py-4 text-right text-[13px] font-medium text-[#6b7280]">관리</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr 
                    key={project.id} 
                    className={`border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] cursor-pointer ${selectedProject?.id === project.id ? 'bg-[#3071a5]/5' : ''}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <td className="px-2 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveUp(index); }}
                          disabled={index === 0}
                          className={`p-1 rounded transition-colors ${index === 0 ? 'text-[#e5e7eb]' : 'text-[#6b7280] hover:text-[#3071a5] hover:bg-[#f3f4f6]'}`}
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveDown(index); }}
                          disabled={index === projects.length - 1}
                          className={`p-1 rounded transition-colors ${index === projects.length - 1 ? 'text-[#e5e7eb]' : 'text-[#6b7280] hover:text-[#3071a5] hover:bg-[#f3f4f6]'}`}
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {project.is_published ? (
                        <span className="flex items-center gap-1 text-[12px] text-green-600">
                          <Eye size={14} /> 공개
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[12px] text-[#9ca3af]">
                          <EyeOff size={14} /> 비공개
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[14px] font-medium text-[#1f2937]">{project.title}</p>
                      {project.client && (
                        <p className="text-[12px] text-[#9ca3af]">{project.client}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {project.categories.map((cat) => {
                          const badgeMap: Record<string, { label: string; bg: string; text: string }> = {
                            platform: { label: '플랫폼', bg: 'bg-[#3071a5]/10', text: 'text-[#3071a5]' },
                            marketing: { label: '마케팅', bg: 'bg-[#ef4444]/10', text: 'text-[#dc2626]' },
                            contents: { label: '콘텐츠', bg: 'bg-[#eab308]/10', text: 'text-[#ca8a04]' },
                            etc: { label: '기타', bg: 'bg-[#6b7280]/10', text: 'text-[#4b5563]' },
                          };
                          const badge = badgeMap[cat] || { label: cat, bg: 'bg-[#6b7280]/10', text: 'text-[#4b5563]' };
                          return (
                            <span key={cat} className={`px-2 py-0.5 text-[11px] rounded ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#6b7280]">
                      {formatDate(project.date_start, project.date_end)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/admin/projects/${project.id}`); }}
                          className="p-2 text-[#6b7280] hover:text-[#3071a5] hover:bg-[#f3f4f6] rounded-[6px] transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.title); }}
                          className="p-2 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-[6px] transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
