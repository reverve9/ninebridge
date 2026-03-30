'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SiteSettings, getSiteSettings, updateSiteSettings } from '@/lib/siteSettings';
import { Save } from 'lucide-react';
import PWAHome from '@/components/pwa/PWAHome';

export default function AdminHomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('설정 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      await updateSiteSettings(settings.id, {
        company_name: settings.company_name,
        ceo_name: settings.ceo_name,
        address: settings.address,
        tel: settings.tel,
        fax: settings.fax,
        email: settings.email,
        business_number: settings.business_number,
        business_license: settings.business_license,
        privacy_officer: settings.privacy_officer,
        privacy_officer_email: settings.privacy_officer_email,
        sns_kakao: settings.sns_kakao,
        sns_instagram: settings.sns_instagram,
        sns_youtube: settings.sns_youtube,
        sns_facebook: settings.sns_facebook,
        header_tagline: settings.header_tagline,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_description: settings.hero_description,
      });
      setMessage({ type: 'success', text: '저장되었습니다.' });
    } catch (error) {
      console.error('저장 실패:', error);
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  // 미리보기용 컴포넌트
  const PreviewComponent = settings ? (
    <PWAHome
      settings={{
        header_tagline: settings.header_tagline || undefined,
        hero_title: settings.hero_title || undefined,
        hero_subtitle: settings.hero_subtitle || undefined,
        hero_description: settings.hero_description || undefined,
      }}
    />
  ) : null;

  if (loading) {
    return (
      <AdminLayout activeTab="home" showPreview={true} preview={null}>
        <main className="p-6">
          <div className="text-center text-[#9ca3af] py-8">로딩 중...</div>
        </main>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout activeTab="home" showPreview={true} preview={null}>
        <main className="p-6">
          <div className="text-center text-[#9ca3af] py-8">설정을 불러올 수 없습니다.</div>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="home" showPreview={true} preview={PreviewComponent}>
      <main className="p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-bold text-[#1f2937]">홈 설정</h1>
            <p className="text-[14px] text-[#6b7280] mt-1">홈 화면 및 사이트 기본 정보를 관리합니다.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#5b7cae] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#4a6b9d] transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>

        {/* 메시지 */}
        {message && (
          <div className={`mb-4 p-3 rounded-[8px] text-[14px] ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* 헤더 설정 */}
          <div className="bg-white rounded-[12px] p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#1f2937] mb-4">헤더 설정</h2>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1">태그라인</label>
              <input
                type="text"
                value={settings.header_tagline || ''}
                onChange={(e) => handleChange('header_tagline', e.target.value)}
                placeholder="나인브릿지는 모두의 내일을 연결합니다"
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
              />
              <p className="text-[12px] text-[#9ca3af] mt-1">상단 헤더 로고 옆에 표시됩니다.</p>
            </div>
          </div>

          {/* 히어로 영역 설정 */}
          <div className="bg-white rounded-[12px] p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#1f2937] mb-4">히어로 영역</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">메인 타이틀</label>
                <textarea
                  value={settings.hero_title || ''}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  placeholder="Connect platform&#10;Create experience"
                  rows={2}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae] resize-none"
                />
                <p className="text-[12px] text-[#9ca3af] mt-1">줄바꿈으로 두 줄 입력 가능합니다. 영문 C는 자동으로 강조됩니다.</p>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">서브 타이틀</label>
                <textarea
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  placeholder="콘텐츠, 마케팅, 플랫폼을 연결하는&#10;디지털 마케팅 전문 기업"
                  rows={2}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae] resize-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">설명</label>
                <textarea
                  value={settings.hero_description || ''}
                  onChange={(e) => handleChange('hero_description', e.target.value)}
                  placeholder="(주)나인브릿지는 플랫폼 기획 및 개발..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-[12px] p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#1f2937] mb-4">기본 정보 (푸터)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">회사명</label>
                <input
                  type="text"
                  value={settings.company_name || ''}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">대표자</label>
                <input
                  type="text"
                  value={settings.ceo_name || ''}
                  onChange={(e) => handleChange('ceo_name', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-[#374151] mb-1">주소</label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">전화번호</label>
                <input
                  type="text"
                  value={settings.tel || ''}
                  onChange={(e) => handleChange('tel', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">팩스</label>
                <input
                  type="text"
                  value={settings.fax || ''}
                  onChange={(e) => handleChange('fax', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">이메일</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">사업자등록번호</label>
                <input
                  type="text"
                  value={settings.business_number || ''}
                  onChange={(e) => handleChange('business_number', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">통신판매업신고번호</label>
                <input
                  type="text"
                  value={settings.business_license || ''}
                  onChange={(e) => handleChange('business_license', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">개인정보보호책임자</label>
                <input
                  type="text"
                  value={settings.privacy_officer || ''}
                  onChange={(e) => handleChange('privacy_officer', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">개인정보보호책임자 이메일</label>
                <input
                  type="email"
                  value={settings.privacy_officer_email || ''}
                  onChange={(e) => handleChange('privacy_officer_email', e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
            </div>
          </div>

          {/* SNS 링크 */}
          <div className="bg-white rounded-[12px] p-6 shadow-sm">
            <h2 className="text-[18px] font-bold text-[#1f2937] mb-4">SNS 링크</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">카카오톡 채널</label>
                <input
                  type="url"
                  value={settings.sns_kakao || ''}
                  onChange={(e) => handleChange('sns_kakao', e.target.value)}
                  placeholder="https://pf.kakao.com/..."
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">인스타그램</label>
                <input
                  type="url"
                  value={settings.sns_instagram || ''}
                  onChange={(e) => handleChange('sns_instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">유튜브</label>
                <input
                  type="url"
                  value={settings.sns_youtube || ''}
                  onChange={(e) => handleChange('sns_youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">페이스북</label>
                <input
                  type="url"
                  value={settings.sns_facebook || ''}
                  onChange={(e) => handleChange('sns_facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-[6px] text-[14px] focus:outline-none focus:border-[#5b7cae]"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
