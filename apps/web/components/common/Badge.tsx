'use client';

import React from 'react';

// 배지 컬러 정의 (병렬 구분용)
const BADGE_COLORS = {
  orange: {
    bg: 'bg-[#b87a5a]/10',
    text: 'text-[#b87a5a]',
  },
  blue: {
    bg: 'bg-[#5b7cae]/10',
    text: 'text-[#5b7cae]',
  },
  green: {
    bg: 'bg-[#6b9b7a]/10',
    text: 'text-[#6b9b7a]',
  },
  gray: {
    bg: 'bg-[#7c8a96]/10',
    text: 'text-[#7c8a96]',
  },
};

// 프로젝트 카테고리 → 배지 컬러 매핑
export const PROJECT_CATEGORY_MAP: Record<string, { label: string; color: keyof typeof BADGE_COLORS }> = {
  platform: { label: '플랫폼', color: 'blue' },
  marketing: { label: '마케팅', color: 'green' },
  contents: { label: '콘텐츠', color: 'orange' },
  etc: { label: '기타', color: 'gray' },
};

// 공지사항 카테고리 → 배지 컬러 매핑
export const NOTICE_CATEGORY_MAP: Record<string, { label: string; color: keyof typeof BADGE_COLORS }> = {
  notice: { label: '공지사항', color: 'orange' },
  press: { label: '언론자료', color: 'green' },
  recruit: { label: '기타', color: 'gray' },
};

interface BadgeProps {
  children: React.ReactNode;
  color?: keyof typeof BADGE_COLORS;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ 
  children, 
  color = 'blue',
  size = 'md',
  className = ''
}: BadgeProps) {
  const colorStyles = BADGE_COLORS[color];
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-[12px]',
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-[4px] font-medium ${colorStyles.bg} ${colorStyles.text} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// 프로젝트 카테고리 배지
interface ProjectBadgeProps {
  category: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProjectBadge({ 
  category, 
  size = 'md',
  className = ''
}: ProjectBadgeProps) {
  const mapping = PROJECT_CATEGORY_MAP[category] || { label: category, color: 'gray' as const };
  
  return (
    <Badge color={mapping.color} size={size} className={className}>
      {mapping.label}
    </Badge>
  );
}

// 공지사항 카테고리 배지
interface NoticeBadgeProps {
  category: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function NoticeBadge({ 
  category, 
  size = 'md',
  className = ''
}: NoticeBadgeProps) {
  const mapping = NOTICE_CATEGORY_MAP[category] || { label: category, color: 'gray' as const };
  
  return (
    <Badge color={mapping.color} size={size} className={className}>
      {mapping.label}
    </Badge>
  );
}
