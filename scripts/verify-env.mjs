#!/usr/bin/env node

/**
 * 환경 변수 검증 스크립트
 * 빌드 전 필수 환경 변수들이 설정되어 있는지 확인
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const optionalAuthVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

const optionalEnvVars = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY'
];

function checkEnvFile() {
  const envFiles = ['.env.local', '.env'];
  
  for (const file of envFiles) {
    const path = join(process.cwd(), file);
    if (existsSync(path)) {
      console.log(`✓ Found ${file}`);
      return true;
    }
  }
  
  console.error('❌ No environment file found (.env.local or .env)');
  console.error('Please create .env.local file with required variables');
  return false;
}

function checkEnvVars() {
  // CI 환경(Vercel 등)에서는 process.env 직접 체크
  const isCI = process.env.CI || process.env.VERCEL;
  
  if (isCI) {
    console.log('✓ CI environment detected, checking process.env');
    const missing = [];
    const warnings = [];
    const authWarnings = [];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        missing.push(envVar);
      }
    }
    
    for (const envVar of optionalAuthVars) {
      if (!process.env[envVar]) {
        authWarnings.push(envVar);
      }
    }
    
    for (const envVar of optionalEnvVars) {
      if (!process.env[envVar]) {
        warnings.push(envVar);
      }
    }
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(envVar => console.error(`   - ${envVar}`));
      return false;
    }
    
    if (authWarnings.length > 0) {
      console.warn('⚠️  Missing authentication variables (app will work but auth features disabled):');
      authWarnings.forEach(envVar => console.warn(`   - ${envVar}`));
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️  Missing optional environment variables:');
      warnings.forEach(envVar => console.warn(`   - ${envVar}`));
    }
    
    console.log('✓ All required environment variables are set');
    return true;
  }
  
  // 로컬 환경: .env.local 파일 읽기
  const envFiles = ['.env.local', '.env'];
  let envContent = '';
  
  for (const file of envFiles) {
    const path = join(process.cwd(), file);
    if (existsSync(path)) {
      envContent = readFileSync(path, 'utf-8');
      break;
    }
  }
  
  const missing = [];
  const warnings = [];
  
  for (const envVar of requiredEnvVars) {
    // 파일 내용에서 환경 변수 찾기 (빈 값도 체크)
    const regex = new RegExp(`^${envVar}=(.+)$`, 'm');
    const match = envContent.match(regex);
    if (!match || !match[1] || match[1].trim() === '') {
      missing.push(envVar);
    }
  }
  
  for (const envVar of optionalEnvVars) {
    const regex = new RegExp(`^${envVar}=(.+)$`, 'm');
    const match = envContent.match(regex);
    if (!match || !match[1] || match[1].trim() === '') {
      warnings.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    return false;
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Missing optional environment variables:');
    warnings.forEach(envVar => console.warn(`   - ${envVar}`));
  }
  
  console.log('✓ All required environment variables are set');
  return true;
}

function main() {
  console.log('🔍 Verifying environment configuration...\n');
  
  const isCI = process.env.CI || process.env.VERCEL;
  
  if (isCI) {
    // CI 환경: env 변수만 체크
    const envVarsValid = checkEnvVars();
    if (!envVarsValid) {
      console.log('\n📝 Please configure environment variables in your CI/CD platform\n');
      process.exit(1);
    }
  } else {
    // 로컬 환경: 파일과 env 변수 모두 체크
    const envFileExists = checkEnvFile();
    const envVarsValid = checkEnvVars();
    
    if (!envFileExists || !envVarsValid) {
      console.log('\n📝 To fix this:');
      console.log('1. Copy .env.example to .env.local');
      console.log('2. Fill in the required values');
      console.log('3. Run this script again\n');
      process.exit(1);
    }
  }
  
  console.log('\n✅ Environment configuration is valid');
  process.exit(0);
}

main();
