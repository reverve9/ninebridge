import { supabase } from './supabase';

export interface SiteSettings {
  id: string;
  company_name: string;
  ceo_name: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  business_number: string;
  business_license: string | null;
  privacy_officer: string | null;
  privacy_officer_email: string | null;
  sns_kakao: string | null;
  sns_instagram: string | null;
  sns_youtube: string | null;
  sns_facebook: string | null;
  created_at: string;
  updated_at: string;
}

// 설정 가져오기 (단일 행)
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    console.error('사이트 설정 로드 실패:', error);
    return null;
  }

  return data;
}

// 설정 업데이트
export async function updateSiteSettings(
  id: string,
  settings: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>
): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('사이트 설정 업데이트 실패:', error);
    throw error;
  }

  return data;
}
