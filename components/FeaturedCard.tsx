import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Article } from "../lib/types";
import { COLORS, FONTS } from "../constants/theme";
import { formatDuration, timeAgo } from "../lib/mockData";

interface FeaturedCardProps {
  article: Article;
}

export function FeaturedCard({ article }: FeaturedCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/article/${article.id}`)}
      style={styles.container}
    >
      <Image source={{ uri: article.imageUrl }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{article.source}</Text>
        </View>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
        <View style={styles.meta}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
            {article.duration && (
              <Text style={styles.duration}>{formatDuration(article.duration)}</Text>
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
    borderRadius: 20,
    overflow: "hidden",
    height: 260,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  sourceBadge: {
    backgroundColor: COLORS.gold[500],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  sourceText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    color: COLORS.white,
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
    backgroundColor: COLORS.gold[500],
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    gap: 6,
  },
  playIcon: {
    color: COLORS.white,
    fontSize: 12,
  },
  duration: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  time: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
  },
});
