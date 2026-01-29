'use client';

import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import ExtendedFooter from './ExtendedFooter';
import ExtendedSNS from './ExtendedSNS';

export default function ExtendedContact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  });

  const services = [
    '개발 (웹/앱/PWA)',
    '행사기획',
    '마케팅/라이브커머스',
    '영상/사진 제작',
    '기타',
  ];

  const budgets = [
    '100만원 미만',
    '100만원 ~ 500만원',
    '500만원 ~ 1000만원',
    '1000만원 이상',
    '협의 필요',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
  };

  return (
    <div>
      {/* SNS */}
      <ExtendedSNS />

      {/* 헤더 */}
      <div className="mb-8">
        <span className="text-[#3071a5] text-sm font-semibold tracking-wider uppercase">
          Connect
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-1">정보&문의</h1>
        <p className="text-gray-600 mt-2">
          프로젝트에 대해 상담해 드립니다.<br />
          아래 양식을 작성해 주시면 빠른 시일 내에 연락드리겠습니다.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 문의 폼 */}
        <div className="col-span-2 bg-white rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
                  placeholder="(주)회사명"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처 *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
                  placeholder="010-1234-5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의 분야</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
                >
                  <option value="">선택해주세요</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예산 범위</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none"
                >
                  <option value="">선택해주세요</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#3071a5] outline-none resize-none"
                placeholder="프로젝트에 대해 자세히 알려주세요"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#3071a5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#265d8a] transition-colors"
            >
              <Send size={18} />
              문의 보내기
            </button>
          </form>
        </div>

        {/* 연락처 정보 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">빠른 연락</h3>
            <div className="space-y-3">
              <a href="tel:033-823-0133" className="flex items-center gap-3 p-3 bg-[#3071a5] text-white rounded-xl">
                <Phone size={20} />
                <span>033-823-0133</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 bg-yellow-400 text-yellow-900 rounded-xl">
                <MessageCircle size={20} />
                <span>카카오톡 문의</span>
              </a>
              <a href="mailto:rev_nine@naver.com" className="flex items-center gap-3 p-3 bg-gray-100 text-gray-700 rounded-xl">
                <Mail size={20} />
                <span>이메일 문의</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">회사 정보</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#3071a5] flex-shrink-0 mt-0.5" />
                <span>강원특별자치도 강릉시<br />하슬라로206번길 23-13 (교동)</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#3071a5]" />
                <span>평일 09:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <ExtendedFooter />
        </div>
      </div>
    </div>
  );
}
