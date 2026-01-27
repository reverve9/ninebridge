'use client';

import React from 'react';

// 버튼/탭 컬러 정의
const COLORS = {
  active: '#5b7cae',      // 포인트 블루 (활성화)
  hover: '#4a6b9d',       // 중간 단계
  disabled: '#7c8a96',    // 비활성
};

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-4 py-2 text-[14px]',
    lg: 'px-6 py-3 text-[15px]',
  };
  
  const variantStyles = {
    primary: `bg-[${COLORS.active}] text-white hover:bg-[${COLORS.hover}] disabled:bg-[${COLORS.disabled}] disabled:cursor-not-allowed`,
    secondary: `bg-[${COLORS.hover}]/10 text-[${COLORS.active}] hover:bg-[${COLORS.hover}]/20 disabled:bg-[${COLORS.disabled}]/10 disabled:text-[${COLORS.disabled}] disabled:cursor-not-allowed`,
    outline: `border border-[${COLORS.active}] text-[${COLORS.active}] hover:bg-[${COLORS.active}]/10 disabled:border-[${COLORS.disabled}] disabled:text-[${COLORS.disabled}] disabled:cursor-not-allowed`,
    ghost: `text-[${COLORS.active}] hover:bg-[${COLORS.active}]/10 disabled:text-[${COLORS.disabled}] disabled:cursor-not-allowed`,
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// 탭 버튼 컴포넌트
interface TabButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TabButton({ 
  children, 
  active = false, 
  onClick,
  disabled = false,
  className = ''
}: TabButtonProps) {
  const getStyles = () => {
    if (disabled) {
      return `bg-white text-[${COLORS.disabled}] border-[#e5e7eb] cursor-not-allowed`;
    }
    if (active) {
      return `bg-[${COLORS.active}] text-white border-[${COLORS.active}]`;
    }
    return `bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[${COLORS.hover}] hover:text-[${COLORS.hover}]`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-[14px] rounded-[4px] transition-colors border ${getStyles()} ${className}`}
    >
      {children}
    </button>
  );
}

// 태그 버튼 컴포넌트
interface TagButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TagButton({ 
  children, 
  active = false, 
  onClick,
  disabled = false,
  className = ''
}: TagButtonProps) {
  const getStyles = () => {
    if (disabled) {
      return `bg-gray-100 text-[${COLORS.disabled}] cursor-not-allowed`;
    }
    if (active) {
      return `bg-[${COLORS.active}] text-white`;
    }
    return `bg-gray-100 text-gray-600 hover:bg-gray-200`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-2.5 py-1 text-[12px] rounded-full transition-colors ${getStyles()} ${className}`}
    >
      {children}
    </button>
  );
}
