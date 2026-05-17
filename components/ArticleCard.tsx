import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Article } from "../lib/types";
import { COLORS, FONTS } from "../constants/theme";
import { formatDuration, timeAgo } from "../lib/mockData";

interface ArticleCardProps {
  article: Article;
  variant?: "horizontal" | "compact";
}

export function ArticleCard({ article, variant = "horizontal" }: ArticleCardProps) {
  const router = useRouter();

  if (variant === "compact") {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(`/article/${article.id}`)}
        style={styles.compactContainer}
      >
        <Image source={{ uri: article.imageUrl }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={styles.compactSource}>{article.source}</Text>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <View style={styles.compactMeta}>
            {article.duration && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>🎧 {formatDuration(article.duration)}</Text>
              </View>
            )}
            <Text style={styles.timeText}>{timeAgo(article.publishedAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/article/${article.id}`)}
      style={styles.horizontalContainer}
    >
      <Image source={{ uri: article.imageUrl }} style={styles.horizontalImage} />
      <View style={styles.horizontalContent}>
        <Text style={styles.sourceLabel}>{article.source}</Text>
        <Text style={styles.horizontalTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <View style={styles.horizontalMeta}>
          {article.duration && (
            <Text style={styles.durationText}>🎧 {formatDuration(article.duration)}</Text>
          )}
          <Text style={styles.timeText}>{timeAgo(article.publishedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.cream[100],
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  horizontalImage: {
    width: 110,
    height: 110,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  sourceLabel: {
    fontSize: 11,
    color: COLORS.gold[500],
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  horizontalTitle: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    color: COLORS.charcoal[900],
    lineHeight: 21,
    marginTop: 4,
  },
  horizontalMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  compactContainer: {
    width: 200,
    backgroundColor: COLORS.cream[100],
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  compactImage: {
    width: "100%",
    height: 120,
  },
  compactContent: {
    padding: 12,
  },
  compactSource: {
    fontSize: 10,
    color: COLORS.gold[500],
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  compactTitle: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    color: COLORS.charcoal[900],
    lineHeight: 19,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  durationBadge: {
    backgroundColor: COLORS.cream[200],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 11,
    color: COLORS.charcoal[700],
  },
  timeText: {
    fontSize: 11,
    color: COLORS.muted,
  },
});
