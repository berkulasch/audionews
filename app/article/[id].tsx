import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { getArticleById, formatDuration, timeAgo } from "../../lib/mockData";
import { CATEGORY_LABELS } from "../../lib/types";
import { COLORS, FONTS } from "../../constants/theme";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = ["Özet", "Tam Metin", "Kaynak"] as const;
type Tab = (typeof TABS)[number];

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const article = getArticleById(id);
  const [activeTab, setActiveTab] = useState<Tab>("Özet");
  const [isFavorited, setIsFavorited] = useState(false);
  const { play, togglePlay, isPlaying, currentArticle, progress, position, duration, skipForward, skipBackward, setRate, playbackRate } =
    useAudioPlayer();

  if (!article) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Haber bulunamadı.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCurrentlyPlaying = currentArticle?.id === article.id && isPlaying;
  const isCurrentArticle = currentArticle?.id === article.id;
  const displayProgress = isCurrentArticle ? progress : 0;
  const displayPosition = isCurrentArticle ? position : 0;
  const displayDuration = isCurrentArticle ? duration : (article.duration ?? 0) * 1000;

  const formatMs = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
  };

  const handlePlayPress = () => {
    if (isCurrentArticle) {
      togglePlay();
    } else {
      play(article);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {CATEGORY_LABELS[article.category]}
        </Text>
        <TouchableOpacity onPress={() => setIsFavorited((f) => !f)}>
          <Text style={{ fontSize: 22 }}>{isFavorited ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero image */}
        <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />

        <View style={styles.content}>
          {/* Source & time */}
          <View style={styles.meta}>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceText}>{article.source}</Text>
            </View>
            <Text style={styles.timeText}>{timeAgo(article.publishedAt)}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Audio Player */}
          <View style={styles.playerCard}>
            {/* Waveform-like decoration */}
            <View style={styles.waveform}>
              {[...Array(28)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.wavebar,
                    {
                      height: 8 + Math.sin(i * 0.8) * 12 + Math.random() * 8,
                      backgroundColor:
                        i / 28 < displayProgress
                          ? COLORS.gold[500]
                          : COLORS.cream[300],
                    },
                  ]}
                />
              ))}
            </View>

            {/* Progress */}
            <View style={styles.progressRow}>
              <Text style={styles.progressTime}>{formatMs(displayPosition)}</Text>
              <Text style={styles.progressTime}>{formatMs(displayDuration)}</Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={() => skipBackward(15)} style={styles.skipBtn}>
                <Text style={styles.skipIcon}>⏮</Text>
                <Text style={styles.skipLabel}>15s</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePlayPress} style={styles.mainPlayBtn}>
                <Text style={styles.mainPlayIcon}>
                  {isCurrentlyPlaying ? "⏸" : "▶"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => skipForward(15)} style={styles.skipBtn}>
                <Text style={styles.skipIcon}>⏭</Text>
                <Text style={styles.skipLabel}>15s</Text>
              </TouchableOpacity>
            </View>

            {/* Playback rate */}
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Hız:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {PLAYBACK_RATES.map((rate) => (
                  <TouchableOpacity
                    key={rate}
                    onPress={() => setRate(rate)}
                    style={[
                      styles.rateBtn,
                      playbackRate === rate && styles.rateBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rateBtnText,
                        playbackRate === rate && styles.rateBtnTextActive,
                      ]}
                    >
                      {rate}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab content */}
          <View style={styles.tabContent}>
            {activeTab === "Özet" && (
              <Text style={styles.bodyText}>{article.summary}</Text>
            )}
            {activeTab === "Tam Metin" && (
              <Text style={styles.bodyText}>{article.fullText}</Text>
            )}
            {activeTab === "Kaynak" && (
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceInfoTitle}>{article.source}</Text>
                <Text style={styles.sourceInfoText}>
                  Bu haber {article.source} tarafından yayımlanmıştır.{"\n"}
                  Yayın tarihi: {new Date(article.publishedAt).toLocaleString("tr-TR")}
                </Text>
                {article.duration && (
                  <Text style={styles.sourceInfoText}>
                    Ses süresi: {formatDuration(article.duration)}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream[200],
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cream[100],
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 18,
    color: COLORS.charcoal[900],
  },
  topBarTitle: {
    fontFamily: FONTS.serif,
    fontSize: 16,
    color: COLORS.charcoal[700],
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 240,
  },
  content: {
    padding: 16,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 10,
  },
  sourceBadge: {
    backgroundColor: COLORS.gold[500],
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  sourceText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  timeText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    color: COLORS.charcoal[900],
    lineHeight: 34,
    marginBottom: 20,
  },

  // Player
  playerCard: {
    backgroundColor: COLORS.cream[100],
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    marginBottom: 8,
  },
  wavebar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressTime: {
    fontSize: 12,
    color: COLORS.muted,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginBottom: 16,
  },
  skipBtn: {
    alignItems: "center",
  },
  skipIcon: {
    fontSize: 22,
    color: COLORS.charcoal[900],
  },
  skipLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
  },
  mainPlayBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.charcoal[900],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.charcoal[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mainPlayIcon: {
    color: COLORS.white,
    fontSize: 22,
    marginLeft: 3,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rateLabel: {
    fontSize: 12,
    color: COLORS.muted,
  },
  rateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.cream[200],
    marginRight: 6,
  },
  rateBtnActive: {
    backgroundColor: COLORS.gold[500],
  },
  rateBtnText: {
    fontSize: 12,
    color: COLORS.charcoal[700],
    fontWeight: "600",
  },
  rateBtnTextActive: {
    color: COLORS.white,
  },

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.cream[100],
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: COLORS.charcoal[900],
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabContent: {
    minHeight: 100,
  },
  bodyText: {
    fontSize: 15,
    color: COLORS.charcoal[700],
    lineHeight: 26,
  },
  sourceInfo: {
    gap: 8,
  },
  sourceInfoTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.charcoal[900],
  },
  sourceInfoText: {
    fontSize: 14,
    color: COLORS.charcoal[700],
    lineHeight: 22,
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.muted,
  },
  backBtn: {
    backgroundColor: COLORS.charcoal[900],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backBtnText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
