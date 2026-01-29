'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Maintenance from '@/components/common/Maintenance';

export default function AdminContactPage() {
  return (
    <AdminLayout activeTab="contact" showPreview={false}>
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-[24px] font-bold text-[#1f2937]">문의 관리</h1>
          <p className="text-[14px] text-[#6b7280] mt-1">문의 내역을 확인하고 관리합니다.</p>
        </div>
        
        <div className="bg-white rounded-[12px] p-6">
          <Maintenance />
        </div>
      </main>
    </AdminLayout>
  );
}
