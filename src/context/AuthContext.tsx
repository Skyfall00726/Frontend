"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"

// Complete the auth session for web browser
WebBrowser.maybeCompleteAuthSession()

interface User {
  id: string
  email: string
  name: string
  picture?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  createDemoUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Google OAuth configuration
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Configure the auth request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "121653747416-jadqur1bveu7589f6ije0rlb991sli4j.apps.googleusercontent.com",
      scopes: ["openid", "profile", "email"],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "com.startupconnect.app",
      }),
    },
    discovery,
  )

  // Handle auth response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      fetchUserInfo(authentication?.accessToken)
    }
  }, [response])

  // Load user from storage on app start
  useEffect(() => {
    loadStoredUser()
  }, [])

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading stored user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserInfo = async (accessToken: string | undefined) => {
    if (!accessToken) return

    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const userInfo = await response.json()

      const userData: User = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      }

      setUser(userData)
      await AsyncStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      await promptAsync()
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const createDemoUser = async () => {
    try {
      const demoUserData: User = {
        id: "demo-user",
        email: "demo@startupconnect.app",
        name: "Demo User",
        picture: undefined,
      }

      setUser(demoUserData)
      await AsyncStorage.setItem("user", JSON.stringify(demoUserData))
    } catch (error) {
      console.error("Error creating demo user:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signOut,
        createDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
