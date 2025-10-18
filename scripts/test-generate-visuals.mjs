#!/usr/bin/env node
/**
 * Test script for generate-visuals Edge Function
 * 
 * Usage:
 *   node scripts/test-generate-visuals.mjs [reportId]
 * 
 * Example:
 *   node scripts/test-generate-visuals.mjs 0ca4e143-171b-443c-b99b-792b16d6bc70
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const reportId = process.argv[2];

if (!reportId) {
  console.error('❌ Error: reportId required');
  console.log('Usage: node scripts/test-generate-visuals.mjs [reportId]');
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing environment variables');
  console.log('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const functionUrl = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/generate-visuals`;

console.log('🚀 Testing generate-visuals Edge Function');
console.log('📍 URL:', functionUrl);
console.log('📝 Report ID:', reportId);
console.log('');

try {
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reportId })
  });

  console.log('📊 Response Status:', response.status, response.statusText);
  console.log('');

  const data = await response.text();
  
  try {
    const json = JSON.parse(data);
    console.log('✅ Response Body (JSON):');
    console.log(JSON.stringify(json, null, 2));
  } catch {
    console.log('⚠️ Response Body (Text):');
    console.log(data);
  }

  console.log('');
  if (response.ok) {
    console.log('✅ Success!');
  } else {
    console.log('❌ Failed!');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}

