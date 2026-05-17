import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, IconButton } from "../../components/ui";
import { PreferenceSection } from "../../components/mylist/PreferenceSection";
import { SelectableChip } from "../../components/mylist/SelectableChip";
import { SegmentedControl } from "../../components/mylist/SegmentedControl";
import { NEWS_SOURCES } from "../../lib/sources";
import {
  CATEGORY_LABELS,
  DEFAULT_MY_LIST_PREFERENCES,
  ListDuration,
  ListRecency,
  ListSort,
  NewsCategory,
  MyListPreferences,
} from "../../lib/types";
import { useMyListPreferences } from "../../hooks/useMyListPreferences";
import {
  COLORS,
  FONTS,
  RADIUS,
  CATEGORY_COLORS,
} from "../../constants/theme";

const CATEGORIES: NewsCategory[] = [
  "politics",
  "economy",
  "sports",
  "technology",
  "world",
  "culture",
];

const RECENCY_OPTIONS: { value: ListRecency; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "today", label: "Bugün" },
  { value: "24h", label: "24 sa" },
  { value: "week", label: "Hafta" },
];

const DURATION_OPTIONS: { value: ListDuration; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "short", label: "Kısa" },
  { value: "medium", label: "Orta" },
  { value: "long", label: "Uzun" },
];

const SORT_OPTIONS: { value: ListSort; label: string }[] = [
  { value: "newest", label: "En Yeni" },
  { value: "shortest", label: "En Kısa" },
];

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function EditMyListScreen() {
  const router = useRouter();
  const { prefs, setPrefs } = useMyListPreferences();
  const [draft, setDraft] = useState<MyListPreferences>(prefs);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(prefs);
  }, [prefs]);

  const handleSave = async () => {
    setIsSaving(true);
    await setPrefs({ ...draft, updatedAt: new Date().toISOString() });
    setIsSaving(false);
    router.back();
  };

  const handleReset = () => {
    setDraft({
      ...DEFAULT_MY_LIST_PREFERENCES,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton
          icon="close"
          variant="filled"
          size={36}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Listemi Düzenle</Text>
        <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <PreferenceSection
          title="Kategoriler"
          description="Birden fazla seçebilirsin. Hiçbiri seçilmezse tümü gösterilir."
        >
          <View style={styles.chipWrap}>
            {CATEGORIES.map((cat) => (
              <SelectableChip
                key={cat}
                label={CATEGORY_LABELS[cat]}
                selected={draft.categories.includes(cat)}
                accent={CATEGORY_COLORS[cat]}
                onPress={() =>
                  setDraft((d) => ({
                    ...d,
                    categories: toggleInArray(d.categories, cat),
                  }))
                }
              />
            ))}
          </View>
        </PreferenceSection>

        <PreferenceSection
          title="Haber Kaynakları"
          description="Sadece seçtiğin gazetelerin haberlerini görürsün."
        >
          <View style={styles.chipWrap}>
            {NEWS_SOURCES.map((source) => (
              <SelectableChip
                key={source.id}
                label={source.name}
                initials={source.initials}
                selected={draft.sources.includes(source.name)}
                accent={CATEGORY_COLORS[source.defaultCategory]}
                onPress={() =>
                  setDraft((d) => ({
                    ...d,
                    sources: toggleInArray(d.sources, source.name),
                  }))
                }
              />
            ))}
          </View>
        </PreferenceSection>

        <PreferenceSection
          title="Zaman"
          description="Sadece son yayınlanan haberleri göster."
        >
          <SegmentedControl
            value={draft.recency}
            onChange={(v) => setDraft((d) => ({ ...d, recency: v }))}
            options={RECENCY_OPTIONS}
          />
        </PreferenceSection>

        <PreferenceSection
          title="Süre"
          description="Kısa: ≤3 dk · Orta: 3–6 dk · Uzun: 6+ dk"
        >
          <SegmentedControl
            value={draft.duration}
            onChange={(v) => setDraft((d) => ({ ...d, duration: v }))}
            options={DURATION_OPTIONS}
          />
        </PreferenceSection>

        <PreferenceSection title="Sıralama">
          <SegmentedControl
            value={draft.sort}
            onChange={(v) => setDraft((d) => ({ ...d, sort: v }))}
            options={SORT_OPTIONS}
          />
        </PreferenceSection>

        <PreferenceSection title="Daha Akıllı">
          <View style={styles.toggleRow}>
            <View style={styles.toggleText}>
              <Text style={styles.toggleLabel}>Sadece dinlenmemiş</Text>
              <Text style={styles.toggleHint}>
                Daha önce dinlediğin haberler listeye eklenmez.
              </Text>
            </View>
            <Switch
              value={draft.unlistenedOnly}
              onValueChange={(value) =>
                setDraft((d) => ({ ...d, unlistenedOnly: value }))
              }
              trackColor={{
                false: COLORS.muted,
                true: COLORS.primary,
              }}
              thumbColor={
                draft.unlistenedOnly
                  ? COLORS.primaryForeground
                  : COLORS.subtleForeground
              }
            />
          </View>
        </PreferenceSection>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isSaving ? "Kaydediliyor..." : "Kaydet"}
          variant="primary"
          size="lg"
          fullWidth
          loading={isSaving}
          leftIcon={
            !isSaving ? (
              <Ionicons
                name="checkmark"
                size={18}
                color={COLORS.primaryForeground}
              />
            ) : undefined
          }
          onPress={handleSave}
        />
      </View>
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
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.foreground,
    textAlign: "center",
  },
  resetText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: COLORS.primary,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: COLORS.foreground,
  },
  toggleHint: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.mutedForeground,
    marginTop: 4,
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
