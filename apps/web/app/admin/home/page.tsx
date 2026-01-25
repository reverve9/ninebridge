'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Maintenance from '@/components/common/Maintenance';

export default function AdminHomePage() {
  return (
    <AdminLayout activeTab="home" showPreview={false}>
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-[24px] font-bold text-[#1f2937]">홈 설정</h1>
          <p className="text-[14px] text-[#6b7280] mt-1">홈 페이지 및 푸터 설정을 관리합니다.</p>
        </div>
        
        <div className="bg-white rounded-[12px] p-6">
          <Maintenance />
        </div>
      </main>
    </AdminLayout>
  );
}
