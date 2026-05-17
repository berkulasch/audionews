import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS, SHADOW } from "../constants/theme";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

export function MiniPlayer() {
  const router = useRouter();
  const { currentArticle, isPlaying, togglePlay, progress } = useAudioPlayer();

  if (!currentArticle) return null;

  const progressPercent = Math.max(0, Math.min(1, progress)) * 100;

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
          <Text style={styles.source} numberOfLines={1}>
            {currentArticle.source}
          </Text>
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
          activeOpacity={0.85}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={16}
            color={COLORS.primaryForeground}
            style={!isPlaying ? { marginLeft: 2 } : undefined}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 86,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    marginHorizontal: 12,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.floating,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.muted,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
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
    borderRadius: 10,
    backgroundColor: COLORS.muted,
  },
  info: {
    flex: 1,
  },
  source: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 14,
    color: COLORS.foreground,
    marginTop: 3,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
