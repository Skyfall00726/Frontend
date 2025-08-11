"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View, ActivityIndicator } from "react-native"

import { AuthProvider, useAuth } from "./src/context/AuthContext"
import { ApplicationsProvider } from "./src/context/ApplicationsContext"

// Import screens
import AuthScreen from "./src/screens/AuthScreen"
import ResumeUploadScreen from "./src/screens/ResumeUploadScreen"
import FeedScreen from "./src/screens/FeedScreen"
import ApplicationsScreen from "./src/screens/ApplicationsScreen"
import AnalyticsScreen from "./src/screens/AnalyticsScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import ApplicationDetailScreen from "./src/screens/ApplicationDetailScreen"

// Import theme
import { theme } from "./src/theme/colors"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Main app tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.navy,
        tabBarInactiveTintColor: theme.colors.beige,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.beige,
        },
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerTintColor: theme.colors.navy,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: "Feed",
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          tabBarLabel: "Applications",
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: "Analytics",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.navy} />
      </View>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerTintColor: theme.colors.navy,
      }}
    >
      {!user ? (
        // Auth flow
        <>
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ResumeUpload" component={ResumeUploadScreen} options={{ title: "Upload Resume" }} />
        </>
      ) : (
        // Authenticated flow
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="ApplicationDetail"
            component={ApplicationDetailScreen}
            options={{ title: "Application Details" }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ApplicationsProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </View>
      </ApplicationsProvider>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
})
