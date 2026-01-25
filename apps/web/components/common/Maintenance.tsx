'use client';

import React from 'react';
import { Construction } from 'lucide-react';

interface MaintenanceProps {
  title?: string;
  message?: string;
}

export default function Maintenance({ 
  title = '페이지 준비 중',
  message = '더 나은 서비스를 위해 준비 중입니다.\n빠른 시일 내에 찾아뵙겠습니다.'
}: MaintenanceProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-6 py-12 text-center">
      <div className="w-[80px] h-[80px] bg-[#3071a5]/10 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-[40px] h-[40px] text-[#3071a5]" />
      </div>
      <h2 className="text-[20px] font-bold text-[#1f2937] mb-3">
        {title}
      </h2>
      <p className="text-[14px] text-[#6b7280] leading-relaxed whitespace-pre-line">
        {message}
      </p>
      <div className="mt-8 flex items-center gap-2 text-[12px] text-[#9ca3af]">
        <span className="w-[6px] h-[6px] bg-[#3071a5] rounded-full animate-pulse" />
        <span>Coming Soon</span>
      </div>
    </div>
  );
}
