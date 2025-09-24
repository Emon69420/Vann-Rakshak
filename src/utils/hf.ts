export type SchemeRecommendation = {
  id: string
  name: string
  description: string
  benefits: string
  matchScore: number
  category: string
  icon: string
}

type HfGenResponse = Array<{ generated_text?: string }> | { generated_text?: string } | string

const HF_TOKEN =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_HF_TOKEN) ||
  (typeof process !== 'undefined' && (process as any)?.env?.NEXT_PUBLIC_HF_TOKEN) ||
  ''

const MODEL =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_HF_MODEL) ||
  // Pick a commonly available instruct model
  'mistralai/Mistral-7B-Instruct-v0.2'

// Call HF text-generation endpoint and ask for strict JSON
export async function generateRecommendationsFromHF(input: {
  claim: { id: string; holder: string; village: string; type: string }
  ocrText?: string
}): Promise<SchemeRecommendation[]> {
  if (!HF_TOKEN) throw new Error('Missing Hugging Face token (VITE_HF_TOKEN)')

  const prompt = `
You are a government schemes recommender. Return ONLY strict JSON matching this schema:
{
  "recommendations": [
    { "id": "string", "name": "string", "description": "string", "benefits": "string",
      "matchScore": 0-100, "category": "string", "icon": "string emoji" }
  ]
}

Context:
- Claim: ${JSON.stringify(input.claim)}
- OCR Extract (optional): ${input.ocrText ? input.ocrText.slice(0, 2000) : 'N/A'}

Rules:
- Output only JSON.
- 4 to 6 items.
- Set matchScore based on relevance to claim type and village context.
`.trim()

  const res = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(MODEL)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3,
        return_full_text: false,
      },
    }),
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`HF API ${res.status}: ${msg}`)
  }

  const data: HfGenResponse = await res.json()

  const text =
    typeof data === 'string'
      ? data
      : Array.isArray(data)
        ? data[0]?.generated_text || ''
        : data.generated_text || ''

  // Extract first JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('HF did not return JSON')

  const parsed = JSON.parse(jsonMatch[0]) as { recommendations: SchemeRecommendation[] }
  if (!parsed?.recommendations?.length) throw new Error('No recommendations in JSON')

  // Clamp and sanitize
  return parsed.recommendations.map(r => ({
    ...r,
    matchScore: Math.max(0, Math.min(100, Math.round(Number(r.matchScore) || 0))),
  }))
}