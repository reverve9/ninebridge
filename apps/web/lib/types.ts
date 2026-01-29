export interface GalleryItem {
  type: 'hor' | 'ver' | 'img';
  url: string;
  title: string;
  desc: string;
  is_main: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  details: string | null;
  thumbnail: string | null;
  featured_thumbnail: string | null;
  categories: string[];
  tags: string[];
  client: string | null;
  date_start: string | null;
  date_end: string | null;
  link: string | null;
  gallery: GalleryItem[];
  related_projects: string[];
  is_published: boolean;
  is_featured: boolean;
  has_detail: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type ProjectUpdate = Partial<ProjectInsert>;

// Notice (게시판)
export interface Attachment {
  name: string;
  url: string;
  size: number;
}

export interface Notice {
  id: string;
  category: 'notice' | 'press' | 'recruit';
  title: string;
  content: string | null;
  thumbnail: string | null;
  attachments: Attachment[];
  link: string | null;
  is_published: boolean;
  is_pinned: boolean;
  is_expanded: boolean;
  view_count: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export type NoticeInsert = Omit<Notice, 'id' | 'created_at' | 'updated_at' | 'view_count'>;
export type NoticeUpdate = Partial<NoticeInsert>;
