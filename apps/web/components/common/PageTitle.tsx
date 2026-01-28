'use client';

import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="px-4 py-5">
      <div className="flex items-baseline justify-start gap-2">
        <h1 className="font-raleway text-[27px] tracking-[1.5px] font-[100] text-[#000000]">
          {title}
        </h1>
        <span className="text-[15px] font-[300] text-[#333333]">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
