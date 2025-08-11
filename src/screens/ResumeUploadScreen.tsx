"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from "react-native"
import * as DocumentPicker from "expo-document-picker"
import { theme } from "../theme/colors"

interface ResumeUploadScreenProps {
  navigation: any
}

interface UploadedFile {
  name: string
  size: number
  uri: string
  type: string
}

export default function ResumeUploadScreen({ navigation }: ResumeUploadScreenProps) {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const validateFile = (file: any): string | null => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (file.size > maxSize) {
      return "File size must be less than 10MB"
    }

    if (!allowedTypes.includes(file.mimeType)) {
      return "Please select a PDF or Word document"
    }

    return null
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0]
        const validationError = validateFile(file)

        if (validationError) {
          Alert.alert("Invalid File", validationError)
          return
        }

        setSelectedFile({
          name: file.name,
          size: file.size,
          uri: file.uri,
          type: file.mimeType || "unknown",
        })
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document")
    }
  }

  const simulateUpload = async (): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }
        setUploadProgress(progress)
      }, 200)
    })
  }

  const uploadResume = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      await simulateUpload()

      // TODO: Replace with actual API call
      // const formData = new FormData()
      // formData.append('resume', {
      //   uri: selectedFile.uri,
      //   type: selectedFile.type,
      //   name: selectedFile.name,
      // } as any)
      //
      // const response = await fetch('YOUR_API_ENDPOINT/upload-resume', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })

      Alert.alert("Success", "Resume uploaded successfully!", [
        {
          text: "Continue",
          onPress: () => navigation.navigate("Main"),
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to upload resume. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleContinue = () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a resume file")
      return
    }
    uploadResume()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Your Resume</Text>
          <Text style={styles.subtitle}>
            We'll analyze your resume to match you with relevant startups. Supported formats: PDF, DOC, DOCX (Max 10MB)
          </Text>
        </View>

        <View style={styles.uploadSection}>
          {!selectedFile ? (
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument} disabled={isUploading}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>📄</Text>
              </View>
              <Text style={styles.uploadButtonText}>Select Resume</Text>
              <Text style={styles.uploadHint}>Tap to browse files</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.filePreview}>
              <View style={styles.fileHeader}>
                <View style={styles.fileIcon}>
                  <Text style={styles.fileIconText}>📄</Text>
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.fileSize}>{formatFileSize(selectedFile.size)}</Text>
                </View>
                {!isUploading && (
                  <TouchableOpacity style={styles.removeButton} onPress={removeFile}>
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isUploading && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{Math.round(uploadProgress)}%</Text>
                </View>
              )}

              <TouchableOpacity style={styles.changeFileButton} onPress={pickDocument} disabled={isUploading}>
                <Text style={styles.changeFileButtonText}>Change File</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.continueButton, (!selectedFile || isUploading) && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.white} size="small" />
                <Text style={styles.continueButtonText}>Uploading...</Text>
              </View>
            ) : (
              <Text style={styles.continueButtonText}>Upload & Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate("Main")}
            disabled={isUploading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.navy,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },
  uploadSection: {
    flex: 1,
    justifyContent: "center",
  },
  uploadButton: {
    backgroundColor: theme.colors.lightBeige,
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.navy,
    borderStyle: "dashed",
    alignItems: "center",
  },
  uploadIcon: {
    marginBottom: theme.spacing.md,
  },
  uploadIconText: {
    fontSize: 48,
  },
  uploadButtonText: {
    color: theme.colors.navy,
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  uploadHint: {
    color: theme.colors.gray,
    fontSize: theme.fontSize.sm,
  },
  filePreview: {
    backgroundColor: theme.colors.lightBeige,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.beige,
  },
  fileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  fileIcon: {
    marginRight: theme.spacing.md,
  },
  fileIconText: {
    fontSize: 32,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.navy,
    fontWeight: "600",
  },
  fileSize: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
  },
  removeButton: {
    backgroundColor: theme.colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: "bold",
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.success,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    textAlign: "center",
  },
  changeFileButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.navy,
  },
  changeFileButtonText: {
    color: theme.colors.navy,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  buttonContainer: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  continueButton: {
    backgroundColor: theme.colors.navy,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  continueButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: theme.colors.lightGray,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  skipButton: {
    backgroundColor: "transparent",
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  skipButtonText: {
    color: theme.colors.gray,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
})
