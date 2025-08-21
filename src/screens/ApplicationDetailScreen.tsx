"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { theme } from "../theme/colors"
import { useApplications, type Application } from "../context/ApplicationsContext"

interface ApplicationDetailScreenProps {
  navigation: any
  route: {
    params: {
      application: Application
    }
  }
}

export default function ApplicationDetailScreen({ navigation, route }: ApplicationDetailScreenProps) {
  const { application } = route.params
  const { updateApplication, sendApplication, removeApplication } = useApplications()
  const [emailContent, setEmailContent] = useState(application.emailContent || "")
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    updateApplication(application.id, { emailContent })
    setIsEditing(false)
    Alert.alert("Success", "Email content updated successfully!")
  }

  const handleSend = () => {
    Alert.alert("Send Application", "Are you sure you want to send this application?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send",
        onPress: () => {
          sendApplication(application.id)
          Alert.alert("Success", "Application sent successfully!", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ])
        },
      },
    ])
  }

  const handleDelete = () => {
    Alert.alert("Delete Application", "Are you sure you want to delete this application?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeApplication(application.id)
          navigation.goBack()
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Company Info */}
          <View style={styles.companySection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{application.startup.name?.charAt(0) || '?'}</Text>
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{application.startup.name}</Text>
              <Text style={styles.jobTitle}>{application.startup.job_title}</Text>
              <Text style={styles.location}>{application.startup.location}</Text>
              {application.startup.website_url && <Text style={styles.website}>{application.startup.website_url}</Text>}
            </View>
          </View>

          {/* Application Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Application Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Applied:</Text>
              <Text style={styles.detailValue}>{application.appliedAt.toLocaleDateString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View style={[styles.statusBadge, styles[`${application.status}Badge`]]}>
                <Text style={[styles.statusText, styles[`${application.status}Text`]]}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Text>
              </View>
            </View>
            {application.startup.yc_batch && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>YC Batch:</Text>
                <Text style={styles.detailValue}>{application.startup.yc_batch}</Text>
              </View>
            )}
          </View>

          {/* Company Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About the Company</Text>
            <Text style={styles.description}>{application.startup.description}</Text>
          </View>

          {/* Email Content */}
          <View style={styles.emailSection}>
            <View style={styles.emailHeader}>
              <Text style={styles.sectionTitle}>Email Content</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
                <Text style={styles.editButtonText}>{isEditing ? "Cancel" : "Edit"}</Text>
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editingContainer}>
                <TextInput
                  style={styles.emailInput}
                  value={emailContent}
                  onChangeText={setEmailContent}
                  multiline
                  placeholder="Enter your email content..."
                  placeholderTextColor={theme.colors.gray}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emailPreview}>
                <Text style={styles.emailText}>{emailContent}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {application.status === "pending" && (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send Application</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Application</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  companySection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.lightBeige,
    borderRadius: theme.borderRadius.md,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.navy,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.lg,
  },
  logoText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.xs,
  },
  jobTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray,
    marginBottom: theme.spacing.xs,
  },
  location: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    marginBottom: theme.spacing.xs,
  },
  website: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    fontWeight: "600",
  },
  detailsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.navy,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  pendingBadge: {
    backgroundColor: theme.colors.beige,
  },
  pendingText: {
    color: theme.colors.navy,
  },
  sentBadge: {
    backgroundColor: theme.colors.success,
  },
  sentText: {
    color: theme.colors.white,
  },
  respondedBadge: {
    backgroundColor: theme.colors.navy,
  },
  respondedText: {
    color: theme.colors.white,
  },
  descriptionSection: {
    marginBottom: theme.spacing.xl,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    lineHeight: 22,
  },
  emailSection: {
    marginBottom: theme.spacing.xl,
  },
  emailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.navy,
  },
  editButtonText: {
    color: theme.colors.navy,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  editingContainer: {
    gap: theme.spacing.md,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.navy,
    minHeight: 200,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: theme.colors.navy,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  emailPreview: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  emailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    lineHeight: 20,
  },
  actionButtons: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  sendButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  sendButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "transparent",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  deleteButtonText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
})
