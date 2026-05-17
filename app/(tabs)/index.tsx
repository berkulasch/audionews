import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { FeaturedCard } from "../../components/FeaturedCard";
import { ArticleCard } from "../../components/ArticleCard";
import { MiniPlayer } from "../../components/MiniPlayer";
import {
  getFeaturedArticle,
  getArticlesByCategory,
  MOCK_ARTICLES,
} from "../../lib/mockData";
import { NewsCategory, CATEGORY_LABELS } from "../../lib/types";
import { COLORS, FONTS } from "../../constants/theme";

const CATEGORIES: NewsCategory[] = ["all", "economy", "politics", "sports", "technology", "world", "culture"];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("all");
  const featured = getFeaturedArticle();
  const articles = getArticlesByCategory(selectedCategory).filter(
    (a) => !a.isFeatured
  );
  const trending = MOCK_ARTICLES.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>📻 AudioHaber</Text>
            <Text style={styles.subtitle}>Bugünün haberleri, sesli</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Featured */}
        <Text style={styles.sectionTitle}>Öne Çıkan</Text>
        <FeaturedCard article={featured} />

        {/* Trending horizontal */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Günün Haberleri</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Tümü →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {trending.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </ScrollView>

        {/* Category filter */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryPill,
                selectedCategory === cat && styles.categoryPillActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Article list */}
        <View style={{ marginTop: 8 }}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
          {articles.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Bu kategoride haber bulunamadı.</Text>
            </View>
          )}
        </View>
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  logo: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    color: COLORS.charcoal[900],
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cream[100],
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    color: COLORS.charcoal[900],
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.gold[500],
    fontWeight: "600",
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: COLORS.cream[100],
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cream[300],
  },
  categoryPillActive: {
    backgroundColor: COLORS.charcoal[900],
    borderColor: COLORS.charcoal[900],
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.charcoal[700],
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
});
