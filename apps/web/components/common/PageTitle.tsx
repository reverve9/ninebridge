'use client';

import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="px-4 py-5">
      <div className="flex items-baseline gap-2">
        <h1 className="font-score text-[20px] tracking-[0.8px] font-[800] text-[#1f2937]">
          {title}
        </h1>
        <span className="text-[16px] text-[#3071a5]">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
