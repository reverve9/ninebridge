'use client';

import React, { ReactNode } from 'react';

interface WhiteBoxProps {
  children: ReactNode;
  className?: string;
}

export default function WhiteBox({ children, className = '' }: WhiteBoxProps) {
  return (
    <div className={`white-box ${className}`}>
      {children}
    </div>
  );
}
