"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from "react-native"
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler"
import { theme } from "../theme/colors"
import { useApplications, type Application } from "../context/ApplicationsContext"

interface ApplicationsScreenProps {
  navigation: any
}

export default function ApplicationsScreen({ navigation }: ApplicationsScreenProps) {
  const { applications, removeApplication, sendApplication, sendAllApplications } = useApplications()
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set())
  const [overlayVisible, setOverlayVisible] = useState<string | null>(null)

  const pendingApplications = applications.filter((app) => app.status === "pending")
  const sentApplications = applications.filter((app) => app.status === "sent")

  const toggleSelection = (applicationId: string) => {
    const newSelected = new Set(selectedApplications)
    if (newSelected.has(applicationId)) {
      newSelected.delete(applicationId)
    } else {
      newSelected.add(applicationId)
    }
    setSelectedApplications(newSelected)
  }

  const selectAll = () => {
    if (selectedApplications.size === pendingApplications.length) {
      setSelectedApplications(new Set())
    } else {
      setSelectedApplications(new Set(pendingApplications.map((app) => app.id)))
    }
  }

  const sendSelectedApplications = () => {
    if (selectedApplications.size === 0) {
      Alert.alert("No Applications Selected", "Please select applications to send.")
      return
    }

    Alert.alert("Send Applications", `Are you sure you want to send ${selectedApplications.size} application(s)?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send",
        onPress: () => {
          selectedApplications.forEach((appId) => {
            sendApplication(appId)
          })
          setSelectedApplications(new Set())
          Alert.alert("Success", "Applications sent successfully!")
        },
      },
    ])
  }

  const handleCardPress = (application: Application) => {
    if (overlayVisible === application.id) {
      // Second tap - open detail screen
      setOverlayVisible(null)
      navigation.navigate("ApplicationDetail", { application })
    } else {
      // First tap - show overlay
      setOverlayVisible(application.id)
      setTimeout(() => setOverlayVisible(null), 2000) // Auto-hide after 2 seconds
    }
  }

  const renderDeleteAction = (applicationId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          Alert.alert("Delete Application", "Are you sure you want to delete this application?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => removeApplication(applicationId),
            },
          ])
        }}
      >
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    )
  }

  const renderApplicationCard = ({ item: application }: { item: Application }) => {
    const isSelected = selectedApplications.has(application.id)
    const showOverlay = overlayVisible === application.id

    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={() => renderDeleteAction(application.id)}>
          <TouchableOpacity
            style={[styles.applicationCard, isSelected && styles.selectedCard]}
            onPress={() => handleCardPress(application)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.companyInfo}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>{application.startup.companyName.charAt(0)}</Text>
                  </View>
                  <View style={styles.companyDetails}>
                    <Text style={styles.companyName}>{application.startup.companyName}</Text>
                    <Text style={styles.jobTitle}>{application.startup.jobTitle}</Text>
                    <Text style={styles.location}>{application.startup.location}</Text>
                  </View>
                </View>
                {application.status === "pending" && (
                  <TouchableOpacity
                    style={[styles.checkbox, isSelected && styles.checkedBox]}
                    onPress={() => toggleSelection(application.id)}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.appliedDate}>Applied: {application.appliedAt.toLocaleDateString()}</Text>
                <View style={[styles.statusBadge, styles[`${application.status}Badge`]]}>
                  <Text style={[styles.statusText, styles[`${application.status}Text`]]}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {showOverlay && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>Tap again to open application</Text>
              </View>
            )}
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Applications Yet</Text>
      <Text style={styles.emptyStateText}>Start swiping right on startups to build your application list!</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applications</Text>
        <Text style={styles.headerSubtitle}>
          {pendingApplications.length} pending • {sentApplications.length} sent
        </Text>
      </View>

      {applications.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {pendingApplications.length > 0 && (
            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.selectAllButton} onPress={selectAll}>
                <Text style={styles.selectAllText}>
                  {selectedApplications.size === pendingApplications.length ? "Deselect All" : "Select All"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, selectedApplications.size === 0 && styles.disabledButton]}
                onPress={sendSelectedApplications}
                disabled={selectedApplications.size === 0}
              >
                <Text style={[styles.sendButtonText, selectedApplications.size === 0 && styles.disabledButtonText]}>
                  Send Selected ({selectedApplications.size})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={applications}
            renderItem={renderApplicationCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.navy,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.lightBeige,
  },
  selectAllButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  selectAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    fontWeight: "600",
  },
  sendButton: {
    backgroundColor: theme.colors.navy,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  sendButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: theme.colors.lightGray,
  },
  disabledButtonText: {
    color: theme.colors.gray,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  applicationCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    position: "relative",
  },
  selectedCard: {
    borderColor: theme.colors.navy,
    borderWidth: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  companyInfo: {
    flexDirection: "row",
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.navy,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  logoText: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
    color: theme.colors.navy,
  },
  jobTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
  },
  location: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: theme.colors.navy,
    borderColor: theme.colors.navy,
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appliedDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(27, 41, 81, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
  },
  overlayText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteAction: {
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  deleteActionText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.md,
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    textAlign: "center",
    lineHeight: 22,
  },
})
