import {
  Article,
  ListDuration,
  ListRecency,
  MyListPreferences,
} from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function matchesRecency(article: Article, recency: ListRecency): boolean {
  if (recency === "all") return true;
  const published = new Date(article.publishedAt).getTime();
  if (Number.isNaN(published)) return true;
  const age = Date.now() - published;
  switch (recency) {
    case "today": {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      return published >= startOfDay.getTime();
    }
    case "24h":
      return age <= DAY_MS;
    case "week":
      return age <= 7 * DAY_MS;
  }
}

function matchesDuration(article: Article, duration: ListDuration): boolean {
  if (duration === "all" || !article.duration) return true;
  if (duration === "short") return article.duration <= 180;
  if (duration === "medium")
    return article.duration > 180 && article.duration <= 360;
  return article.duration > 360;
}

export function matchesMyList(
  article: Article,
  prefs: MyListPreferences
): boolean {
  if (prefs.categories.length > 0 && !prefs.categories.includes(article.category))
    return false;
  if (prefs.sources.length > 0 && !prefs.sources.includes(article.source))
    return false;
  if (!matchesRecency(article, prefs.recency)) return false;
  if (!matchesDuration(article, prefs.duration)) return false;
  return true;
}

export function filterArticles(
  articles: Article[],
  prefs: MyListPreferences
): Article[] {
  const filtered = articles.filter((a) => matchesMyList(a, prefs));
  const sorted = [...filtered].sort((a, b) => {
    if (prefs.sort === "shortest") {
      return (a.duration ?? Infinity) - (b.duration ?? Infinity);
    }
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
  if (prefs.maxArticles && prefs.maxArticles > 0) {
    return sorted.slice(0, prefs.maxArticles);
  }
  return sorted;
}

export function isPreferencesEmpty(prefs: MyListPreferences): boolean {
  return (
    prefs.categories.length === 0 &&
    prefs.sources.length === 0 &&
    prefs.recency === "all" &&
    prefs.duration === "all" &&
    !prefs.unlistenedOnly &&
    prefs.maxArticles === null
  );
}

export function preferencesSummary(prefs: MyListPreferences): string {
  const parts: string[] = [];
  if (prefs.categories.length > 0) {
    parts.push(`${prefs.categories.length} kategori`);
  }
  if (prefs.sources.length > 0) {
    parts.push(`${prefs.sources.length} kaynak`);
  }
  if (prefs.recency !== "all") {
    const labels: Record<ListRecency, string> = {
      all: "Tümü",
      today: "Bugün",
      "24h": "Son 24 saat",
      week: "Bu hafta",
    };
    parts.push(labels[prefs.recency]);
  }
  return parts.length > 0 ? parts.join(" · ") : "Tüm haberler";
}
