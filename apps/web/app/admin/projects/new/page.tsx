'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Project } from '@/lib/types';
import { getAllProjects } from '@/lib/projects';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin');
        return;
      }
      
      const projects = await getAllProjects();
      setAllProjects(projects);
    };
    
    checkAuthAndLoad();
  }, [router]);

  return <ProjectForm allProjects={allProjects} />;
}
