#!/usr/bin/env node
/**
 * Check latest assessment result for a user
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Load .env.local manually
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

const userId = '8ffeb51e-8b10-4258-b939-9395dacdb667'
console.log(`🔍 Checking latest result for user: ${userId}\n`)

async function checkLatestResult() {
  // 1. Get latest assessment
  const { data: latest, error: latestError } = await supabaseAdmin
    .from('test_assessments')
    .select('id, user_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  console.log('📊 Latest assessment:')
  if (latestError) {
    console.error('❌ Error:', latestError)
    return
  }
  if (!latest) {
    console.log('❌ No assessments found')
    return
  }
  console.log('✅ Assessment ID:', latest.id)
  console.log('   Created at:', latest.created_at)

  // 2. Get result
  const { data: result, error: resultError } = await supabaseAdmin
    .from('test_assessment_results')
    .select('*')
    .eq('assessment_id', latest.id)
    .maybeSingle()

  console.log('\n📊 Assessment result:')
  if (resultError) {
    console.error('❌ Error:', resultError)
    return
  }
  if (!result) {
    console.log('❌ No result found')
    return
  }
  console.log('✅ MBTI:', result.mbti)
  console.log('   Big5:', result.big5)
  console.log('   World:', result.world)
  console.log('   Confidence:', result.confidence)

  console.log('\n✅ Check complete')
}

checkLatestResult()

