import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Article } from "../lib/types";
import { COLORS, FONTS, RADIUS, CATEGORY_COLORS } from "../constants/theme";
import { formatDuration, timeAgo } from "../lib/mockData";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface ArticleCardProps {
  article: Article;
  variant?: "horizontal" | "compact";
}

export function ArticleCard({ article, variant = "horizontal" }: ArticleCardProps) {
  const router = useRouter();
  const { currentArticle, isPlaying } = useAudioPlayer();
  const accent = CATEGORY_COLORS[article.category];
  const isActive = currentArticle?.id === article.id;

  if (variant === "compact") {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => router.push(`/article/${article.id}`)}
        style={[styles.compactContainer, isActive && styles.activeBorder]}
      >
        <View style={styles.compactImageWrap}>
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.compactImage}
          />
          {article.duration && (
            <View style={styles.durationBadgeOverlay}>
              <Ionicons name="headset" size={10} color={COLORS.primary} />
              <Text style={styles.durationOverlayText}>
                {formatDuration(article.duration)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.compactContent}>
          <View style={styles.sourceRow}>
            <View style={[styles.sourceDot, { backgroundColor: accent }]} />
            <Text style={styles.compactSource} numberOfLines={1}>
              {article.source}
            </Text>
          </View>
          <Text style={styles.compactTitle} numberOfLines={3}>
            {article.title}
          </Text>
          <Text style={styles.timeText}>{timeAgo(article.publishedAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/article/${article.id}`)}
      style={[styles.horizontalContainer, isActive && styles.activeBorder]}
    >
      <View style={styles.horizontalImageWrap}>
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.horizontalImage}
        />
        {isActive && (
          <View style={styles.playingOverlay}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={18}
              color={COLORS.primaryForeground}
              style={!isPlaying ? { marginLeft: 2 } : undefined}
            />
          </View>
        )}
      </View>
      <View style={styles.horizontalContent}>
        <View style={styles.sourceRow}>
          <View style={[styles.sourceDot, { backgroundColor: accent }]} />
          <Text style={styles.sourceLabel} numberOfLines={1}>
            {article.source}
          </Text>
        </View>
        <Text style={styles.horizontalTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <View style={styles.horizontalMeta}>
          {article.duration && (
            <View style={styles.durationInline}>
              <Ionicons name="headset" size={11} color={COLORS.mutedForeground} />
              <Text style={styles.durationText}>
                {formatDuration(article.duration)}
              </Text>
            </View>
          )}
          <View style={styles.dotSeparator} />
          <Text style={styles.timeText}>{timeAgo(article.publishedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  horizontalImageWrap: {
    width: 110,
    height: 110,
    position: "relative",
  },
  horizontalImage: {
    width: 110,
    height: 110,
    backgroundColor: COLORS.muted,
  },
  playingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18,36,46,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sourceLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  horizontalTitle: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    color: COLORS.foreground,
    lineHeight: 21,
    marginTop: 6,
  },
  horizontalMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  durationInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: COLORS.mutedForeground,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.border,
  },
  timeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.subtleForeground,
  },
  activeBorder: {
    borderColor: COLORS.primary,
  },

  compactContainer: {
    width: 210,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  compactImageWrap: {
    width: "100%",
    height: 130,
    position: "relative",
  },
  compactImage: {
    width: "100%",
    height: 130,
    backgroundColor: COLORS.muted,
  },
  durationBadgeOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(18,36,46,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  durationOverlayText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: COLORS.primary,
  },
  compactContent: {
    padding: 12,
  },
  compactSource: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  compactTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    color: COLORS.foreground,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 8,
    minHeight: 57,
  },
});
