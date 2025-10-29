#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const envPath = join(rootDir, '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
envContent.split('\n').forEach(line => {
  line = line.trim()
  if (!line || line.startsWith('#')) return
  const eqIndex = line.indexOf('=')
  if (eqIndex === -1) return
  const key = line.substring(0, eqIndex).trim()
  const value = line.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
  if (key) process.env[key] = value
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const assessmentId = '34d88717-cf91-40f2-9bbe-8aef4e9a8467'

console.log('🔍 Checking assessment:', assessmentId, '\n')

const { data, error } = await supabase
  .from('test_assessments')
  .select(`
    id, created_at, raw_answers,
    test_assessment_results (
      assessment_id, mbti, big5, keywords, inner9, world, confidence
    )
  `)
  .eq('id', assessmentId)
  .maybeSingle()

if (error) {
  console.error('❌ Error:', error)
} else if (!data) {
  console.log('❌ Assessment NOT found')
} else {
  console.log('✅ Assessment found:')
  console.log('  ID:', data.id)
  console.log('  Created:', data.created_at)
  console.log('  Has raw_answers:', !!data.raw_answers)
  console.log('  Results:', data.test_assessment_results?.length || 0, 'records')
  if (data.test_assessment_results?.[0]) {
    console.log('  MBTI:', data.test_assessment_results[0].mbti)
    console.log('  Big5:', data.test_assessment_results[0].big5)
  }
}

console.log('\n✅ Check complete')

