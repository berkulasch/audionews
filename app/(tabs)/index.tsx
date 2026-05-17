import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FeaturedCard } from "../../components/FeaturedCard";
import { ArticleCard } from "../../components/ArticleCard";
import { CategoryPill } from "../../components/CategoryPill";
import { MiniPlayer } from "../../components/MiniPlayer";
import { IconButton } from "../../components/ui";
import {
  getFeaturedArticle,
  getArticlesByCategory,
  MOCK_ARTICLES,
} from "../../lib/mockData";
import { NewsCategory } from "../../lib/types";
import { COLORS, FONTS } from "../../constants/theme";

const CATEGORIES: NewsCategory[] = [
  "all",
  "economy",
  "politics",
  "sports",
  "technology",
  "world",
  "culture",
];

const GREETING_DATE = new Date().toLocaleDateString("tr-TR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

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
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{GREETING_DATE}</Text>
            <Text style={styles.logo}>AudioHaber</Text>
          </View>
          <IconButton icon="notifications-outline" variant="filled" size={42} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Öne Çıkan</Text>
        </View>
        <FeaturedCard article={featured} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Günün Haberleri</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.seeAllRow}>
            <Text style={styles.seeAll}>Tümü</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              category={cat}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>

        <View style={{ marginTop: 4 }}>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="horizontal"
            />
          ))}
          {articles.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="newspaper-outline"
                size={32}
                color={COLORS.subtleForeground}
              />
              <Text style={styles.emptyText}>
                Bu kategoride henüz haber yok.
              </Text>
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
    backgroundColor: COLORS.background,
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
    paddingBottom: 20,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.mutedForeground,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  logo: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    color: COLORS.foreground,
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.foreground,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAll: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: COLORS.primary,
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontFamily: FONTS.sans,
    color: COLORS.subtleForeground,
    fontSize: 14,
  },
});
