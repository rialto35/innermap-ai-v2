#!/usr/bin/env node
/**
 * Check if user exists in users table
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

const supabase = createClient(supabaseUrl, supabaseKey)

const userId = '8ffeb51e-8b10-4258-b939-9395dacdb667'

console.log('🔍 Checking user:', userId)

// 1. Check users table
const { data: user, error: userError } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .maybeSingle()

console.log('\n📊 users table:')
if (userError) {
  console.error('❌ Error:', userError)
} else if (!user) {
  console.log('❌ User NOT found')
} else {
  console.log('✅ User found:', user)
}

// 2. Count users
const { count, error: countError } = await supabase
  .from('users')
  .select('id', { count: 'exact', head: true })
  .eq('id', userId)

console.log('\n📊 Count query:')
if (countError) {
  console.error('❌ Error:', countError)
} else {
  console.log(`Count: ${count}`)
}

// 3. Check test_assessments
const { data: assessments, error: assessError } = await supabase
  .from('test_assessments')
  .select('id, user_id, created_at')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(3)

console.log('\n📊 test_assessments:')
if (assessError) {
  console.error('❌ Error:', assessError)
} else if (!assessments || assessments.length === 0) {
  console.log('❌ No assessments found')
} else {
  console.log(`✅ Found ${assessments.length} assessments:`)
  assessments.forEach(a => {
    console.log(`  - ${a.id} (${a.created_at})`)
  })
}

// 4. Check user_profiles
const { data: profile, error: profileError } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .maybeSingle()

console.log('\n📊 user_profiles:')
if (profileError) {
  console.error('❌ Error:', profileError)
} else if (!profile) {
  console.log('❌ Profile NOT found')
} else {
  console.log('✅ Profile found:', profile)
}

console.log('\n✅ Check complete')

