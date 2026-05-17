import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ArticleCard } from "../../components/ArticleCard";
import { MiniPlayer } from "../../components/MiniPlayer";
import { Button, IconButton } from "../../components/ui";
import { MOCK_ARTICLES } from "../../lib/mockData";
import {
  isPreferencesEmpty,
  preferencesSummary,
} from "../../lib/filterArticles";
import { CATEGORY_LABELS } from "../../lib/types";
import { useMyListPreferences } from "../../hooks/useMyListPreferences";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";

export default function MyListScreen() {
  const router = useRouter();
  const { prefs, applyFilters, isLoading, isSyncing } = useMyListPreferences();

  const articles = useMemo(
    () => applyFilters(MOCK_ARTICLES),
    [applyFilters]
  );
  const summary = preferencesSummary(prefs);
  const isEmpty = isPreferencesEmpty(prefs);
  const showNoMatches = !isEmpty && articles.length === 0;

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    prefs.categories.forEach((c) => chips.push(CATEGORY_LABELS[c]));
    prefs.sources.forEach((s) => chips.push(s));
    return chips;
  }, [prefs]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Listem</Text>
            <Text style={styles.subtitle}>
              Sadece dinlemek istediğin haberler.
            </Text>
          </View>
          <IconButton
            icon="create-outline"
            variant="filled"
            size={42}
            onPress={() => router.push("/mylist/edit")}
          />
        </View>

        <View style={styles.summaryRow}>
          <Ionicons
            name="options-outline"
            size={14}
            color={COLORS.subtleForeground}
          />
          <Text style={styles.summaryText} numberOfLines={1}>
            {summary}
          </Text>
          {isSyncing && (
            <ActivityIndicator size="small" color={COLORS.primary} />
          )}
        </View>

        {activeChips.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
          >
            {activeChips.map((label) => (
              <View key={label} style={styles.chip}>
                <Text style={styles.chipText}>{label}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons
                name="list-outline"
                size={28}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>Listeni oluştur</Text>
            <Text style={styles.emptyText}>
              Kategoriler ve haber kaynakları seçerek günlük dinleme listeni
              oluştur.
            </Text>
            <Button
              label="Filtreleri Düzenle"
              variant="primary"
              size="md"
              onPress={() => router.push("/mylist/edit")}
              style={styles.emptyBtn}
            />
          </View>
        ) : showNoMatches ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="newspaper-outline"
              size={32}
              color={COLORS.subtleForeground}
            />
            <Text style={styles.emptyTitle}>Eşleşen haber yok</Text>
            <Text style={styles.emptyText}>
              Bu filtrelere uygun haber bulunamadı. Seçimlerini gözden geçir.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/mylist/edit")}
              activeOpacity={0.7}
              style={styles.editLinkBtn}
            >
              <Text style={styles.editLink}>Filtreleri Düzenle</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.feed}>
            <View style={styles.feedHeader}>
              <Text style={styles.feedTitle}>
                {articles.length} haber seninle
              </Text>
            </View>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
              />
            ))}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  headerText: {
    flex: 1,
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
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  summaryText: {
    flex: 1,
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.subtleForeground,
  },
  chipList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.foreground,
  },
  feed: {
    marginTop: 4,
  },
  feedHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  feedTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: COLORS.mutedForeground,
  },
  centered: {
    paddingVertical: 80,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    color: COLORS.foreground,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 8,
  },
  editLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  editLink: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: COLORS.primary,
  },
});
