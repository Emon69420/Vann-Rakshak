import axios from 'axios'

export interface OCRResult {
  extractedText: string
  confidence: number
  boundingBoxes?: Array<{
    text: string
    x: number
    y: number
    width: number
    height: number
  }>
}

export interface NERResult {
  entities: Array<{
    text: string
    label: string
    confidence: number
    start: number
    end: number
  }>
}

export interface AssetDetectionResult {
  assets: Array<{
    type: 'agriculture' | 'forest' | 'water_body' | 'homestead'
    confidence: number
    area: number
    coordinates: Array<[number, number]>
  }>
  totalArea: number
}

export interface FRAMetadata {
  applicantName?: string
  fatherName?: string
  villageName?: string
  district?: string
  state?: string
  surveyNumber?: string
  areaInHectares?: number
  claimType?: 'IFR' | 'CR' | 'CFR'
  dateOfApplication?: string
}

// Mock OCR service - replace with actual service
export class OCRService {
  private static apiKey = process.env.OCR_API_KEY || 'mock-key'
  private static baseUrl = process.env.OCR_API_URL || 'https://api.ocr-service.com'

  static async extractTextFromDocument(
    fileBuffer: Buffer,
    fileName: string
  ): Promise<OCRResult> {
    try {
      // For MVP, simulate OCR processing
      if (this.apiKey === 'mock-key') {
        return this.mockOCRResponse(fileName)
      }

      const formData = new FormData()
      formData.append('file', new Blob([fileBuffer]), fileName)
      formData.append('language', 'eng+hin') // English + Hindi

      const response = await axios.post(`${this.baseUrl}/ocr/extract`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      })

      return {
        extractedText: response.data.text,
        confidence: response.data.confidence,
        boundingBoxes: response.data.boundingBoxes,
      }
    } catch (error) {
      console.error('OCR extraction failed:', error)
      throw new Error('Failed to extract text from document')
    }
  }

  private static mockOCRResponse(fileName: string): OCRResult {
    // Mock response based on filename or random data
    return {
      extractedText: `FRA Claim Application
      
Applicant Name: राम कुमार / Ram Kumar
Father's Name: श्याम लाल / Shyam Lal
Village: गांव नंबर 123 / Village No. 123
District: बस्तर / Bastar
State: छत्तीसगढ़ / Chhattisgarh
Survey Number: 45/2
Area: 2.5 hectares
Claim Type: Individual Forest Rights (IFR)
Date of Application: 15/03/2024

I hereby claim the forest rights over the above mentioned land which has been under my occupation for the last 20 years for agricultural purposes.`,
      confidence: 0.89,
      boundingBoxes: [
        { text: 'Ram Kumar', x: 150, y: 100, width: 80, height: 20 },
        { text: 'Bastar', x: 150, y: 140, width: 60, height: 18 },
        { text: '2.5', x: 150, y: 180, width: 30, height: 18 },
      ],
    }
  }
}

// Named Entity Recognition Service
export class NERService {
  private static apiKey = process.env.NER_API_KEY || 'mock-key'
  private static baseUrl = process.env.NER_API_URL || 'https://api.ner-service.com'

  static async extractEntities(text: string): Promise<NERResult> {
    try {
      if (this.apiKey === 'mock-key') {
        return this.mockNERResponse(text)
      }

      const response = await axios.post(
        `${this.baseUrl}/ner/extract`,
        { text },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      )

      return {
        entities: response.data.entities,
      }
    } catch (error) {
      console.error('NER extraction failed:', error)
      throw new Error('Failed to extract entities from text')
    }
  }

  private static mockNERResponse(text: string): NERResult {
    const entities = []
    
    // Simple pattern matching for demo
    const patterns = [
      { regex: /([A-Z][a-z]+ [A-Z][a-z]+)/g, label: 'PERSON' },
      { regex: /(Village|गांव)\s*:?\s*([A-Za-z\s\d]+)/gi, label: 'VILLAGE' },
      { regex: /(District|जिला)\s*:?\s*([A-Za-z\s]+)/gi, label: 'DISTRICT' },
      { regex: /(State|राज्य)\s*:?\s*([A-Za-z\s]+)/gi, label: 'STATE' },
      { regex: /(\d+\.?\d*)\s*(hectares?|हेक्टेयर)/gi, label: 'AREA' },
      { regex: /(Survey Number|सर्वे संख्या)\s*:?\s*(\d+\/?\d*)/gi, label: 'SURVEY_NUMBER' },
    ]

    patterns.forEach(pattern => {
      let match
      while ((match = pattern.regex.exec(text)) !== null) {
        entities.push({
          text: match[0],
          label: pattern.label,
          confidence: 0.85,
          start: match.index,
          end: match.index + match[0].length,
        })
      }
    })

    return { entities }
  }

  static extractFRAMetadata(ocrText: string, nerResult: NERResult): FRAMetadata {
    const metadata: FRAMetadata = {}

    nerResult.entities.forEach(entity => {
      switch (entity.label) {
        case 'PERSON':
          if (!metadata.applicantName && entity.confidence > 0.8) {
            metadata.applicantName = entity.text.trim()
          }
          break
        case 'VILLAGE':
          if (!metadata.villageName) {
            const match = entity.text.match(/(?:Village|गांव)\s*:?\s*(.+)/i)
            metadata.villageName = match ? match[1].trim() : entity.text
          }
          break
        case 'DISTRICT':
          if (!metadata.district) {
            const match = entity.text.match(/(?:District|जिला)\s*:?\s*(.+)/i)
            metadata.district = match ? match[1].trim() : entity.text
          }
          break
        case 'STATE':
          if (!metadata.state) {
            const match = entity.text.match(/(?:State|राज्य)\s*:?\s*(.+)/i)
            metadata.state = match ? match[1].trim() : entity.text
          }
          break
        case 'AREA':
          if (!metadata.areaInHectares) {
            const match = entity.text.match(/(\d+\.?\d*)/i)
            if (match) {
              metadata.areaInHectares = parseFloat(match[1])
            }
          }
          break
        case 'SURVEY_NUMBER':
          if (!metadata.surveyNumber) {
            const match = entity.text.match(/(\d+\/?\d*)/i)
            metadata.surveyNumber = match ? match[1] : entity.text
          }
          break
      }
    })

    // Extract claim type from text
    if (ocrText.toLowerCase().includes('individual forest rights') || ocrText.includes('IFR')) {
      metadata.claimType = 'IFR'
    } else if (ocrText.toLowerCase().includes('community forest rights') || ocrText.includes('CFR')) {
      metadata.claimType = 'CFR'
    } else if (ocrText.toLowerCase().includes('community rights') || ocrText.includes('CR')) {
      metadata.claimType = 'CR'
    }

    // Extract date
    const dateMatch = ocrText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/g)
    if (dateMatch && dateMatch.length > 0) {
      metadata.dateOfApplication = dateMatch[0]
    }

    return metadata
  }
}

// Computer Vision Service for Asset Detection
export class AssetDetectionService {
  private static apiKey = process.env.CV_API_KEY || 'mock-key'
  private static baseUrl = process.env.CV_API_URL || 'https://api.cv-service.com'

  static async detectAssetsFromSatellite(
    coordinates: [number, number, number, number], // [minLon, minLat, maxLon, maxLat]
    date?: string
  ): Promise<AssetDetectionResult> {
    try {
      if (this.apiKey === 'mock-key') {
        return this.mockAssetDetection(coordinates)
      }

      const response = await axios.post(
        `${this.baseUrl}/detect/assets`,
        {
          bbox: coordinates,
          date: date || new Date().toISOString().split('T')[0],
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // Asset detection can take longer
        }
      )

      return response.data
    } catch (error) {
      console.error('Asset detection failed:', error)
      throw new Error('Failed to detect assets from satellite imagery')
    }
  }

  static async analyzeUploadedImage(
    imageBuffer: Buffer,
    fileName: string
  ): Promise<AssetDetectionResult> {
    try {
      if (this.apiKey === 'mock-key') {
        return this.mockImageAnalysis(fileName)
      }

      const formData = new FormData()
      formData.append('image', new Blob([imageBuffer]), fileName)

      const response = await axios.post(`${this.baseUrl}/analyze/image`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      })

      return response.data
    } catch (error) {
      console.error('Image analysis failed:', error)
      throw new Error('Failed to analyze uploaded image')
    }
  }

  private static mockAssetDetection(coordinates: [number, number, number, number]): AssetDetectionResult {
    // Generate mock asset data based on coordinates
    const [minLon, minLat, maxLon, maxLat] = coordinates
    const centerLon = (minLon + maxLon) / 2
    const centerLat = (minLat + maxLat) / 2

    return {
      assets: [
        {
          type: 'agriculture',
          confidence: 0.92,
          area: 1.2,
          coordinates: [
            [centerLon - 0.001, centerLat - 0.001],
            [centerLon + 0.001, centerLat - 0.001],
            [centerLon + 0.001, centerLat + 0.001],
            [centerLon - 0.001, centerLat + 0.001],
            [centerLon - 0.001, centerLat - 0.001],
          ],
        },
        {
          type: 'forest',
          confidence: 0.87,
          area: 0.8,
          coordinates: [
            [centerLon - 0.002, centerLat + 0.001],
            [centerLon - 0.001, centerLat + 0.001],
            [centerLon - 0.001, centerLat + 0.002],
            [centerLon - 0.002, centerLat + 0.002],
            [centerLon - 0.002, centerLat + 0.001],
          ],
        },
        {
          type: 'water_body',
          confidence: 0.95,
          area: 0.3,
          coordinates: [
            [centerLon + 0.001, centerLat + 0.001],
            [centerLon + 0.002, centerLat + 0.001],
            [centerLon + 0.002, centerLat + 0.0015],
            [centerLon + 0.001, centerLat + 0.0015],
            [centerLon + 0.001, centerLat + 0.001],
          ],
        },
      ],
      totalArea: 2.3,
    }
  }

  private static mockImageAnalysis(fileName: string): AssetDetectionResult {
    return {
      assets: [
        {
          type: 'agriculture',
          confidence: 0.88,
          area: 0.5,
          coordinates: [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        },
      ],
      totalArea: 0.5,
    }
  }
}

// Composite AI Processing Service
export class AIProcessingService {
  static async processDocumentUpload(
    fileBuffer: Buffer,
    fileName: string
  ): Promise<{
    ocrResult: OCRResult
    nerResult: NERResult
    metadata: FRAMetadata
  }> {
    try {
      // Step 1: Extract text using OCR
      const ocrResult = await OCRService.extractTextFromDocument(fileBuffer, fileName)

      // Step 2: Extract entities using NER
      const nerResult = await NERService.extractEntities(ocrResult.extractedText)

      // Step 3: Extract structured metadata
      const metadata = NERService.extractFRAMetadata(ocrResult.extractedText, nerResult)

      return {
        ocrResult,
        nerResult,
        metadata,
      }
    } catch (error) {
      console.error('AI processing failed:', error)
      throw error
    }
  }
}
