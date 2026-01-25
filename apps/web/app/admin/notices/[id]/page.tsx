'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import NoticeForm from '@/components/admin/NoticeForm';
import { Notice } from '@/lib/types';
import { getNotice } from '@/lib/notices';

export default function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotice();
  }, [id]);

  const loadNotice = async () => {
    try {
      const data = await getNotice(id);
      if (!data) {
        alert('게시글을 찾을 수 없습니다.');
        router.push('/admin/notices');
        return;
      }
      setNotice(data);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      router.push('/admin/notices');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-[#9ca3af]">로딩 중...</p>
      </div>
    );
  }

  if (!notice) return null;

  return <NoticeForm notice={notice} isEdit />;
}
