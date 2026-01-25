export interface GalleryItem {
  type: 'youtube' | 'image';
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
  categories: string[];
  tags: string[];
  client: string | null;
  date_start: string | null;
  date_end: string | null;
  link: string | null;
  gallery: GalleryItem[];
  is_published: boolean;
  is_featured: boolean;
  has_detail: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type ProjectUpdate = Partial<ProjectInsert>;
