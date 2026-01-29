'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Project } from '@/lib/types';
import { getProject, getAllProjects } from '@/lib/projects';
import ProjectForm from '@/components/admin/ProjectForm';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin');
        return;
      }

      try {
        const id = params.id as string;
        const [data, projects] = await Promise.all([
          getProject(id),
          getAllProjects()
        ]);
        setProject(data);
        setAllProjects(projects);
      } catch (error) {
        console.error('프로젝트 로드 실패:', error);
        router.push('/admin/projects');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-[#6b7280]">로딩 중...</p>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return <ProjectForm project={project} isEdit allProjects={allProjects} />;
}
