"use client"

import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { theme } from "../theme/colors"
import { useAuth } from "../context/AuthContext"

interface AuthScreenProps {
  navigation: any
}

export default function AuthScreen({ navigation }: AuthScreenProps) {
  const { signInWithGoogle, isLoading } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Navigation will be handled by App.tsx based on auth state
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Startup Connect</Text>
          <Text style={styles.subtitle}>Connect with startups that match your skills</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>Continue with Google</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} onPress={() => navigation.navigate("ResumeUpload")}>
            <Text style={styles.demoButtonText}>Continue as Demo User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  googleButton: {
    backgroundColor: theme.colors.navy,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: theme.colors.gray,
  },
  demoButton: {
    backgroundColor: theme.colors.beige,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.navy,
  },
  demoButtonText: {
    color: theme.colors.navy,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
})
