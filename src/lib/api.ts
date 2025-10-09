// API 호출 래퍼 함수들

interface AnalyzePayload {
  name?: string
  birthDate: string
  answers: Record<string, number>
}

interface AnalyzeResponse {
  success: boolean
  data: {
    hero: string
    continent: string
    emoji: string
    tagline: string
    sections: any
    metadata: any
  }
}

export async function analyzeProfile(payload: AnalyzePayload): Promise<AnalyzeResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '분석 실패')
  }

  return response.json()
}

interface ReportPayload {
  html: string
  format?: 'pdf' | 'image'
}

interface ReportResponse {
  success: boolean
  data: {
    pdfUrl: string
    format: string
    size: string
    pages: number
  }
}

export async function generateReport(payload: ReportPayload): Promise<ReportResponse> {
  const response = await fetch('/api/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '리포트 생성 실패')
  }

  return response.json()
}

// 로컬스토리지 헬퍼
export const storage = {
  setTestData: (data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('innermap_test', JSON.stringify(data))
    }
  },
  
  getTestData: () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('innermap_test')
      return data ? JSON.parse(data) : null
    }
    return null
  },
  
  clearTestData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('innermap_test')
    }
  }
}
