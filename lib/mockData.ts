import { Article } from "./types";

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Merkez Bankası Faiz Kararını Açıkladı: Beklentilerin Üzerinde Artış",
    summary:
      "Türkiye Cumhuriyet Merkez Bankası, enflasyonla mücadele kapsamında faiz oranını 250 baz puan artırarak yüzde 50'ye yükseltti. Karar piyasalarda olumlu karşılandı.",
    fullText:
      "Türkiye Cumhuriyet Merkez Bankası Para Politikası Kurulu, mayıs ayı toplantısında politika faizini 250 baz puan artırarak yüzde 47,5'ten yüzde 50'ye yükseltti. Karar, piyasa beklentilerinin üzerinde geldi. TCMB Başkanı yaptığı açıklamada enflasyonla mücadelenin kararlılıkla sürdürüleceğini vurguladı.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    audioUrl: undefined,
    source: "Hürriyet",
    category: "economy",
    publishedAt: "2026-05-17T08:00:00Z",
    duration: 185,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Galatasaray Şampiyonluk Kupasını Kaldırdı",
    summary:
      "Galatasaray, sezonun son maçında Fenerbahçe'yi 3-1 mağlup ederek şampiyonluğunu ilan etti. Taraftarlar sokaklara döküldü.",
    fullText:
      "Süper Lig'in son haftasında oynanan dev derbide Galatasaray, rakibi Fenerbahçe'yi 3-1 yenerek şampiyonluk kupasına kavuştu. Maçın ardından binlerce taraftar İstanbul sokaklarında kutlama yaptı.",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    audioUrl: undefined,
    source: "Sabah",
    category: "sports",
    publishedAt: "2026-05-17T09:30:00Z",
    duration: 142,
  },
  {
    id: "3",
    title: "Apple Vision Pro 2 Tanıtıldı: Türkiye Fiyatı Açıklandı",
    summary:
      "Apple'ın yeni nesil karma gerçeklik gözlüğü Vision Pro 2, WWDC 2026'da tanıtıldı. Daha hafif tasarım ve gelişmiş özellikleriyle dikkat çekiyor.",
    fullText:
      "Apple, yıllık geliştirici konferansı WWDC 2026'da Vision Pro'nun ikinci nesil modelini tanıttı. Yeni model, önceki versiyona kıyasla yüzde 40 daha hafif. Türkiye fiyatı 149.999 TL olarak belirlendi.",
    imageUrl: "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7d3?w=800",
    audioUrl: undefined,
    source: "Milliyet",
    category: "technology",
    publishedAt: "2026-05-17T10:00:00Z",
    duration: 220,
  },
  {
    id: "4",
    title: "İstanbul'da Deprem Hazırlık Tatbikatı Yapıldı",
    summary:
      "İstanbul Büyükşehir Belediyesi koordinasyonunda gerçekleştirilen büyük deprem tatbikatına 200 bin kişi katıldı.",
    fullText:
      "İstanbul genelinde eş zamanlı olarak gerçekleştirilen deprem tatbikatında itfaiye, sağlık ve AFAD ekipleri koordineli hareket etti. Tatbikat kapsamında 50 noktada enkaz kurtarma simülasyonu yapıldı.",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    audioUrl: undefined,
    source: "CNN Türk",
    category: "politics",
    publishedAt: "2026-05-17T07:00:00Z",
    duration: 168,
  },
  {
    id: "5",
    title: "Türk Filmi Cannes'da Büyük Ödül Kazandı",
    summary:
      "Yönetmen Nuri Bilge Ceylan'ın yeni filmi 'Bozkırın Sesi' Cannes Film Festivali'nde Altın Palmiye'ye layık görüldü.",
    fullText:
      "Cannes Film Festivali'nde 'Bozkırın Sesi' filmiyle yarışan Türk yönetmen Nuri Bilge Ceylan, festivalin en prestijli ödülü olan Altın Palmiye'yi aldı. Bu, Türk sineması için tarihi bir başarı oldu.",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
    audioUrl: undefined,
    source: "Cumhuriyet",
    category: "culture",
    publishedAt: "2026-05-17T11:00:00Z",
    duration: 195,
  },
  {
    id: "6",
    title: "G7 Zirvesinde İklim Kararları: Fosil Yakıtlara Fon Kesilecek",
    summary:
      "G7 ülkeleri, 2035 yılına kadar fosil yakıt desteklerini tamamen kaldırmayı taahhüt etti. Yenilenebilir enerjiye 500 milyar dolar yatırım planlandı.",
    fullText:
      "İtalya'da gerçekleştirilen G7 Zirvesi'nde iklim değişikliğiyle mücadele kapsamında kritik kararlar alındı. Yedi büyük ekonomi, kömür, petrol ve doğal gaz desteklerini 2035'e kadar aşamalı olarak kaldırmayı kabul etti.",
    imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800",
    audioUrl: undefined,
    source: "Dünya",
    category: "world",
    publishedAt: "2026-05-17T06:30:00Z",
    duration: 210,
  },
];

export const getFeaturedArticle = (): Article =>
  MOCK_ARTICLES.find((a) => a.isFeatured) ?? MOCK_ARTICLES[0];

export const getArticlesByCategory = (category: string): Article[] => {
  if (category === "all") return MOCK_ARTICLES;
  return MOCK_ARTICLES.filter((a) => a.category === category);
};

export const getArticleById = (id: string): Article | undefined =>
  MOCK_ARTICLES.find((a) => a.id === id);

export const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.floor(hours / 24)} gün önce`;
};
