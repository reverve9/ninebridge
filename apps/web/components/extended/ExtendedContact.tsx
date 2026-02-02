'use client';

import React, { useState, useEffect } from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';
import ExtendedFooter from './ExtendedFooter';
import ExtendedSNS from './ExtendedSNS';
import WhiteBox from '@/components/common/WhiteBox';

// 연혁 데이터 (추후 DB로 이동 가능)
const historyData = [
  { year: '2024', items: ['나인브릿지 웹사이트 리뉴얼', '라이브커머스 스튜디오 확장'] },
  { year: '2023', items: ['강릉시 공공 플랫폼 개발 수주', '디지털 마케팅 사업부 신설'] },
  { year: '2022', items: ['(주)나인브릿지 법인 설립', '강릉시 교동 사옥 이전'] },
];

// 인증 데이터 (추후 DB로 이동 가능)
const certifications = [
  { name: '기업부설연구소', org: '한국산업기술진흥협회' },
  { name: '벤처기업 인증', org: '중소벤처기업부' },
  { name: '소프트웨어사업자', org: '한국소프트웨어산업협회' },
];

// 파트너사 로고 (추후 DB로 이동 가능)
const partners = [
  { name: '강릉시', logo: '/partners/gangneung.png' },
  { name: '네이버', logo: '/partners/naver.png' },
  { name: '카카오', logo: '/partners/kakao.png' },
  { name: '강원도', logo: '/partners/gangwon.png' },
];

export default function ExtendedContact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSiteSettings();
    setSettings(data);
  };

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
    <div className="space-y-[30px]">
      {/* SNS */}
      <ExtendedSNS title="CONNECT" subtitle="정보&문의" />

      {/* 전체 콘텐츠 - 하나의 화이트박스 */}
      <WhiteBox>
        
        {/* CI 영역 */}
        <div className="flex items-center gap-8">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <img 
              src="/logo_s250.png" 
              alt="Nine Bridge" 
              className="w-[120px] h-[120px] object-contain"
            />
          </div>
          {/* 회사 소개 */}
          <div className="flex-1">
            <h2 className="font-score text-[24px] font-bold text-[#333] mb-2">
              {settings?.company_name || '(주)나인브릿지'}
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed">
              나인브릿지는 플랫폼 기획 및 개발, 영상 및 디자인 콘텐츠 제작, 
              라이브커머스 운영, SNS 마케팅까지 마케팅 전반을 아우르는 
              디지털 마케팅 전문 기업입니다.
            </p>
            <p className="font-raleway text-[14px] text-[#3071a5] mt-3 tracking-wide">
              Link the Next. 나인브릿지는 모두의 내일을 연결합니다.
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-[#e5e7eb] my-[40px]" />

        {/* 회사정보 - 연혁 & 인증 */}
        <div className="grid grid-cols-2 gap-[40px]">
          {/* 연혁 */}
          <div>
            <div className="flex items-center justify-end mb-[15px]">
              <span className="text-[13px] font-[300] text-white bg-[#333] rounded-[2px] px-2 py-0.5">연혁</span>
            </div>
            <div className="space-y-4">
              {historyData.map((item) => (
                <div key={item.year} className="flex gap-4">
                  <span className="text-[14px] font-bold text-[#3071a5] w-[50px] flex-shrink-0">{item.year}</span>
                  <div className="text-[14px] text-[#666]">
                    {item.items.map((text, idx) => (
                      <p key={idx}>{text}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 인증 */}
          <div>
            <div className="flex items-center justify-end mb-[15px]">
              <span className="text-[13px] font-[300] text-white bg-[#333] rounded-[2px] px-2 py-0.5">인증</span>
            </div>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.name} className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-[8px]">
                  <div className="w-[40px] h-[40px] bg-[#e5e7eb] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#3071a5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#333]">{cert.name}</p>
                    <p className="text-[12px] text-[#9ca3af]">{cert.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-[#e5e7eb] my-[40px]" />

        {/* 문의 폼 */}
        <div>
          <div className="flex items-center justify-end mb-[15px]">
            <span className="text-[13px] font-[300] text-white bg-[#333] rounded-[2px] px-2 py-0.5">문의하기</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#333] mb-1">이름 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb] focus:border-[#3071a5] focus:ring-1 focus:ring-[#3071a5] outline-none text-[14px]"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#333] mb-1">회사명</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb] focus:border-[#3071a5] focus:ring-1 focus:ring-[#3071a5] outline-none text-[14px]"
                  placeholder="(주)회사명"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#333] mb-1">연락처 *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb] focus:border-[#3071a5] focus:ring-1 focus:ring-[#3071a5] outline-none text-[14px]"
                  placeholder="010-1234-5678"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#333] mb-1">이메일</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb] focus:border-[#3071a5] focus:ring-1 focus:ring-[#3071a5] outline-none text-[14px]"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#333] mb-1">문의 분야</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb] focus:border-[#3071a5] focus:ring-1 focus:ring-[#3071a5] outline-none text-[14px]"
                >
                  <option value="">선택해주세요</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#333] mb-1">예산 범위</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb] focus:border-[#3071a5] focus:ring-1 focus:ring-[#3071a5] outline-none text-[14px]"
                >
                  <option value="">선택해주세요</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#333] mb-1">문의 내용</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb] focus:border-[#3071a5] focus:ring-1 focus:ring-[#3071a5] outline-none text-[14px] resize-none"
                placeholder="프로젝트에 대해 자세히 알려주세요"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3071a5] text-white rounded-[8px] font-medium flex items-center justify-center gap-2 hover:bg-[#265d8a] transition-colors text-[14px]"
            >
              <Send size={16} />
              문의 보내기
            </button>
          </form>
        </div>

        {/* 구분선 */}
        <div className="border-t border-[#e5e7eb] my-[40px]" />

        {/* 파트너사 */}
        <div>
          <div className="flex items-center justify-end mb-[15px]">
            <span className="text-[13px] font-[300] text-white bg-[#333] rounded-[2px] px-2 py-0.5">파트너사</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {partners.map((partner) => (
              <div 
                key={partner.name}
                className="aspect-[3/2] bg-[#f9fafb] rounded-[8px] flex items-center justify-center p-4"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-[14px] text-[#9ca3af]">${partner.name}</span>`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-[#e5e7eb] my-[40px]" />

        {/* 찾아오시는 길 */}
        <div>
          <div className="flex items-center justify-end mb-[15px]">
            <span className="text-[13px] font-[300] text-white bg-[#333] rounded-[2px] px-2 py-0.5">찾아오시는 길</span>
          </div>
          
          <div className="grid grid-cols-[1fr_280px] gap-6">
            {/* 지도 영역 */}
            <div className="aspect-[16/9] bg-[#f0f0f0] rounded-[8px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.8!2d128.8963!3d37.7519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ1JzA3LjAiTiAxMjjCsDUzJzQ2LjciRQ!5e0!3m2!1sko!2skr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#3071a5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-[#333]">주소</p>
                  <p className="text-[13px] text-[#666] mt-0.5">
                    {settings?.address || '강원특별자치도 강릉시 하슬라로206번길 23-13 (교동)'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#3071a5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-[#333]">전화</p>
                  <p className="text-[13px] text-[#666] mt-0.5">{settings?.tel || '033-823-0133'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#3071a5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-[#333]">이메일</p>
                  <p className="text-[13px] text-[#666] mt-0.5">{settings?.email || 'rev_nine@naver.com'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#3071a5] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-[#333]">영업시간</p>
                  <p className="text-[13px] text-[#666] mt-0.5">평일 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </WhiteBox>

      {/* 푸터 */}
      <ExtendedFooter />
    </div>
  );
}
