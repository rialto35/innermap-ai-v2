import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { findOrCreateUser } from '@/lib/db/users'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { birthdate } = await request.json()
    
    // Validate date format (YYYY-MM-DD)
    if (!birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' }, 
        { status: 400 }
      )
    }

    console.log('📅 [API /profile/birthdate] Saving birthdate:', { 
      email: session.user.email, 
      birthdate 
    })

    // Get user
    const provider = (session as any)?.provider || 'google'
    const providerId = (session as any)?.providerId

    const userResult = await findOrCreateUser({
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      provider,
      providerId,
    })

    if (!userResult.user) {
      console.error('❌ [API /profile/birthdate] User not found')
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      )
    }

    console.log('✅ [API /profile/birthdate] User found:', userResult.user.id)

    // Update user_profiles
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: userResult.user.id,
        birthdate,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('❌ [API /profile/birthdate] Failed to save:', error)
      return NextResponse.json(
        { error: 'Failed to save birthdate' }, 
        { status: 500 }
      )
    }

    console.log('✅ [API /profile/birthdate] Saved successfully')

    return NextResponse.json({ 
      ok: true,
      message: 'Birthdate saved successfully' 
    })

  } catch (error) {
    console.error('❌ [API /profile/birthdate] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

