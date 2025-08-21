"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Startup {
  id: string
  name: string // Company name from backend API
  description: string
  website_url?: string
  location: string
  industry?: string
  logo_url?: string
  founded_year?: number
  yc_batch?: string
  tags: string[]
  founders: string[]
  // Job-specific fields (from jobs table)
  job_title: string
  job_salary?: string
  job_info?: string
  job_description?: string
  job_link?: string
}

export interface Application {
  id: string
  startup: Startup
  appliedAt: Date
  status: "pending" | "sent" | "responded"
  emailContent?: string
}

interface ApplicationsContextType {
  applications: Application[]
  addApplication: (startup: Startup) => void
  removeApplication: (applicationId: string) => void
  updateApplication: (applicationId: string, updates: Partial<Application>) => void
  sendApplication: (applicationId: string) => void
  sendAllApplications: () => void
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined)

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([])

  const addApplication = (startup: Startup) => {
    const newApplication: Application = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startup,
      appliedAt: new Date(),
      status: "pending",
      emailContent: generateEmailContent(startup),
    }
    setApplications((prev) => [...prev, newApplication])
  }

  const removeApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId))
  }

  const updateApplication = (applicationId: string, updates: Partial<Application>) => {
    setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, ...updates } : app)))
  }

  const sendApplication = (applicationId: string) => {
    updateApplication(applicationId, { status: "sent" })
  }

  const sendAllApplications = () => {
    setApplications((prev) => prev.map((app) => (app.status === "pending" ? { ...app, status: "sent" } : app)))
  }

  const generateEmailContent = (startup: Startup): string => {
    return `Subject: Application for ${startup.job_title} at ${startup.name}

Dear ${startup.name} Team,

I hope this email finds you well. I am writing to express my strong interest in the ${startup.job_title} position at ${startup.name}.

Based on my background and skills, I believe I would be a valuable addition to your team. I am particularly excited about the opportunity to contribute to ${startup.name}'s mission and growth.

I have attached my resume for your review and would welcome the opportunity to discuss how my experience aligns with your needs.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]`
  }

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        addApplication,
        removeApplication,
        updateApplication,
        sendApplication,
        sendAllApplications,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const context = useContext(ApplicationsContext)
  if (context === undefined) {
    throw new Error("useApplications must be used within an ApplicationsProvider")
  }
  return context
}
