import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { saveUserToFirestore } from "@/services/userService";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Focus states
  const [firstFocused, setFirstFocused] = useState(false);
  const [lastFocused, setLastFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Step 1: Start sign-up → triggers email verification
  const handleSignUp = useCallback(async () => {
    if (!isLoaded) return;
    if (!firstName || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage || err?.message || "Sign up failed.";
      Alert.alert("Sign Up Error", message);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, firstName, lastName, email, password]);

  // Step 2: Verify the email code
  const handleVerify = useCallback(async () => {
    if (!isLoaded) return;
    setVerifyLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await saveUserToFirestore({
          uid: result.createdUserId!,
          email,
          displayName: `${firstName} ${lastName}`.trim(),
          photoURL: null,
          provider: "email",
        });
        router.replace("/(tabs)");
      } else {
        Alert.alert("Verification", "Please check the code and try again.");
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage || err?.message || "Verification failed.";
      Alert.alert("Verification Error", message);
    } finally {
      setVerifyLoading(false);
    }
  }, [isLoaded, code, email, firstName, lastName]);

  // Google OAuth
  const handleGoogleSignUp = useCallback(async () => {
    setGoogleLoading(true);
    try {
      const { createdSessionId, setActive: setActiveOAuth, signUp: googleSignUp } =
        await startOAuthFlow();
      if (createdSessionId) {
        await setActiveOAuth!({ session: createdSessionId });
        const user = googleSignUp?.userData;
        await saveUserToFirestore({
          uid: user?.externalId ?? createdSessionId,
          email: user?.emailAddresses?.[0]?.emailAddress ?? null,
          displayName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
          photoURL: user?.imageUrl ?? null,
          provider: "google",
        });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert("Google Sign In Error", err?.message || "Something went wrong.");
    } finally {
      setGoogleLoading(false);
    }
  }, [startOAuthFlow]);

  // ─── VERIFICATION SCREEN ───────────────────────────────────────────────────
  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.verifyContainer, { opacity: fadeAnim }]}>
          <View style={styles.verifyIconWrapper}>
            <Ionicons name="mail-open-outline" size={40} color="#4ADE80" />
          </View>
          <Text style={styles.headline}>Check your email</Text>
          <Text style={styles.subheadline}>
            We sent a 6-digit code to{"\n"}
            <Text style={{ color: "#4ADE80" }}>{email}</Text>
          </Text>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <View style={[styles.inputWrapper, codeFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="key-outline"
                  size={18}
                  color={codeFocused ? "#4ADE80" : "#64748B"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor="#4A5568"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  onFocus={() => setCodeFocused(true)}
                  onBlur={() => setCodeFocused(false)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, verifyLoading && styles.btnDisabled]}
              onPress={handleVerify}
              disabled={verifyLoading}
              activeOpacity={0.85}
            >
              {verifyLoading ? (
                <ActivityIndicator color="#0A0E1A" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Verify Email</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#0A0E1A" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setPendingVerification(false)}
            >
              <Ionicons name="arrow-back" size={16} color="#64748B" />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ─── SIGN-UP FORM ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            {/* Logo */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoGlow} />
              <Image
                source={require("@/assets/images/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <Text style={styles.headline}>Create account</Text>
            <Text style={styles.subheadline}>
              Start your AI-powered nutrition journey
            </Text>

            {/* Card */}
            <View style={styles.card}>
              {/* Name Row */}
              <View style={styles.nameRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>First Name</Text>
                  <View style={[styles.inputWrapper, firstFocused && styles.inputWrapperFocused]}>
                    <TextInput
                      style={[styles.input, { paddingLeft: 14 }]}
                      placeholder="Jane"
                      placeholderTextColor="#4A5568"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                      onFocus={() => setFirstFocused(true)}
                      onBlur={() => setFirstFocused(false)}
                    />
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Last Name</Text>
                  <View style={[styles.inputWrapper, lastFocused && styles.inputWrapperFocused]}>
                    <TextInput
                      style={[styles.input, { paddingLeft: 14 }]}
                      placeholder="Doe"
                      placeholderTextColor="#4A5568"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                      onFocus={() => setLastFocused(true)}
                      onBlur={() => setLastFocused(false)}
                    />
                  </View>
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={emailFocused ? "#4ADE80" : "#64748B"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#4A5568"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={passwordFocused ? "#4ADE80" : "#64748B"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="#4A5568"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password hint */}
              <View style={styles.passwordHint}>
                <Ionicons name="shield-checkmark-outline" size={13} color="#475569" />
                <Text style={styles.passwordHintText}>
                  At least 8 characters with a number
                </Text>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.btnDisabled]}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#0A0E1A" />
                ) : (
                  <>
                    <Text style={styles.primaryBtnText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={18} color="#0A0E1A" />
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Button */}
              <TouchableOpacity
                style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
                onPress={handleGoogleSignUp}
                disabled={googleLoading}
                activeOpacity={0.85}
              >
                {googleLoading ? (
                  <ActivityIndicator color="#E2E8F0" />
                ) : (
                  <>
                    <View style={styles.googleIconWrapper}>
                      <Text style={styles.googleIconText}>G</Text>
                    </View>
                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Terms */}
              <Text style={styles.terms}>
                By creating an account you agree to our{" "}
                <Text style={styles.termsLink}>Terms</Text> &{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0A0E1A" },
  keyboardView: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  container: { alignItems: "center", width: "100%" },

  // Logo
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    width: 100,
    height: 100,
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(74, 222, 128, 0.18)",
  },
  logo: { width: 82, height: 82, borderRadius: 20 },

  // Header
  headline: {
    fontSize: 30,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  subheadline: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 24,
    marginBottom: 24,
  },

  // Name row
  nameRow: { flexDirection: "row" },

  // Inputs
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: "#4ADE80",
    backgroundColor: "rgba(74,222,128,0.06)",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#F8FAFC", fontSize: 15, paddingVertical: 0 },
  eyeBtn: { padding: 4 },

  // Password hint
  passwordHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -8,
    marginBottom: 16,
  },
  passwordHintText: { fontSize: 12, color: "#475569" },

  // Primary Button
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4ADE80",
    borderRadius: 50,
    height: 54,
    marginTop: 4,
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700", color: "#0A0E1A" },
  btnDisabled: { opacity: 0.6 },

  // Divider
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 12, color: "#475569", marginHorizontal: 12, fontWeight: "500" },

  // Google Button
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  googleBtnText: { fontSize: 15, fontWeight: "600", color: "#E2E8F0" },
  googleIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconText: { fontSize: 14, fontWeight: "800", color: "#4285F4" },

  // Terms
  terms: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 16,
  },
  termsLink: { color: "#4ADE80", fontWeight: "600" },

  // Footer
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  footerText: { fontSize: 14, color: "#64748B" },
  footerLink: { fontSize: 14, color: "#4ADE80", fontWeight: "700" },

  // Verification screen
  verifyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  verifyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(74,222,128,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  backBtnText: { fontSize: 14, color: "#64748B" },
});
