"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from "react-native"
import { theme } from "../theme/colors"
import { useApplications } from "../context/ApplicationsContext"

const { width: screenWidth } = Dimensions.get("window")

interface AnalyticsData {
  totalApplications: number
  sentApplications: number
  pendingApplications: number
  responses: number
  responseRate: number
}

export default function AnalyticsScreen() {
  const { applications } = useApplications()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalApplications: 0,
    sentApplications: 0,
    pendingApplications: 0,
    responses: 0,
    responseRate: 0,
  })

  // Mock responses for demonstration (in real app, this would come from backend)
  const mockResponses = Math.floor(applications.filter((app) => app.status === "sent").length * 0.15) // 15% response rate

  useEffect(() => {
    const sentApps = applications.filter((app) => app.status === "sent").length
    const pendingApps = applications.filter((app) => app.status === "pending").length
    const totalApps = applications.length
    const responses = mockResponses
    const responseRate = sentApps > 0 ? (responses / sentApps) * 100 : 0

    setAnalyticsData({
      totalApplications: totalApps,
      sentApplications: sentApps,
      pendingApplications: pendingApps,
      responses,
      responseRate,
    })
  }, [applications, mockResponses])

  const renderMetricCard = (title: string, value: number, subtitle?: string, color?: string) => {
    return (
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={[styles.metricValue, color && { color }]}>{value}</Text>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
      </View>
    )
  }

  const renderProgressBar = (label: string, current: number, total: number, color: string) => {
    const percentage = total > 0 ? (current / total) * 100 : 0

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>
            {current}/{total}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.progressPercentage}>{percentage.toFixed(1)}%</Text>
      </View>
    )
  }

  const renderResponseRateCircle = () => {
    const { responseRate } = analyticsData
    const circumference = 2 * Math.PI * 45 // radius = 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (responseRate / 100) * circumference

    return (
      <View style={styles.circleContainer}>
        <View style={styles.circleChart}>
          <View style={styles.circleBackground} />
          <View
            style={[
              styles.circleProgress,
              {
                transform: [{ rotate: "-90deg" }],
              },
            ]}
          >
            <View
              style={[
                styles.circleProgressBar,
                {
                  borderColor: theme.colors.success,
                  borderWidth: 6,
                  borderRadius: 50,
                  width: 100,
                  height: 100,
                  borderTopColor: responseRate > 0 ? theme.colors.success : "transparent",
                  borderRightColor: responseRate > 25 ? theme.colors.success : "transparent",
                  borderBottomColor: responseRate > 50 ? theme.colors.success : "transparent",
                  borderLeftColor: responseRate > 75 ? theme.colors.success : "transparent",
                },
              ]}
            />
          </View>
          <View style={styles.circleCenter}>
            <Text style={styles.circlePercentage}>{responseRate.toFixed(1)}%</Text>
            <Text style={styles.circleLabel}>Response Rate</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Track your application performance</Text>
        </View>

        {/* Main Metrics */}
        <View style={styles.metricsGrid}>
          {renderMetricCard("Total Applications", analyticsData.totalApplications, "All time", theme.colors.navy)}
          {renderMetricCard(
            "Applications Sent",
            analyticsData.sentApplications,
            "Successfully sent",
            theme.colors.success,
          )}
        </View>

        <View style={styles.metricsGrid}>
          {renderMetricCard(
            "Pending Applications",
            analyticsData.pendingApplications,
            "Ready to send",
            theme.colors.beige,
          )}
          {renderMetricCard("Responses Received", analyticsData.responses, "Companies replied", theme.colors.navy)}
        </View>

        {/* Response Rate Circle */}
        <View style={styles.responseRateSection}>
          <Text style={styles.sectionTitle}>Response Rate</Text>
          {renderResponseRateCircle()}
        </View>

        {/* Progress Bars */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Application Status</Text>
          {renderProgressBar(
            "Applications Sent",
            analyticsData.sentApplications,
            analyticsData.totalApplications,
            theme.colors.success,
          )}
          {renderProgressBar(
            "Pending Applications",
            analyticsData.pendingApplications,
            analyticsData.totalApplications,
            theme.colors.beige,
          )}
          {analyticsData.sentApplications > 0 &&
            renderProgressBar(
              "Responses Received",
              analyticsData.responses,
              analyticsData.sentApplications,
              theme.colors.navy,
            )}
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            {analyticsData.totalApplications === 0 ? (
              <Text style={styles.insightText}>Start swiping right on startups to see your analytics!</Text>
            ) : analyticsData.sentApplications === 0 ? (
              <Text style={styles.insightText}>
                You have {analyticsData.pendingApplications} applications ready to send. Send them to start tracking
                responses!
              </Text>
            ) : analyticsData.responseRate === 0 ? (
              <Text style={styles.insightText}>
                You've sent {analyticsData.sentApplications} applications. Responses typically come within 1-2 weeks.
              </Text>
            ) : analyticsData.responseRate < 10 ? (
              <Text style={styles.insightText}>
                Your response rate is {analyticsData.responseRate.toFixed(1)}%. Industry average is 10-15%. Keep
                applying!
              </Text>
            ) : (
              <Text style={styles.insightText}>
                Great job! Your {analyticsData.responseRate.toFixed(1)}% response rate is above average. Keep up the
                momentum!
              </Text>
            )}
          </View>
        </View>
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
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
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
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.lightBeige,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.beige,
  },
  metricTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  metricValue: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.xs,
  },
  metricSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    textAlign: "center",
  },
  responseRateSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.lg,
  },
  circleContainer: {
    alignItems: "center",
  },
  circleChart: {
    position: "relative",
    width: 120,
    height: 120,
  },
  circleBackground: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: theme.colors.lightGray,
    top: 10,
    left: 10,
  },
  circleProgress: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  circleProgressBar: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  circleCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  circlePercentage: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.navy,
  },
  circleLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
  },
  progressSection: {
    marginBottom: theme.spacing.xl,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.navy,
    fontWeight: "600",
  },
  progressValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    textAlign: "right",
  },
  insightsSection: {
    marginBottom: theme.spacing.xl,
  },
  insightCard: {
    backgroundColor: theme.colors.lightBeige,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.beige,
  },
  insightText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.navy,
    lineHeight: 22,
    textAlign: "center",
  },
})
