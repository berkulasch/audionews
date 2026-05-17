import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useState, useMemo } from "react";
import { ArticleCard } from "../../components/ArticleCard";
import { MiniPlayer } from "../../components/MiniPlayer";
import { MOCK_ARTICLES } from "../../lib/mockData";
import { NewsCategory, CATEGORY_LABELS, CATEGORY_ICONS } from "../../lib/types";
import { COLORS, FONTS } from "../../constants/theme";

const CATEGORIES: { id: NewsCategory; label: string; icon: string }[] = [
  { id: "economy", label: "Ekonomi", icon: "📈" },
  { id: "politics", label: "Siyaset", icon: "🏛️" },
  { id: "sports", label: "Spor", icon: "⚽" },
  { id: "technology", label: "Teknoloji", icon: "💻" },
  { id: "world", label: "Dünya", icon: "🌍" },
  { id: "culture", label: "Kültür", icon: "🎭" },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);

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
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Keşfet</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Haber, kaynak veya konu ara..."
            placeholderTextColor={COLORS.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category grid */}
        {!searchQuery && (
          <>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )
                  }
                  style={[
                    styles.categoryCard,
                    selectedCategory === cat.id && styles.categoryCardActive,
                  ]}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === cat.id && styles.categoryLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Results */}
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? CATEGORY_LABELS[selectedCategory]
              : searchQuery
              ? `"${searchQuery}" sonuçları`
              : "Tüm Haberler"}
          </Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilter}>Temizle ✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
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
    backgroundColor: COLORS.cream[200],
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    color: COLORS.charcoal[900],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream[100],
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.charcoal[900],
  },
  clearBtn: {
    fontSize: 14,
    color: COLORS.muted,
    padding: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    color: COLORS.charcoal[900],
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryCard: {
    width: "30%",
    backgroundColor: COLORS.cream[100],
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.cream[300],
    gap: 6,
  },
  categoryCardActive: {
    backgroundColor: COLORS.charcoal[900],
    borderColor: COLORS.charcoal[900],
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.charcoal[700],
    textAlign: "center",
  },
  categoryLabelActive: {
    color: COLORS.white,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  clearFilter: {
    fontSize: 12,
    color: COLORS.gold[500],
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    color: COLORS.charcoal[900],
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
  },
});
