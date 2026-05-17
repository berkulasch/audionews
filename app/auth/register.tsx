import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../../constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    setIsLoading(true);
    // Firebase auth kayıt buraya gelecek
    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 1000);
  };

  const isValid = name.length > 1 && email.includes("@") && password.length >= 6;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.logo}>📻</Text>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Ücretsiz kayıt olun, haberleri sesli dinleyin.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınız Soyadınız"
                  placeholderTextColor={COLORS.muted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-posta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  placeholderTextColor={COLORS.muted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Şifre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
                  placeholderTextColor={COLORS.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                />
                {password.length > 0 && password.length < 6 && (
                  <Text style={styles.validationText}>
                    Şifre en az 6 karakter olmalıdır.
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.registerBtn, !isValid && styles.registerBtnDisabled]}
                onPress={handleRegister}
                disabled={!isValid || isLoading}
              >
                <Text style={styles.registerBtnText}>
                  {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                Kayıt olarak{" "}
                <Text style={styles.termsLink}>Kullanım Koşulları</Text>
                {" "}ve{" "}
                <Text style={styles.termsLink}>Gizlilik Politikası</Text>
                {"'nı"} kabul etmiş olursunuz.
              </Text>
            </View>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: "flex-end",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cream[100],
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 14,
    color: COLORS.charcoal[700],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 30,
    color: COLORS.charcoal[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 28,
  },
  form: {
    gap: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.charcoal[700],
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cream[100],
    borderWidth: 1,
    borderColor: COLORS.cream[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.charcoal[900],
  },
  validationText: {
    fontSize: 12,
    color: "#E53E3E",
    marginTop: 6,
  },
  registerBtn: {
    backgroundColor: COLORS.gold[500],
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  registerBtnDisabled: {
    opacity: 0.5,
  },
  registerBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  termsText: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.gold[500],
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.muted,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.gold[500],
    fontWeight: "700",
  },
});
