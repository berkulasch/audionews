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
import { useAuth } from "../../contexts/AuthProvider";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null
  );

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signIn(email.trim(), password);
      router.back();
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "Giriş yapılamadı. Tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={styles.title}>Tekrar Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>
              Hesabınıza giriş yaparak devam edin.
            </Text>

            <View style={styles.form}>
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
                <View
                  style={[
                    styles.passwordContainer,
                    focusedField === "password" && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.subtleForeground}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={COLORS.subtleForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              <Button
                label={isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={!email || !password}
                onPress={handleLogin}
              />
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Ionicons
                name="logo-apple"
                size={18}
                color={COLORS.foreground}
              />
              <Text style={styles.socialText}>Apple ile Devam Et</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { marginTop: 10 }]}
              activeOpacity={0.85}
            >
              <Ionicons
                name="logo-google"
                size={18}
                color={COLORS.foreground}
              />
              <Text style={styles.socialText}>Google ile Devam Et</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Hesabınız yok mu? </Text>
              <TouchableOpacity
                onPress={() => router.replace("/auth/register")}
              >
                <Text style={styles.registerLink}>Kayıt Ol</Text>
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.foreground,
  },
  eyeBtn: {
    padding: 4,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 18,
    paddingVertical: 4,
  },
  errorText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.destructive,
    marginBottom: 12,
    textAlign: "center",
  },
  forgotText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: COLORS.primary,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: COLORS.subtleForeground,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    gap: 10,
  },
  socialText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: COLORS.foreground,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 32,
  },
  registerText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.mutedForeground,
  },
  registerLink: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: COLORS.primary,
  },
});
