import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ArticleCard } from "../../components/ArticleCard";
import { MiniPlayer } from "../../components/MiniPlayer";
import { SearchInput } from "../../components/ui";
import { MOCK_ARTICLES } from "../../lib/mockData";
import { NewsCategory, CATEGORY_LABELS } from "../../lib/types";
import { COLORS, FONTS, RADIUS, CATEGORY_COLORS } from "../../constants/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const CATEGORIES: {
  id: NewsCategory;
  label: string;
  icon: IconName;
}[] = [
  { id: "economy", label: "Ekonomi", icon: "trending-up" },
  { id: "politics", label: "Siyaset", icon: "business" },
  { id: "sports", label: "Spor", icon: "football" },
  { id: "technology", label: "Teknoloji", icon: "hardware-chip" },
  { id: "world", label: "Dünya", icon: "earth" },
  { id: "culture", label: "Kültür", icon: "color-palette" },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<NewsCategory | null>(null);

  const filteredArticles = useMemo(() => {
    let result = MOCK_ARTICLES;
    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Keşfet</Text>
          <Text style={styles.subtitle}>
            Konuya, kaynağa veya kategoriye göre dinle.
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Haber, kaynak veya konu ara"
            onClear={() => setSearchQuery("")}
          />
        </View>

        {!searchQuery && (
          <>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const accent = CATEGORY_COLORS[cat.id];
                const isActive = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.88}
                    onPress={() =>
                      setSelectedCategory(isActive ? null : cat.id)
                    }
                    style={[
                      styles.categoryCard,
                      isActive && { borderColor: accent },
                    ]}
                  >
                    <View
                      style={[styles.accentBar, { backgroundColor: accent }]}
                    />
                    <View style={styles.categoryCardContent}>
                      <View
                        style={[
                          styles.categoryIconWrap,
                          { backgroundColor: accent + "26" },
                        ]}
                      >
                        <Ionicons name={cat.icon} size={20} color={accent} />
                      </View>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? CATEGORY_LABELS[selectedCategory]
              : searchQuery
              ? `"${searchQuery}" sonuçları`
              : "Tüm Haberler"}
          </Text>
          {selectedCategory && (
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={styles.clearFilterBtn}
            >
              <Text style={styles.clearFilter}>Temizle</Text>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="horizontal"
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={36}
              color={COLORS.subtleForeground}
            />
            <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
            <Text style={styles.emptyText}>
              "{searchQuery}" ile eşleşen haber yok.
            </Text>
          </View>
        )}
      </ScrollView>

      <MiniPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    color: COLORS.foreground,
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.mutedForeground,
    marginTop: 4,
  },
  searchWrap: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.foreground,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryCard: {
    width: "47%",
    marginHorizontal: "1.5%",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
  },
  accentBar: {
    width: 4,
  },
  categoryCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: COLORS.foreground,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  clearFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clearFilter: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.foreground,
    marginTop: 4,
  },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.subtleForeground,
    textAlign: "center",
  },
});
