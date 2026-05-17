import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";
import { MiniPlayer } from "../../components/MiniPlayer";
import { Button } from "../../components/ui";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const LISTENING_STATS = [
  { label: "Dinlenen", value: "24", unit: "haber" },
  { label: "Toplam Süre", value: "3.2", unit: "saat" },
  { label: "Bu Hafta", value: "8", unit: "haber" },
];

const MENU_ITEMS: {
  icon: IconName;
  label: string;
  count: number | null;
}[] = [
  { icon: "heart-outline", label: "Favorilerim", count: 12 },
  { icon: "time-outline", label: "Dinleme Geçmişi", count: 24 },
  { icon: "notifications-outline", label: "Bildirimler", count: null },
  { icon: "settings-outline", label: "Ayarlar", count: null },
  { icon: "newspaper-outline", label: "Haber Kaynakları", count: null },
  { icon: "help-circle-outline", label: "Yardım & Destek", count: null },
];

export default function ProfileScreen() {
  const router = useRouter();
  const isLoggedIn = false;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Berk Kullanıcı</Text>
            <Text style={styles.profileEmail}>berk@example.com</Text>
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
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.count !== null && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.subtleForeground}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.destructive} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
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
  menuLabel: {
    flex: 1,
    fontFamily: FONTS.sansMedium,
    fontSize: 14,
    color: COLORS.foreground,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 22,
    alignItems: "center",
  },
  countText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: COLORS.primaryForeground,
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
