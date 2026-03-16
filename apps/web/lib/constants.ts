/** 프로젝트 카테고리 탭 */
export const PROJECT_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'platform', label: '플랫폼' },
  { id: 'marketing', label: '마케팅' },
  { id: 'contents', label: '콘텐츠' },
  { id: 'etc', label: '기타' },
] as const;

/** 공지사항 카테고리 탭 */
export const NOTICE_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'notice', label: '공지사항' },
  { id: 'press', label: '언론자료' },
  { id: 'recruit', label: '기타' },
] as const;
