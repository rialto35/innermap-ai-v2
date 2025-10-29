#!/usr/bin/env node
/**
 * Check FK constraints on user_profiles
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

console.log('🔍 Checking FK constraints on user_profiles...\n')

// Query PostgreSQL system tables for FK info
const { data, error } = await supabase.rpc('exec_sql', {
  query: `
    SELECT 
      tc.constraint_name,
      tc.table_schema,
      tc.table_name,
      kcu.column_name,
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'user_profiles'
      AND kcu.column_name = 'user_id';
  `
})

if (error) {
  console.error('❌ Error querying FK:', error)
  
  // Try alternative approach using pg_catalog
  console.log('\n🔄 Trying alternative query...\n')
  
  const { data: altData, error: altError } = await supabase.rpc('exec_sql', {
    query: `
      SELECT conname, conrelid::regclass, confrelid::regclass
      FROM pg_constraint
      WHERE contype = 'f'
        AND conrelid = 'public.user_profiles'::regclass;
    `
  })
  
  if (altError) {
    console.error('❌ Alternative query failed:', altError)
  } else {
    console.log('✅ FK constraints:', JSON.stringify(altData, null, 2))
  }
} else {
  console.log('✅ FK constraints:', JSON.stringify(data, null, 2))
}

console.log('\n✅ Check complete')

