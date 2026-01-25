'use client';

import React from 'react';

interface PWAProjectProps {
  onProjectSelect?: (projectId: string) => void;
}

export default function PWAProject({ onProjectSelect }: PWAProjectProps) {
  return (
    <div className="px-4 py-6">
      <h1 className="text-[20px] font-bold text-[#1f2937] mb-4">PROJECT</h1>
      <p className="text-[14px] text-[#6b7280]">프로젝트 리스트가 들어갈 자리</p>
    </div>
  );
}
