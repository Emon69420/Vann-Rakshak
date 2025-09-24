type OcrSpaceParsedResult = {
  ParsedText: string
}
type OcrSpaceResponse = {
  IsErroredOnProcessing: boolean
  ErrorMessage?: string | string[]
  ParsedResults?: OcrSpaceParsedResult[]
}

const API_KEY =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_OCRSPACE_API_KEY) ||
  (typeof process !== 'undefined' && (process as any)?.env?.NEXT_PUBLIC_OCRSPACE_API_KEY) ||
  'K85513057188957' // fallback to the key you provided; prefer env vars in production

export const runOCR = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Upload with XMLHttpRequest to report progress
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const url = 'https://api.ocr.space/parse/image'
    const fd = new FormData()
    fd.append('apikey', API_KEY)
    fd.append('language', 'eng')
    fd.append('isOverlayRequired', 'false')
    fd.append('scale', 'true')
    fd.append('OCREngine', '2') // good quality
    fd.append('file', file, file.name)

    // Upload progress (0..0.5)
    xhr.upload.onprogress = (e) => {
      if (!onProgress || !e.lengthComputable) return
      const p = 0.05 + 0.45 * (e.loaded / e.total)
      onProgress(Math.min(0.5, p))
    }

    xhr.onloadstart = () => {
      if (onProgress) onProgress(0.05)
    }

    // Download/processing phase hint (0.5..0.9)
    xhr.onprogress = () => {
      if (onProgress) onProgress(0.8)
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      if (xhr.status !== 200) {
        return reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
      }
      try {
        const res: OcrSpaceResponse = JSON.parse(xhr.responseText)
        if (res.IsErroredOnProcessing) {
          const msg = Array.isArray(res.ErrorMessage) ? res.ErrorMessage.join(', ') : res.ErrorMessage || 'OCR error'
          return reject(new Error(msg))
        }
        const text = (res.ParsedResults || []).map(r => r.ParsedText || '').join('\n').trim()
        if (onProgress) onProgress(1)
        resolve(text)
      } catch (e) {
        reject(new Error('Failed to parse OCR response'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error'))
    xhr.ontimeout = () => reject(new Error('Request timed out'))
    xhr.timeout = 120000 // 120s

    xhr.open('POST', url, true)
    xhr.send(fd)
  })
}