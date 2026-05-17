import { NewsCategory } from "./types";

export interface NewsSource {
  id: string;
  name: string;
  defaultCategory: NewsCategory;
  initials: string;
}

export const NEWS_SOURCES: readonly NewsSource[] = [
  { id: "hurriyet", name: "Hürriyet", defaultCategory: "politics", initials: "Hü" },
  { id: "milliyet", name: "Milliyet", defaultCategory: "economy", initials: "Mi" },
  { id: "sabah", name: "Sabah", defaultCategory: "sports", initials: "Sa" },
  { id: "cnnturk", name: "CNN Türk", defaultCategory: "technology", initials: "CN" },
  { id: "cumhuriyet", name: "Cumhuriyet", defaultCategory: "world", initials: "Cu" },
  { id: "dunya", name: "Dünya", defaultCategory: "world", initials: "Dü" },
] as const;

export const SOURCE_NAMES: readonly string[] = NEWS_SOURCES.map((s) => s.name);

export function getSourceByName(name: string): NewsSource | undefined {
  return NEWS_SOURCES.find((s) => s.name === name);
}
