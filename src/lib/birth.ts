// 생년월일 관련 유틸리티

export function getSeasonFromDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.getMonth() + 1

  if (month >= 3 && month <= 5) return '봄'
  if (month >= 6 && month <= 8) return '여름'
  if (month >= 9 && month <= 11) return '가을'
  return '겨울'
}

export function getWeekdayFromDate(dateString: string): string {
  const date = new Date(dateString)
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return days[date.getDay()]
}

export function getZodiacSign(dateString: string): string {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()

  const signs = [
    { sign: '물병자리', start: [1, 20], end: [2, 18] },
    { sign: '물고기자리', start: [2, 19], end: [3, 20] },
    { sign: '양자리', start: [3, 21], end: [4, 19] },
    { sign: '황소자리', start: [4, 20], end: [5, 20] },
    { sign: '쌍둥이자리', start: [5, 21], end: [6, 21] },
    { sign: '게자리', start: [6, 22], end: [7, 22] },
    { sign: '사자자리', start: [7, 23], end: [8, 22] },
    { sign: '처녀자리', start: [8, 23], end: [9, 22] },
    { sign: '천칭자리', start: [9, 23], end: [10, 23] },
    { sign: '전갈자리', start: [10, 24], end: [11, 22] },
    { sign: '사수자리', start: [11, 23], end: [12, 21] },
    { sign: '염소자리', start: [12, 22], end: [1, 19] }
  ]

  for (const { sign, start, end } of signs) {
    if (
      (month === start[0] && day >= start[1]) ||
      (month === end[0] && day <= end[1])
    ) {
      return sign
    }
  }

  return '염소자리'
}

export function getBirthProfile(dateString: string) {
  return {
    season: getSeasonFromDate(dateString),
    weekday: getWeekdayFromDate(dateString),
    zodiac: getZodiacSign(dateString),
    dateString
  }
}

export function calculateAge(dateString: string): number {
  const birth = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}
