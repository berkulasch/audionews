import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Parser from "rss-parser";

const parser = new Parser();
const db = admin.firestore();

interface RSSItem {
  title?: string;
  contentSnippet?: string;
  content?: string;
  link?: string;
  pubDate?: string;
  enclosure?: { url?: string };
  "media:content"?: { $?: { url?: string } };
}

const NEWS_SOURCES: Array<{
  name: string;
  url: string;
  category: string;
}> = [
  {
    name: "Hürriyet",
    url: "https://www.hurriyet.com.tr/rss/gundem",
    category: "politics",
  },
  {
    name: "Milliyet",
    url: "https://www.milliyet.com.tr/rss/rssNew/ekonomiRss.xml",
    category: "economy",
  },
  {
    name: "Sabah",
    url: "https://www.sabah.com.tr/rss/spor.xml",
    category: "sports",
  },
  {
    name: "CNN Türk",
    url: "https://www.cnnturk.com/feed/rss/teknoloji/news",
    category: "technology",
  },
  {
    name: "Cumhuriyet",
    url: "https://www.cumhuriyet.com.tr/rss/son_dakika.xml",
    category: "world",
  },
];

export async function fetchAndStoreNews(): Promise<void> {
  const articlesRef = db.collection("articles");

  for (const source of NEWS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items.slice(0, 10); // Her kaynaktan max 10 haber

      for (const item of items) {
        const rssItem = item as RSSItem;
        if (!rssItem.title || !rssItem.link) continue;

        // Daha önce eklendi mi kontrol et
        const existing = await articlesRef
          .where("sourceUrl", "==", rssItem.link)
          .limit(1)
          .get();

        if (!existing.empty) continue;

        // Görsel bul
        const imageUrl =
          rssItem["media:content"]?.$?.url ??
          rssItem.enclosure?.url ??
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";

        const articleData = {
          title: rssItem.title,
          summary: rssItem.contentSnippet ?? rssItem.title,
          fullText: rssItem.content ?? rssItem.contentSnippet ?? rssItem.title,
          imageUrl,
          audioUrl: null,
          source: source.name,
          sourceUrl: rssItem.link,
          category: source.category,
          publishedAt: rssItem.pubDate
            ? new Date(rssItem.pubDate).toISOString()
            : new Date().toISOString(),
          duration: null,
          isFeatured: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await articlesRef.add(articleData);
        functions.logger.info(`Haber eklendi: ${rssItem.title}`);
      }
    } catch (error) {
      functions.logger.error(`RSS çekme hatası (${source.name}):`, error);
    }
  }
}

/**
 * NewsAPI ile haber çek (alternatif / ek kaynak)
 */
export async function fetchFromNewsAPI(apiKey: string): Promise<void> {
  const articlesRef = db.collection("articles");
  const url = `https://newsapi.org/v2/top-headlines?country=tr&pageSize=20&apiKey=${apiKey}`;

  const resp = await fetch(url);
  const data = (await resp.json()) as {
    articles?: Array<{
      title: string;
      description: string;
      content: string;
      url: string;
      urlToImage: string;
      source: { name: string };
      publishedAt: string;
    }>;
  };

  if (!data.articles) return;

  for (const item of data.articles) {
    if (!item.title || !item.url) continue;

    const existing = await articlesRef
      .where("sourceUrl", "==", item.url)
      .limit(1)
      .get();

    if (!existing.empty) continue;

    await articlesRef.add({
      title: item.title,
      summary: item.description ?? item.title,
      fullText: item.content ?? item.description ?? item.title,
      imageUrl:
        item.urlToImage ??
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
      audioUrl: null,
      source: item.source.name,
      sourceUrl: item.url,
      category: "world",
      publishedAt: item.publishedAt,
      duration: null,
      isFeatured: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
