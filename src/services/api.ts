// API service for connecting to Flask backend
import type { Startup } from "../context/ApplicationsContext"

// Use your computer's IP address instead of localhost for React Native
// The Flask server showed it's running on: http://10.198.227.67:5000
const API_BASE_URL = 'http://10.198.227.67:5000' // Flask server URL

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface FeedResponse {
  startups: Startup[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface SwipeRequest {
  startup_id: string
  action: 'like' | 'pass'
}

export interface SwipeResponse {
  message: string
  match_id?: string
}

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // Get feed startups with pagination
  async getFeedStartups(page: number = 1, limit: number = 10): Promise<ApiResponse<FeedResponse>> {
    return this.request<FeedResponse>(`/api/v1/feed/startups?page=${page}&limit=${limit}`)
  }

  // Get detailed startup information
  async getStartupDetails(startupId: string): Promise<ApiResponse<Startup>> {
    return this.request<Startup>(`/api/v1/startups/${startupId}`)
  }

  // Record swipe action
  async recordSwipe(swipeData: SwipeRequest): Promise<ApiResponse<SwipeResponse>> {
    return this.request<SwipeResponse>('/api/v1/feed/swipe', {
      method: 'POST',
      body: JSON.stringify(swipeData),
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/api/v1/health')
  }
}

export const apiService = new ApiService()
