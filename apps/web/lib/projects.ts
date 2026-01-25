import { supabase } from './supabase';
import { Project, ProjectInsert, ProjectUpdate } from './types';

// 공개된 프로젝트 목록 조회 (order 기준, 같으면 최신순)
export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 모든 프로젝트 목록 조회 (어드민용 - order 기준, 같으면 최신순)
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 프로젝트 상세 조회
export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// 프로젝트 생성
export async function createProject(project: ProjectInsert): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 프로젝트 수정
export async function updateProject(id: string, project: ProjectUpdate): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 프로젝트 삭제
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 프로젝트 순서 변경
export async function updateProjectOrder(id: string, newOrder: number): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ order: newOrder })
    .eq('id', id);

  if (error) throw error;
}

// 두 프로젝트 순서 스왑
export async function swapProjectOrder(id1: string, order1: number, id2: string, order2: number): Promise<void> {
  // 첫 번째 프로젝트 order 변경
  const { error: error1 } = await supabase
    .from('projects')
    .update({ order: order2 })
    .eq('id', id1);
  if (error1) throw error1;

  // 두 번째 프로젝트 order 변경
  const { error: error2 } = await supabase
    .from('projects')
    .update({ order: order1 })
    .eq('id', id2);
  if (error2) throw error2;
}

// 이미지 업로드
export async function uploadImage(file: File, folder: string): Promise<string> {
  // 파일명에서 한글/특수문자 제거, 영문+숫자만 유지
  const ext = file.name.split('.').pop() || 'png';
  const safeName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  const path = `${folder}/${safeName}`;

  const { data, error } = await supabase.storage
    .from('projects')
    .upload(path, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('projects')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// 이미지 삭제
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('projects')
    .remove([path]);

  if (error) throw error;
}
