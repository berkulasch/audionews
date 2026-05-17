import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../constants/theme";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

export function MiniPlayer() {
  const router = useRouter();
  const { currentArticle, isPlaying, togglePlay, progress } = useAudioPlayer();

  if (!currentArticle) return null;

  const progressPercent = Math.round(progress * 100);

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => router.push(`/article/${currentArticle.id}`)}
      style={styles.container}
    >
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` as any }]} />
      </View>
      <View style={styles.content}>
        <Image source={{ uri: currentArticle.imageUrl }} style={styles.thumbnail} />
        <View style={styles.info}>
          <Text style={styles.source}>{currentArticle.source}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {currentArticle.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={styles.playBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: COLORS.charcoal[900],
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.gold[500],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  source: {
    fontSize: 10,
    color: COLORS.gold[400],
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    color: COLORS.white,
    fontFamily: FONTS.serif,
    marginTop: 2,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gold[500],
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: COLORS.white,
    fontSize: 14,
  },
});
