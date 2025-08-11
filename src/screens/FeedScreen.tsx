"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert } from "react-native"
import Swiper from "react-native-deck-swiper"
import { theme } from "../theme/colors"
import { mockStartups } from "../data/mockStartups"
import { useApplications, type Startup } from "../context/ApplicationsContext"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

export default function FeedScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startups] = useState(mockStartups)
  const swiperRef = useRef<Swiper<Startup>>(null)
  const { addApplication } = useApplications()

  const onSwipedLeft = (cardIndex: number) => {
    console.log("Swiped left on:", startups[cardIndex].companyName)
  }

  const onSwipedRight = (cardIndex: number) => {
    const startup = startups[cardIndex]
    addApplication(startup)
    Alert.alert(
      "Application Added!",
      `Your application to ${startup.companyName} has been prepared and added to your applications list.`,
      [{ text: "OK" }],
    )
  }

  const onSwipedAll = () => {
    Alert.alert("No More Startups", "You've seen all available startups. Check back later for more opportunities!")
  }

  const handleSwipeLeft = () => {
    swiperRef.current?.swipeLeft()
  }

  const handleSwipeRight = () => {
    swiperRef.current?.swipeRight()
  }

  const renderCard = (startup: Startup) => {
    if (!startup) return null

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>{startup.companyName.charAt(0)}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.companyName}>{startup.companyName}</Text>
          <Text style={styles.jobTitle}>{startup.jobTitle}</Text>
          <Text style={styles.location}>{startup.location}</Text>

          {startup.fundingStage && (
            <View style={styles.fundingBadge}>
              <Text style={styles.fundingText}>{startup.fundingStage}</Text>
            </View>
          )}

          <Text style={styles.description}>{startup.description}</Text>

          {startup.website && <Text style={styles.website}>{startup.website}</Text>}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.swipeHints}>
            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>← Pass</Text>
            </View>
            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>Apply →</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderNoMoreCards = () => {
    return (
      <View style={styles.noMoreCards}>
        <Text style={styles.noMoreCardsTitle}>No More Startups</Text>
        <Text style={styles.noMoreCardsText}>
          You've seen all available opportunities. Check back later for more startups!
        </Text>
      </View>
    )
  }

  if (startups.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Startups Available</Text>
          <Text style={styles.emptyStateText}>Please check back later for new opportunities.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Startups</Text>
        <Text style={styles.headerSubtitle}>
          {currentIndex + 1} of {startups.length}
        </Text>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={startups}
          renderCard={renderCard}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
          onSwipedAll={onSwipedAll}
          onSwiped={(cardIndex) => setCurrentIndex(cardIndex + 1)}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={2}
          stackSeparation={15}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          overlayLabels={{
            left: {
              title: "PASS",
              style: {
                label: {
                  backgroundColor: theme.colors.error,
                  color: theme.colors.white,
                  fontSize: 24,
                  fontWeight: "bold",
                  borderRadius: 10,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: "APPLY",
              style: {
                label: {
                  backgroundColor: theme.colors.success,
                  color: theme.colors.white,
                  fontSize: 24,
                  fontWeight: "bold",
                  borderRadius: 10,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        >
          {renderNoMoreCards()}
        </Swiper>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handleSwipeLeft}>
          <Text style={styles.passButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleSwipeRight}>
          <Text style={styles.applyButtonText}>♥</Text>
        </TouchableOpacity>
      </View>
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
  swiperContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: screenHeight * 0.65,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.white,
  },
  cardContent: {
    flex: 1,
  },
  companyName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.navy,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  jobTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  location: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  fundingBadge: {
    backgroundColor: theme.colors.beige,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },
  fundingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    fontWeight: "600",
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  website: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.navy,
    textAlign: "center",
    fontWeight: "600",
  },
  cardFooter: {
    marginTop: "auto",
  },
  swipeHints: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  swipeHint: {
    backgroundColor: theme.colors.lightGray,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  swipeHintText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.error,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  passButtonText: {
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: "bold",
  },
  applyButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: "bold",
  },
  noMoreCards: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.lightBeige,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
  },
  noMoreCardsTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.md,
  },
  noMoreCardsText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    textAlign: "center",
    lineHeight: 22,
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
