export type NewsCategory =
  | "all"
  | "politics"
  | "economy"
  | "sports"
  | "technology"
  | "world"
  | "culture";

export interface Article {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  imageUrl: string;
  audioUrl?: string;
  source: string;
  sourceLogo?: string;
  category: NewsCategory;
  publishedAt: string;
  duration?: number; // seconds
  isFeatured?: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  preferences?: {
    categories: NewsCategory[];
    playbackSpeed: number;
  };
}

export interface ListeningProgress {
  articleId: string;
  progress: number; // 0-1
  listenedAt: string;
}

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  all: "Tümü",
  politics: "Siyaset",
  economy: "Ekonomi",
  sports: "Spor",
  technology: "Teknoloji",
  world: "Dünya",
  culture: "Kültür",
};

export const CATEGORY_ICONS: Record<NewsCategory, string> = {
  all: "🌐",
  politics: "🏛️",
  economy: "📈",
  sports: "⚽",
  technology: "💻",
  world: "🌍",
  culture: "🎭",
};
