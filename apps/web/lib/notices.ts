import { supabase } from './supabase';
import { Notice, NoticeInsert, NoticeUpdate } from './types';

// 공개된 게시글 목록 조회 (is_pinned 우선, order 기준)
export async function getPublishedNotices(category?: string): Promise<Notice[]> {
  let query = supabase
    .from('notices')
    .select('*')
    .eq('is_published', true)
    .order('is_pinned', { ascending: false })
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// 모든 게시글 목록 조회 (어드민용)
export async function getAllNotices(category?: string): Promise<Notice[]> {
  let query = supabase
    .from('notices')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// 게시글 상세 조회
export async function getNotice(id: string): Promise<Notice | null> {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// 게시글 생성
export async function createNotice(notice: NoticeInsert): Promise<Notice> {
  const { data, error } = await supabase
    .from('notices')
    .insert(notice)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 게시글 수정
export async function updateNotice(id: string, notice: NoticeUpdate): Promise<Notice> {
  const { data, error } = await supabase
    .from('notices')
    .update(notice)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 게시글 삭제
export async function deleteNotice(id: string): Promise<void> {
  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 조회수 증가
export async function incrementViewCount(id: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_notice_view', { notice_id: id });
  
  // rpc 없으면 직접 업데이트
  if (error) {
    const { data } = await supabase
      .from('notices')
      .select('view_count')
      .eq('id', id)
      .single();
    
    if (data) {
      await supabase
        .from('notices')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);
    }
  }
}

// 게시글 순서 변경
export async function updateNoticeOrder(id: string, newOrder: number): Promise<void> {
  const { error } = await supabase
    .from('notices')
    .update({ order: newOrder })
    .eq('id', id);

  if (error) throw error;
}

// 두 게시글 순서 스왑
export async function swapNoticeOrder(id1: string, order1: number, id2: string, order2: number): Promise<void> {
  const { error: error1 } = await supabase
    .from('notices')
    .update({ order: order2 })
    .eq('id', id1);
  if (error1) throw error1;

  const { error: error2 } = await supabase
    .from('notices')
    .update({ order: order1 })
    .eq('id', id2);
  if (error2) throw error2;
}

// 첨부파일 업로드
export async function uploadAttachment(file: File): Promise<{ name: string; url: string; size: number }> {
  const ext = file.name.split('.').pop() || '';
  const safeName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  const path = `files/${safeName}`;

  const { data, error } = await supabase.storage
    .from('attachments')
    .upload(path, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('attachments')
    .getPublicUrl(data.path);

  return {
    name: file.name,
    url: urlData.publicUrl,
    size: file.size,
  };
}

// 첨부파일 삭제
export async function deleteAttachment(url: string): Promise<void> {
  // URL에서 path 추출
  const path = url.split('/attachments/')[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from('attachments')
    .remove([path]);

  if (error) throw error;
}

// 썸네일 업로드
export async function uploadNoticeThumbnail(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const safeName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  const path = `thumbnails/${safeName}`;

  const { data, error } = await supabase.storage
    .from('attachments')
    .upload(path, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('attachments')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
