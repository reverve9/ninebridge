'use client';

import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });

  const services = [
    '개발 (웹/앱/PWA)',
    '행사기획',
    '마케팅/라이브커머스',
    '영상/사진 제작',
    '기타',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
  };

  return (
    <section id="contact" className="py-12 px-4 bg-white">
      {/* 섹션 헤더 */}
      <div className="mb-8 text-center">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Connect
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">정보&문의</h2>
        <p className="text-gray-600 mt-2">
          프로젝트에 대해 상담해 드립니다
        </p>
      </div>

      {/* 빠른 연락 버튼들 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <a
          href="tel:033-823-0133"
          className="flex items-center justify-center gap-2 py-4 bg-[#3071a5] text-white rounded-xl"
        >
          <Phone size={18} />
          <span className="font-medium">전화 문의</span>
        </a>
        <a
          href="#"
          className="flex items-center justify-center gap-2 py-4 bg-yellow-400 text-yellow-900 rounded-xl"
        >
          <MessageCircle size={18} />
          <span className="font-medium">카카오톡</span>
        </a>
      </div>

      {/* 문의 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="이름 *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
          />
          <input
            type="text"
            placeholder="회사명"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
          />
        </div>
        
        <input
          type="tel"
          placeholder="연락처 *"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
        />
        
        <input
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
        />

        <select
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none text-gray-600"
        >
          <option value="">문의 분야 선택</option>
          {services.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>

        <textarea
          placeholder="문의 내용을 입력해주세요"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none resize-none"
        />

        <button
          type="submit"
          className="w-full py-4 bg-[#3071a5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#265d8a] transition-colors"
        >
          <Send size={18} />
          문의 보내기
        </button>
      </form>

      {/* 회사 정보 */}
      <div className="mt-10 pt-8 border-t border-gray-100">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[#3071a5] flex-shrink-0 mt-0.5" />
            <span>강원특별자치도 강릉시 하슬라로206번길 23-13 (교동)</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-[#3071a5]" />
            <span>033-823-0133</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[#3071a5]" />
            <span>rev_nine@naver.com</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>사업자등록번호: 502-86-43421</p>
          <p>통신판매업신고번호: 2025-강원강릉-0209호</p>
          <p className="mt-4">© 2025 Nine Bridge Co., Ltd. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
