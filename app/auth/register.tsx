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
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";
import { Button, IconButton } from "../../components/ui";

type Field = "name" | "email" | "password";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<Field | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 1000);
  };

  const isValid =
    name.length > 1 && email.includes("@") && password.length >= 6;

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
            <IconButton
              icon="close"
              variant="filled"
              size={36}
              onPress={() => router.back()}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.logoWrap}>
              <Ionicons name="headset" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Ücretsiz kayıt olun, haberleri sesli dinleyin.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ad Soyad</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "name" && styles.inputFocused,
                  ]}
                  placeholder="Adınız Soyadınız"
                  placeholderTextColor={COLORS.subtleForeground}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-posta</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "email" && styles.inputFocused,
                  ]}
                  placeholder="ornek@email.com"
                  placeholderTextColor={COLORS.subtleForeground}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Şifre</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "password" && styles.inputFocused,
                  ]}
                  placeholder="En az 6 karakter"
                  placeholderTextColor={COLORS.subtleForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                {password.length > 0 && password.length < 6 && (
                  <Text style={styles.validationText}>
                    Şifre en az 6 karakter olmalıdır.
                  </Text>
                )}
              </View>

              <Button
                label={isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={!isValid}
                onPress={handleRegister}
                style={{ marginTop: 8, marginBottom: 16 }}
              />

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
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    color: COLORS.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.mutedForeground,
    marginBottom: 28,
  },
  form: {
    gap: 4,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.mutedForeground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.foreground,
  },
  inputFocused: {
    borderColor: COLORS.ring,
  },
  validationText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.destructive,
    marginTop: 6,
  },
  termsText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    fontFamily: FONTS.sansSemiBold,
    color: COLORS.primary,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 32,
  },
  loginText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.mutedForeground,
  },
  loginLink: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: COLORS.primary,
  },
});
