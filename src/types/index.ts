export interface User {
  profile_image_url: string;
  screen_name: string;
  url: string;
  followers_count: number;
  friends_count: number;
  created_at: string;
  description: string;
}

export interface GridSlot {
  id: string;
  user: User | null;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  opacity: number;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  textColor: string;
  textSize: number;
  textPosition: 'top' | 'bottom' | 'center' | 'overlay';
  showFollowers: boolean;
  showDescription: boolean;
  categoryId?: string; // Slotun hangi kategoriye ait olduğu
}

export interface GridCategory {
  id: string;
  title: string;
  yPosition: number; // Canvas üzerindeki Y konumu
  height: number;    // Kategorinin yüksekliği
  backgroundColor?: string; // Kategori satırının arka planı
  iconUrl?: string;       // Kategori için ikon
  textColor?: string;     // Kategori başlık rengi
  fontSize?: number;      // Kategori başlık font boyutu
}

export interface GridConfig {
  id: string;
  name: string;
  size: number;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  slots: GridSlot[];
  categories?: GridCategory[]; // Kategori tanımları
  templateType?: 'default' | 'tierList'; // Grid'in şablon türü
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  quality: number;
  width: number;
  height: number;
  scale: number;
  includeBackground: boolean;
  transparentBackground: boolean;
}

export interface FilterOptions {
  searchTerm: string;
  minFollowers: number;
  maxFollowers: number;
  sortBy: 'followers' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
}
