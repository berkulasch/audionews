import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Article, CATEGORY_LABELS } from "../lib/types";
import { COLORS, FONTS, RADIUS, SHADOW, CATEGORY_COLORS } from "../constants/theme";
import { formatDuration, timeAgo } from "../lib/mockData";

interface FeaturedCardProps {
  article: Article;
}

export function FeaturedCard({ article }: FeaturedCardProps) {
  const router = useRouter();
  const accent = CATEGORY_COLORS[article.category];

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/article/${article.id}`)}
      style={styles.container}
    >
      <Image source={{ uri: article.imageUrl }} style={styles.image} />
      <LinearGradient
        colors={[
          "rgba(18,36,46,0)",
          "rgba(18,36,46,0.55)",
          "rgba(18,36,46,0.95)",
        ]}
        locations={[0, 0.5, 1]}
        style={styles.overlay}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.categoryChip, { borderColor: accent }]}>
            <View style={[styles.categoryDot, { backgroundColor: accent }]} />
            <Text style={styles.categoryText}>
              {CATEGORY_LABELS[article.category]}
            </Text>
          </View>
          <Text style={styles.sourceText}>{article.source}</Text>
        </View>

        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>

        <View style={styles.meta}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={14} color={COLORS.primaryForeground} />
            {article.duration && (
              <Text style={styles.duration}>
                {formatDuration(article.duration)} dinle
              </Text>
            )}
          </View>
          <Text style={styles.time}>{timeAgo(article.publishedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    height: 280,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 18,
    justifyContent: "flex-end",
  },
  topRow: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(18,36,46,0.6)",
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
    letterSpacing: 0.3,
  },
  sourceText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    color: COLORS.foreground,
    lineHeight: 30,
    marginBottom: 14,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    gap: 8,
  },
  duration: {
    color: COLORS.primaryForeground,
    fontSize: 12,
    fontFamily: FONTS.sansSemiBold,
  },
  time: {
    color: COLORS.mutedForeground,
    fontSize: 12,
    fontFamily: FONTS.sans,
  },
});
