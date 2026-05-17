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
import { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getArticleById, formatDuration, timeAgo } from "../../lib/mockData";
import { CATEGORY_LABELS } from "../../lib/types";
import {
  COLORS,
  FONTS,
  RADIUS,
  SHADOW,
  CATEGORY_COLORS,
} from "../../constants/theme";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { IconButton } from "../../components/ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = ["Özet", "Tam Metin", "Kaynak"] as const;
type Tab = (typeof TABS)[number];

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];
const WAVE_BAR_COUNT = 36;

function generateWaveform(seed: string): number[] {
  // Deterministic pseudo-random pattern derived from the article id so the
  // bars don't flicker on every render.
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < WAVE_BAR_COUNT; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const rand = (h % 1000) / 1000; // 0..1
    const sine = Math.sin((i / WAVE_BAR_COUNT) * Math.PI * 2.4);
    bars.push(0.35 + 0.35 * (sine * 0.5 + 0.5) + 0.3 * rand);
  }
  return bars;
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const article = getArticleById(id);
  const [activeTab, setActiveTab] = useState<Tab>("Özet");
  const [isFavorited, setIsFavorited] = useState(false);
  const {
    play,
    togglePlay,
    isPlaying,
    currentArticle,
    progress,
    position,
    duration,
    skipForward,
    skipBackward,
    setRate,
    playbackRate,
  } = useAudioPlayer();

  const waveform = useMemo(
    () => generateWaveform(id ?? "article"),
    [id]
  );

  if (!article) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={COLORS.mutedForeground}
          />
          <Text style={styles.errorText}>Haber bulunamadı.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const accent = CATEGORY_COLORS[article.category];
  const isCurrentArticle = currentArticle?.id === article.id;
  const isCurrentlyPlaying = isCurrentArticle && isPlaying;
  const displayProgress = isCurrentArticle ? progress : 0;
  const displayPosition = isCurrentArticle ? position : 0;
  const displayDuration = isCurrentArticle
    ? duration
    : (article.duration ?? 0) * 1000;

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
      <View style={styles.topBar}>
        <IconButton
          icon="chevron-back"
          variant="filled"
          size={40}
          onPress={() => router.back()}
        />
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {CATEGORY_LABELS[article.category]}
        </Text>
        <IconButton
          icon={isFavorited ? "heart" : "heart-outline"}
          variant="filled"
          size={40}
          color={isFavorited ? COLORS.destructive : COLORS.foreground}
          onPress={() => setIsFavorited((f) => !f)}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={styles.heroWrap}>
          <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
          <LinearGradient
            colors={[
              "rgba(18,36,46,0)",
              "rgba(18,36,46,0.65)",
              COLORS.background,
            ]}
            locations={[0, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.meta}>
            <View style={[styles.categoryChip, { borderColor: accent }]}>
              <View style={[styles.categoryDot, { backgroundColor: accent }]} />
              <Text style={styles.categoryText}>
                {CATEGORY_LABELS[article.category]}
              </Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={styles.sourceText}>{article.source}</Text>
              <View style={styles.dotSeparator} />
              <Text style={styles.timeText}>{timeAgo(article.publishedAt)}</Text>
            </View>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.playerCard}>
            <View style={styles.waveform}>
              {waveform.map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.wavebar,
                    {
                      height: 8 + h * 32,
                      backgroundColor:
                        i / WAVE_BAR_COUNT <= displayProgress
                          ? COLORS.primary
                          : COLORS.border,
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressTime}>
                {formatMs(displayPosition)}
              </Text>
              <Text style={styles.progressTime}>
                {formatMs(displayDuration)}
              </Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => skipBackward(15)}
                style={styles.skipBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="play-back"
                  size={22}
                  color={COLORS.foreground}
                />
                <Text style={styles.skipLabel}>15s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePlayPress}
                style={styles.mainPlayBtn}
                activeOpacity={0.9}
              >
                <Ionicons
                  name={isCurrentlyPlaying ? "pause" : "play"}
                  size={28}
                  color={COLORS.primaryForeground}
                  style={
                    !isCurrentlyPlaying ? { marginLeft: 3 } : undefined
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => skipForward(15)}
                style={styles.skipBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="play-forward"
                  size={22}
                  color={COLORS.foreground}
                />
                <Text style={styles.skipLabel}>15s</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Hız</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6 }}
              >
                {PLAYBACK_RATES.map((rate) => {
                  const active = playbackRate === rate;
                  return (
                    <TouchableOpacity
                      key={rate}
                      onPress={() => setRate(rate)}
                      activeOpacity={0.85}
                      style={[styles.rateBtn, active && styles.rateBtnActive]}
                    >
                      <Text
                        style={[
                          styles.rateBtnText,
                          active && styles.rateBtnTextActive,
                        ]}
                      >
                        {rate}x
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <View style={styles.tabs}>
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                  style={styles.tab}
                >
                  <Text
                    style={[styles.tabText, active && styles.tabTextActive]}
                  >
                    {tab}
                  </Text>
                  <View
                    style={[
                      styles.tabIndicator,
                      active && styles.tabIndicatorActive,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

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
                  Bu haber {article.source} tarafından yayımlanmıştır.
                </Text>
                <Text style={styles.sourceInfoText}>
                  Yayın tarihi:{" "}
                  {new Date(article.publishedAt).toLocaleString("tr-TR")}
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
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  topBarTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: COLORS.mutedForeground,
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroWrap: {
    width: SCREEN_WIDTH,
    height: 260,
    position: "relative",
    backgroundColor: COLORS.muted,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  content: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: COLORS.foreground,
  },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sourceText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.border,
  },
  timeText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.subtleForeground,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    color: COLORS.foreground,
    lineHeight: 34,
    marginBottom: 20,
  },

  playerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    marginBottom: 10,
  },
  wavebar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  progressTime: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: COLORS.mutedForeground,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 36,
    marginBottom: 20,
  },
  skipBtn: {
    alignItems: "center",
    gap: 2,
  },
  skipLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: COLORS.subtleForeground,
  },
  mainPlayBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rateLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
  rateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rateBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rateBtnText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.foreground,
  },
  rateBtnTextActive: {
    color: COLORS.primaryForeground,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: COLORS.subtleForeground,
    marginBottom: 8,
  },
  tabTextActive: {
    color: COLORS.foreground,
  },
  tabIndicator: {
    height: 2,
    width: "100%",
    backgroundColor: "transparent",
  },
  tabIndicatorActive: {
    backgroundColor: COLORS.primary,
  },
  tabContent: {
    minHeight: 120,
  },
  bodyText: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.foreground,
    lineHeight: 26,
  },
  sourceInfo: {
    gap: 8,
  },
  sourceInfoTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.foreground,
  },
  sourceInfoText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  errorText: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: COLORS.mutedForeground,
  },
  backBtn: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.pill,
  },
  backBtnText: {
    fontFamily: FONTS.sansSemiBold,
    color: COLORS.primaryForeground,
    fontSize: 14,
  },
});
