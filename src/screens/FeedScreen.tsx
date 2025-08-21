"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native"
import Swiper from "react-native-deck-swiper"
import { theme } from "../theme/colors"
import { mockStartups } from "../data/mockStartups"
import { useApplications, type Startup } from "../context/ApplicationsContext"
import { apiService } from "../services/api"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

export default function FeedScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const swiperRef = useRef<Swiper<Startup>>(null)
  const { addApplication } = useApplications()

  // Load startups from API
  useEffect(() => {
    loadStartups()
  }, [])

  const loadStartups = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) setLoading(true)
      setError(null)

      const response = await apiService.getFeedStartups(page, 10)
      
      if (response.success && response.data) {
        const newStartups = response.data.startups
        
        if (append) {
          setStartups(prev => [...prev, ...newStartups])
        } else {
          setStartups(newStartups)
        }
        
        setHasMore(response.data.pagination.has_next)
        setCurrentPage(page)
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', response.error)
        if (!append) {
          setStartups(mockStartups)
        }
        setError(response.error || 'Failed to load startups')
      }
    } catch (err) {
      console.error('Error loading startups:', err)
      // Fallback to mock data
      if (!append) {
        setStartups(mockStartups)
      }
      setError('Network error - using offline data')
    } finally {
      setLoading(false)
    }
  }

  const onSwipedLeft = async (cardIndex: number) => {
    const startup = startups[cardIndex]
    console.log("Swiped left on:", startup.name)
    
    // Record swipe action in backend
    try {
      await apiService.recordSwipe({
        startup_id: startup.id,
        action: 'pass'
      })
    } catch (error) {
      console.error('Failed to record swipe:', error)
    }
  }

  const onSwipedRight = async (cardIndex: number) => {
    const startup = startups[cardIndex]
    addApplication(startup)
    
    // Record swipe action in backend
    try {
      const response = await apiService.recordSwipe({
        startup_id: startup.id,
        action: 'like'
      })
      
      if (response.success) {
        Alert.alert(
          "Application Added!",
          `Your application to ${startup.name} has been prepared and added to your applications list.`,
          [{ text: "OK" }],
        )
      } else {
        Alert.alert(
          "Application Added!",
          `Your application to ${startup.name} has been prepared locally. (Network issue: ${response.error})`,
          [{ text: "OK" }],
        )
      }
    } catch (error) {
      console.error('Failed to record swipe:', error)
      Alert.alert(
        "Application Added!",
        `Your application to ${startup.name} has been prepared locally.`,
        [{ text: "OK" }],
      )
    }
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
            <Text style={styles.logoText}>{startup.name?.charAt(0) || '?'}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.companyName}>{startup.name || 'Company Name'}</Text>
          <Text style={styles.jobTitle}>{startup.job_title || 'Job Title'}</Text>
          <Text style={styles.location}>{startup.location}</Text>

          {startup.yc_batch && (
            <View style={styles.fundingBadge}>
              <Text style={styles.fundingText}>{startup.yc_batch}</Text>
            </View>
          )}

          {startup.job_salary && (
            <View style={styles.salaryBadge}>
              <Text style={styles.salaryText}>{startup.job_salary}</Text>
            </View>
          )}

          <Text style={styles.description}>{startup.description}</Text>

          {startup.website_url && <Text style={styles.website}>{startup.website_url}</Text>}

          {startup.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {startup.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={theme.colors.navy} />
          <Text style={styles.loadingText}>Loading startups...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (startups.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Startups Available</Text>
          <Text style={styles.emptyStateText}>
            {error ? `Error: ${error}` : "Please check back later for new opportunities."}
          </Text>
          {error && (
            <TouchableOpacity style={styles.retryButton} onPress={() => loadStartups()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
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
          onSwiped={(cardIndex: number) => setCurrentIndex(cardIndex + 1)}
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
  salaryBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },
  salaryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  tag: {
    backgroundColor: theme.colors.lightGray,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  tagText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    fontWeight: "500",
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
    marginBottom: theme.spacing.lg,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    marginTop: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.navy,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  retryButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    fontWeight: "600",
  },
})
