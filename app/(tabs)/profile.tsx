import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";
import { MiniPlayer } from "../../components/MiniPlayer";
import { Button } from "../../components/ui";
import { useAuth } from "../../contexts/AuthProvider";
import { useMyListPreferences } from "../../hooks/useMyListPreferences";
import { preferencesSummary } from "../../lib/filterArticles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const LISTENING_STATS = [
  { label: "Dinlenen", value: "24", unit: "haber" },
  { label: "Toplam Süre", value: "3.2", unit: "saat" },
  { label: "Bu Hafta", value: "8", unit: "haber" },
];

interface MenuItem {
  icon: IconName;
  label: string;
  description?: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthLoading, signOut } = useAuth();
  const { prefs } = useMyListPreferences();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isLoggedIn = !!user;

  if (isAuthLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
        <MiniPlayer />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authContainer}>
          <View style={styles.authLogoWrap}>
            <Ionicons name="headset" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.authTitle}>AudioHaber'e Hoş Geldiniz</Text>
          <Text style={styles.authSubtitle}>
            Favorilerinizi kaydetmek ve dinleme geçmişinizi görüntülemek için
            giriş yapın.
          </Text>
          <Button
            label="Giriş Yap"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push("/auth/login")}
            style={styles.authBtn}
          />
          <Button
            label="Ücretsiz Kayıt Ol"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => router.push("/auth/register")}
          />
        </View>
        <MiniPlayer />
      </SafeAreaView>
    );
  }

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Kullanıcı";
  const email = user.email ?? "";
  const initial = displayName.charAt(0).toUpperCase() || "?";

  const menuItems: MenuItem[] = [
    {
      icon: "list-outline",
      label: "Listem",
      description: preferencesSummary(prefs),
      onPress: () => router.push("/mylist/edit"),
    },
    { icon: "heart-outline", label: "Favorilerim" },
    { icon: "time-outline", label: "Dinleme Geçmişi" },
    { icon: "notifications-outline", label: "Bildirimler" },
    { icon: "settings-outline", label: "Ayarlar" },
    { icon: "help-circle-outline", label: "Yardım & Destek" },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
            <Ionicons name="pencil" size={14} color={COLORS.primary} />
            <Text style={styles.editBtnText}>Düzenle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {LISTENING_STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statUnit}>{stat.unit}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Hesabım</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
              onPress={item.onPress}
              disabled={!item.onPress}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.menuTextWrap}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.description ? (
                  <Text style={styles.menuDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.subtleForeground}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color={COLORS.destructive} />
          ) : (
            <Ionicons
              name="log-out-outline"
              size={18}
              color={COLORS.destructive}
            />
          )}
          <Text style={styles.logoutText}>
            {isSigningOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Text>
        </TouchableOpacity>
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
  authContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  authLogoWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  authTitle: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    color: COLORS.foreground,
    textAlign: "center",
    marginBottom: 10,
  },
  authSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  authBtn: {
    marginBottom: 10,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    color: COLORS.primaryForeground,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.foreground,
  },
  profileEmail: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.mutedForeground,
    marginTop: 2,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editBtnText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    color: COLORS.foreground,
  },
  statUnit: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 2,
  },
  statLabel: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.mutedForeground,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.foreground,
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 14,
    color: COLORS.foreground,
  },
  menuDescription: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.mutedForeground,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.destructive,
  },
  logoutText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: COLORS.destructive,
  },
});
