"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image, Switch } from "react-native"
import { theme } from "../theme/colors"
import { useAuth } from "../context/AuthContext"
import { useApplications } from "../context/ApplicationsContext"

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const { applications } = useApplications()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(true)

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ])
  }

  const handleSettings = () => {
    Alert.alert("Settings", "Settings functionality coming soon!")
  }

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing functionality coming soon!")
  }

  const handleViewResume = () => {
    Alert.alert("View Resume", "Resume viewing functionality coming soon!")
  }

  const handleSupport = () => {
    Alert.alert("Support", "Contact support at support@startupconnect.com")
  }

  const handlePrivacyPolicy = () => {
    Alert.alert("Privacy Policy", "Privacy policy functionality coming soon!")
  }

  const handleTermsOfService = () => {
    Alert.alert("Terms of Service", "Terms of service functionality coming soon!")
  }

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        {user?.picture ? (
          <Image source={{ uri: user.picture }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>{user?.name?.charAt(0) || "U"}</Text>
          </View>
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{user?.name || "User"}</Text>
        <Text style={styles.profileEmail}>{user?.email || "user@example.com"}</Text>
      </View>
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  )

  const renderStatsSection = () => (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Your Activity</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{applications.length}</Text>
          <Text style={styles.statLabel}>Total Applications</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{applications.filter((app) => app.status === "sent").length}</Text>
          <Text style={styles.statLabel}>Applications Sent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{applications.filter((app) => app.status === "pending").length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
    </View>
  )

  const renderFilesSection = () => (
    <View style={styles.filesSection}>
      <Text style={styles.sectionTitle}>Uploaded Files</Text>
      <TouchableOpacity style={styles.fileItem} onPress={handleViewResume}>
        <View style={styles.fileIcon}>
          <Text style={styles.fileIconText}>📄</Text>
        </View>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>Resume.pdf</Text>
          <Text style={styles.fileDate}>Uploaded recently</Text>
        </View>
        <Text style={styles.fileArrow}>›</Text>
      </TouchableOpacity>
    </View>
  )

  const renderSettingsSection = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Preferences</Text>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Text style={styles.settingDescription}>Get notified about new opportunities</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: theme.colors.lightGray, true: theme.colors.navy }}
          thumbColor={notificationsEnabled ? theme.colors.white : theme.colors.gray}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Email Updates</Text>
          <Text style={styles.settingDescription}>Receive weekly application summaries</Text>
        </View>
        <Switch
          value={emailUpdatesEnabled}
          onValueChange={setEmailUpdatesEnabled}
          trackColor={{ false: theme.colors.lightGray, true: theme.colors.navy }}
          thumbColor={emailUpdatesEnabled ? theme.colors.white : theme.colors.gray}
        />
      </View>
    </View>
  )

  const renderAccountSection = () => (
    <View style={styles.accountSection}>
      <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
        <Text style={styles.menuItemText}>Edit Profile</Text>
        <Text style={styles.menuItemArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
        <Text style={styles.menuItemText}>Support</Text>
        <Text style={styles.menuItemArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy}>
        <Text style={styles.menuItemText}>Privacy Policy</Text>
        <Text style={styles.menuItemArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleTermsOfService}>
        <Text style={styles.menuItemText}>Terms of Service</Text>
        <Text style={styles.menuItemArrow}>›</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderProfileHeader()}
        {renderStatsSection()}
        {renderFilesSection()}
        {renderSettingsSection()}
        {renderAccountSection()}

        <View style={styles.appInfoSection}>
          <Text style={styles.appVersion}>Startup Connect v1.0.0</Text>
          <Text style={styles.appDescription}>Connect with startups that match your skills</Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.lightBeige,
    borderRadius: theme.borderRadius.md,
  },
  profileImageContainer: {
    marginRight: theme.spacing.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
  statsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  statNumber: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    textAlign: "center",
  },
  filesSection: {
    marginBottom: theme.spacing.xl,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.lightBeige,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.beige,
  },
  fileIcon: {
    marginRight: theme.spacing.md,
  },
  fileIconText: {
    fontSize: 32,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.navy,
    marginBottom: theme.spacing.xs,
  },
  fileDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  fileArrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray,
  },
  settingsSection: {
    marginBottom: theme.spacing.xl,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.navy,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  accountSection: {
    marginBottom: theme.spacing.xl,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.navy,
  },
  menuItemArrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray,
  },
  appInfoSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  appVersion: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginBottom: theme.spacing.xs,
  },
  appDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    textAlign: "center",
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  signOutButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
})
