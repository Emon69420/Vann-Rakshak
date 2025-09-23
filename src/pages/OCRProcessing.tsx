"use client"

import type React from "react"
import { runOCR } from '../utils/ocr';
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  Scan,
  Database,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Zap,
  Brain,
  FileImage,
  FileCheck,
} from "lucide-react"

interface ProcessedDocument {
  id: string
  filename: string
  status: "processing" | "completed" | "error"
  extractedText: string
  entities: Array<{
    type: string
    value: string
    confidence: number
  }>
  uploadedAt: string
  errorMessage?: string // add
}

export const OCRProcessing: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0) // overall 0..100
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    setSelectedFiles(files)
  }

  const extractEntities = (text: string): ProcessedDocument["entities"] => {
    const entities: ProcessedDocument["entities"] = []
    const push = (type: string, value?: string | null, confidence = 0.9) => {
      if (value && value.trim()) entities.push({ type, value: value.trim(), confidence })
    }
    const pick = (label: string) => {
      const m = new RegExp(`${label}\\s*:\\s*([^\\n\\r]+)`, 'i').exec(text)
      return m?.[1] ?? null
    }
    push("PERSON", pick("Applicant Name") || pick("Name"))
    push("LOCATION", pick("Village"))
    push("LOCATION", pick("District"))
    push("STATE", pick("State"))
    push("AREA", pick("Area"))
    push("COORDINATES", pick("Coordinates"))
    return entities
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <Scan className="w-4 h-4" />
      case "error":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const processDocuments = async () => {
    if (selectedFiles.length === 0) return
    setIsProcessing(true)
    setProcessingProgress(0)

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const id = `doc_${Date.now()}_${i}`

      setProcessedDocuments(prev => ([
        {
          id,
          filename: file.name,
          status: "processing",
          extractedText: "",
          entities: [],
          uploadedAt: new Date().toLocaleString(),
        },
        ...prev,
      ]))

      try {
        const text = await runOCR(file, (p) => {
          const overall = Math.round(((i + p) / selectedFiles.length) * 100)
          setProcessingProgress(overall)
        })

        const entities = extractEntities(text)
        setProcessedDocuments(prev =>
          prev.map(d => d.id === id ? { ...d, status: "completed", extractedText: text, entities } : d)
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('OCR error', err)
        setProcessedDocuments(prev =>
          prev.map(d => d.id === id ? { ...d, status: "error", errorMessage: message } : d)
        )
      }
    }

    setProcessingProgress(100)
    setIsProcessing(false)
    setSelectedFiles([])
    setTimeout(() => setProcessingProgress(0), 400)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">OCR & Document Processing</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We use cutting-edge OCR and Named Entity Recognition to convert chaotic paper files into a single,
              structured national database. It's a one-time process that solves the root problem of data fragmentation.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Scan className="w-5 h-5 text-blue-600" />
                <span>Advanced OCR</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Named Entity Recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-green-600" />
                <span>Structured Database</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Upload Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-lg font-medium text-gray-700">Drop images here or click to browse</div>
                    <div className="text-sm text-gray-500">Supports JPG, PNG, TIFF</div>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,.jpg,.jpeg,.png,.tif,.tiff"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing images...</span>
                    <span className="text-sm text-gray-500">{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} className="w-full" />
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={processDocuments}
                  disabled={selectedFiles.length === 0 || isProcessing}
                  className="flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isProcessing ? "Processing..." : "Process Images"}</span>
                </Button>
                <Button variant="outline" disabled={selectedFiles.length === 0 || isProcessing}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Processing Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5" />
                  <span>Processed Documents ({processedDocuments.length})</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedDocuments.map((doc) => (
                  <Card key={doc.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium">{doc.filename}</h4>
                            <p className="text-sm text-gray-500">Uploaded: {doc.uploadedAt}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1 capitalize">{doc.status}</span>
                        </Badge>
                      </div>

                      <Tabs defaultValue="text" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="text">Extracted Text</TabsTrigger>
                          <TabsTrigger value="entities">Named Entities</TabsTrigger>
                        </TabsList>

                        <TabsContent value="text" className="mt-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <Textarea
                              value={doc.extractedText}
                              readOnly
                              className="min-h-32 bg-transparent border-none resize-none"
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="entities" className="mt-4">
                          <div className="grid gap-2">
                            {doc.entities.map((entity, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {entity.type}
                                  </Badge>
                                  <span className="text-sm">{entity.value}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {(entity.confidence * 100).toFixed(1)}% confidence
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* Show error message if OCR failed */}
                      {doc.status === "error" && doc.errorMessage && (
                        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
                          <p className="text-sm font-medium">Error: {doc.errorMessage}</p>
                        </div>
                      )}

                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Database className="w-4 h-4 mr-2" />
                          Add to Database
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default OCRProcessing
