'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 이미 로그인된 경우 프로젝트 목록으로 이동
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/admin/projects');
      }
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
      setLoading(false);
    } else {
      router.push('/admin/projects');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-[12px] shadow-lg p-8">
        <h1 className="text-[24px] font-bold text-[#1f2937] text-center mb-2">
          NINEBRIDGE
        </h1>
        <p className="text-[14px] text-[#6b7280] text-center mb-8">
          관리자 로그인
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[14px] text-[#374151] mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
              placeholder="이메일 입력"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#374151] mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3071a5]"
              placeholder="비밀번호 입력"
              required
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#3071a5] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#265d8a] transition-colors disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
