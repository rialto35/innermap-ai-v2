// src/lib/db/users.ts
// 사용자 관련 데이터베이스 함수

import { supabaseAdmin } from '@/lib/supabase'
import type { User } from '@/lib/supabase'

/**
 * 이메일로 사용자 조회 또는 생성
 */
export async function findOrCreateUser(data: {
  email: string
  name?: string | null
  image?: string | null
  provider: string
  providerId?: string
}): Promise<User | null> {
  try {
    console.log('findOrCreateUser called with:', { email: data.email, provider: data.provider })
    // 기존 사용자 조회
    console.log('Querying existing user...')
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single()
    
    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding user:', findError)
    }

    if (existingUser) {
      // 기존 사용자 정보 업데이트 (이름/이미지가 변경되었을 수 있음)
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          name: data.name || existingUser.name,
          image: data.image || existingUser.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user:', updateError)
        return existingUser
      }

      return updatedUser
    }

    // 새 사용자 생성
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        email: data.email,
        name: data.name,
        image: data.image,
        provider: data.provider,
        provider_id: data.providerId
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      return null
    }

    // 기본 설정 생성
    await supabaseAdmin
      .from('user_settings')
      .insert({
        user_id: newUser.id
      })

    return newUser
  } catch (error) {
    console.error('Error in findOrCreateUser:', error)
    return null
  }
}

/**
 * 사용자 ID로 조회
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error getting user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserById:', error)
    return null
  }
}

/**
 * 사용자 레벨/경험치 업데이트
 */
export async function updateUserExp(
  userId: string,
  expGained: number
): Promise<{ levelUp: boolean; newLevel: number } | null> {
  try {
    const user = await getUserById(userId)
    if (!user) return null

    let newExpCurrent = user.exp_current + expGained
    let newLevel = user.level
    let newExpNext = user.exp_next

    // 레벨업 체크
    while (newExpCurrent >= newExpNext) {
      newExpCurrent -= newExpNext
      newLevel += 1
      newExpNext = Math.floor(newExpNext * 1.5) // 다음 레벨 경험치 증가
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        level: newLevel,
        exp_current: newExpCurrent,
        exp_next: newExpNext,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user exp:', error)
      return null
    }

    return {
      levelUp: newLevel > user.level,
      newLevel
    }
  } catch (error) {
    console.error('Error in updateUserExp:', error)
    return null
  }
}

