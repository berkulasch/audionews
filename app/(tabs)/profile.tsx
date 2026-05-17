import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../../constants/theme";
import { MiniPlayer } from "../../components/MiniPlayer";

const LISTENING_STATS = [
  { label: "Dinlenen", value: "24", unit: "haber" },
  { label: "Toplam Süre", value: "3.2", unit: "saat" },
  { label: "Bu Hafta", value: "8", unit: "haber" },
];

const MENU_ITEMS = [
  { icon: "❤️", label: "Favorilerim", count: 12 },
  { icon: "🕐", label: "Dinleme Geçmişi", count: 24 },
  { icon: "🔔", label: "Bildirimler", count: null },
  { icon: "⚙️", label: "Ayarlar", count: null },
  { icon: "📰", label: "Haber Kaynakları", count: null },
  { icon: "❓", label: "Yardım & Destek", count: null },
];

export default function ProfileScreen() {
  const router = useRouter();
  const isLoggedIn = false; // Gerçek uygulamada auth state

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authContainer}>
          <Text style={styles.authLogo}>📻</Text>
          <Text style={styles.authTitle}>AudioHaber'e Hoş Geldiniz</Text>
          <Text style={styles.authSubtitle}>
            Favorilerinizi kaydetmek ve dinleme geçmişinizi görüntülemek için giriş yapın.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginBtnText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.registerBtnText}>Ücretsiz Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
        <MiniPlayer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Berk Kullanıcı</Text>
            <Text style={styles.profileEmail}>berk@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {LISTENING_STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statUnit}>{stat.unit}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
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
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                {item.count !== null && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                )}
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
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
    backgroundColor: COLORS.cream[200],
  },
  authContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  authLogo: {
    fontSize: 60,
    marginBottom: 20,
  },
  authTitle: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    color: COLORS.charcoal[900],
    textAlign: "center",
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: COLORS.charcoal[900],
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  registerBtn: {
    backgroundColor: COLORS.gold[500],
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  registerBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
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
    backgroundColor: COLORS.gold[500],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.charcoal[900],
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold[500],
  },
  editBtnText: {
    fontSize: 13,
    color: COLORS.gold[500],
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cream[100],
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    color: COLORS.charcoal[900],
  },
  statUnit: {
    fontSize: 11,
    color: COLORS.gold[500],
    fontWeight: "600",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    color: COLORS.charcoal[900],
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: COLORS.cream[100],
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
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
    borderBottomColor: COLORS.cream[200],
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.charcoal[900],
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    backgroundColor: COLORS.gold[500],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: "700",
  },
  chevron: {
    fontSize: 18,
    color: COLORS.muted,
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E53E3E",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    color: "#E53E3E",
    fontWeight: "600",
  },
});
