"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Startup {
  id: string
  companyName: string
  jobTitle: string
  description: string
  location: string
  logo?: string
  website?: string
  fundingStage?: string
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
    return `Subject: Application for ${startup.jobTitle} at ${startup.companyName}

Dear ${startup.companyName} Team,

I hope this email finds you well. I am writing to express my strong interest in the ${startup.jobTitle} position at ${startup.companyName}.

Based on my background and skills, I believe I would be a valuable addition to your team. I am particularly excited about the opportunity to contribute to ${startup.companyName}'s mission and growth.

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
