import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { heroMapping } from '../data/heroMapping.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const BATCH_SIZE = 5
const RETRY_ATTEMPTS = 3
const DELAY_BETWEEN_BATCHES = 2000

const heroesDir = path.join(__dirname, '../../public/heroes')
if (!fs.existsSync(heroesDir)) {
  fs.mkdirSync(heroesDir, { recursive: true })
}

const GENDERS = ['male', 'female']

function normalizeListArg(value) {
  if (!value) return null
  const upper = value.trim().toUpperCase()
  if (upper === 'ALL' || upper === '*') return null
  return upper.split(',').map(v => v.trim()).filter(Boolean)
}

function generatePrompt(heroKey, heroData, gender = 'male') {
  const [mbtiType, enneagramTypeRaw] = heroKey.split('_')
  const enneagramType = enneagramTypeRaw.replace('type', '')
  const genderDescriptor = gender === 'female' ? 'female hero' : 'male hero'

  return [
    `High-detail fantasy illustration of a ${genderDescriptor} named "${heroData.name}" (${heroData.nameEn}), MBTI ${mbtiType} with Enneagram ${enneagramType}.`,
    `Focus on ${heroData.personality || heroData.tagline || ''}.`,
    `Character-centred composition, dynamic heroic pose, full background.`,
    `Style: premium digital painting, semi-realistic rendering, intricate costume details.`,
    `Absolutely no text, lettering, typography, numbers, runes, symbols, UI overlays, logos, banners, plaques or written characters anywhere in the image.`
  ].join(' ')
}

async function generateImage(heroKey, heroData, gender = 'male', attempt = 1) {
  try {
    const prompt = generatePrompt(heroKey, heroData, gender)
    console.log(`\n🎨 생성 중: ${heroKey} (${gender})`)
    console.log(`📝 프롬프트: ${prompt}`)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    })

    const imageUrl = response.data[0].url
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()

    const genderDir = path.join(heroesDir, gender)
    if (!fs.existsSync(genderDir)) {
      fs.mkdirSync(genderDir, { recursive: true })
    }

    const fileName = `${heroKey}.png`
    const filePath = path.join(genderDir, fileName)
    fs.writeFileSync(filePath, Buffer.from(imageBuffer))

    console.log(`✅ 성공: ${fileName}`)
    return { success: true, fileName }
  } catch (error) {
    console.error(`❌ 실패 (시도 ${attempt}/${RETRY_ATTEMPTS}): ${heroKey} (${gender})`, error.message)

    if (attempt < RETRY_ATTEMPTS) {
      console.log(`🔄 재시도 중... (${attempt + 1}/${RETRY_ATTEMPTS})`)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      return generateImage(heroKey, heroData, gender, attempt + 1)
    }

    return { success: false, error: error.message, heroKey, gender }
  }
}

async function processBatch(heroKeys, startIndex, gender) {
  const batch = heroKeys.slice(startIndex, startIndex + BATCH_SIZE)
  const promises = batch.map(heroKey => generateImage(heroKey, heroMapping[heroKey], gender))
  return Promise.all(promises)
}

async function generateAllHeroImages({ targetKeys = null, genders = GENDERS } = {}) {
  console.log('🚀 영웅 이미지 생성 시작!')
  console.log(`🎯 대상 성별: ${genders.join(', ')}`)

  const allHeroKeys = Object.keys(heroMapping)
  const heroKeys = targetKeys
    ? allHeroKeys.filter(key => targetKeys.includes(key.toUpperCase()))
    : allHeroKeys

  console.log(`📊 총 ${heroKeys.length}개 영웅 처리 예정`)

  for (const gender of genders) {
    const genderDir = path.join(heroesDir, gender)
    if (!fs.existsSync(genderDir)) {
      fs.mkdirSync(genderDir, { recursive: true })
    }

    const results = []
    const failedHeroes = []
    const skippedHeroes = []

    const missingHeroKeys = heroKeys.filter(heroKey => {
      const fileName = `${heroKey}.png`
      const filePath = path.join(genderDir, fileName)
      const exists = fs.existsSync(filePath)

      if (exists) {
        skippedHeroes.push(heroKey)
        console.log(`⏭️ 건너뛰기: ${heroKey} (${gender}) (이미 존재)`)
      }

      return !exists
    })

    console.log(`\n📊 ${gender} 처리 통계:`)
    console.log(`✅ 이미 존재: ${skippedHeroes.length}개`)
    console.log(`🔄 생성 필요: ${missingHeroKeys.length}개`)

    for (let i = 0; i < missingHeroKeys.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(missingHeroKeys.length / BATCH_SIZE)

      console.log(`\n📦 배치 ${batchNumber}/${totalBatches} 처리 중...`)
      console.log(`📈 진행률: ${i + 1}-${Math.min(i + BATCH_SIZE, missingHeroKeys.length)}/${missingHeroKeys.length}`)

      const batchResults = await processBatch(missingHeroKeys, i, gender)
      batchResults.forEach(result => {
        results.push(result)
        if (!result.success) {
          failedHeroes.push(result.heroKey)
        }
      })

      if (i + BATCH_SIZE < missingHeroKeys.length) {
        console.log(`⏳ ${DELAY_BETWEEN_BATCHES / 1000}초 대기 중...`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    console.log(`\n🎉 ${gender} 생성 완료!`)
    console.log(`✅ 성공: ${successful}개`)
    console.log(`❌ 실패: ${failed}개`)
    console.log(`⏭️ 건너뛴: ${skippedHeroes.length}개`)

    if (failedHeroes.length > 0) {
      console.log('\n❌ 실패한 영웅들:')
      failedHeroes.forEach(heroKey => console.log(`  - ${heroKey}`))
    }

    const heroIndex = {}
    heroKeys.forEach(heroKey => {
      const fileName = `${heroKey}.png`
      const filePath = path.join(genderDir, fileName)
      heroIndex[heroKey] = {
        fileName,
        exists: fs.existsSync(filePath),
        path: `/heroes/${gender}/${fileName}`,
      }
    })

    const indexPath = path.join(heroesDir, `heroIndex-${gender}.json`)
    fs.writeFileSync(indexPath, JSON.stringify(heroIndex, null, 2))
    console.log(`📄 인덱스 파일 생성: ${indexPath}`)
  }
}

console.log('🚀 스크립트 시작...')
console.log('🔑 API 키 확인:', process.env.OPENAI_API_KEY ? '설정됨' : '설정되지 않음')

if (import.meta.url.includes(process.argv[1].replace(/\\/g, '/'))) {
    console.log('✅ 스크립트 실행 조건 만족')

    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.')
        process.exit(1)
    }

    const args = process.argv.slice(2)
    const genderArgIndex = args.findIndex(arg => arg === '--gender')
    const onlyArgIndex = args.findIndex(arg => arg === '--only')
    const includeKeysIndex = args.findIndex(arg => arg === '--keys')

    let gendersToProcess = GENDERS
    let targetKeys = null

    if (genderArgIndex !== -1 && args[genderArgIndex + 1]) {
        const parsed = normalizeListArg(args[genderArgIndex + 1])
        if (parsed) {
            gendersToProcess = parsed.filter(g => GENDERS.includes(g.toLowerCase())).map(g => g.toLowerCase())
        }
    }

    if (onlyArgIndex !== -1 && args[onlyArgIndex + 1]) {
        const parsed = normalizeListArg(args[onlyArgIndex + 1])
        if (parsed) {
            targetKeys = parsed.map(key => key.toUpperCase())
        }
    }

    if (includeKeysIndex !== -1 && args[includeKeysIndex + 1]) {
        const parsed = normalizeListArg(args[includeKeysIndex + 1])
        if (parsed) {
            targetKeys = parsed.map(key => key.toUpperCase())
        }
    }

    generateAllHeroImages({ targetKeys, genders: gendersToProcess })
        .then(() => {
            console.log('\n🎊 모든 작업이 완료되었습니다!')
            process.exit(0)
        })
        .catch(error => {
            console.error('💥 치명적 오류:', error)
            process.exit(1)
        })
} else {
    console.log('❌ 스크립트 실행 조건 불만족')
}

export { generateAllHeroImages, generateImage }
