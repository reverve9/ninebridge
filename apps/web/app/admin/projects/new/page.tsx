'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/admin');
      }
    });
  }, [router]);

  return <ProjectForm />;
}
