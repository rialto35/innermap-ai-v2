import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// 카카오 프로바이더 (NextAuth v4 호환)
const createKakaoProvider = () => ({
  id: 'kakao',
  name: 'Kakao',
  type: 'oauth',
  version: '2.0',
  authorization: {
    url: 'https://kauth.kakao.com/oauth/authorize',
    params: {
      scope: 'profile_nickname profile_image',
      response_type: 'code',
      prompt: 'login',
    },
  },
  token: {
    url: 'https://kauth.kakao.com/oauth/token',
    async request({ params }: any) {
      const clientId = String(process.env.KAKAO_CLIENT_ID || '')
      const clientSecret = process.env.KAKAO_CLIENT_SECRET ? String(process.env.KAKAO_CLIENT_SECRET) : ''
      const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/kakao`

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: String(params?.code || ''),
      })
      if (clientSecret) body.set('client_secret', clientSecret)

      const res = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
        body,
      })

      const text = await res.text()
      if (!res.ok) {
        try {
          const errJson = JSON.parse(text)
          console.error('Kakao token error:', { status: res.status, errJson, sent: { client_id: clientId ? '***' : '', has_secret: Boolean(clientSecret), redirect_uri: redirectUri } })
          return { tokens: errJson }
        } catch {
          console.error('Kakao token error (non-JSON):', { status: res.status, text, sent: { client_id: clientId ? '***' : '', has_secret: Boolean(clientSecret), redirect_uri: redirectUri } })
          return { tokens: { error: 'token_request_failed', error_description: text } as any }
        }
      }
      try {
        const tokens = JSON.parse(text)
        return { tokens }
      } catch {
        console.error('Kakao token parse error:', { text })
        return { tokens: { error: 'invalid_token_response', error_description: text } as any }
      }
    },
  },
  userinfo: 'https://kapi.kakao.com/v2/user/me',
  clientId: process.env.KAKAO_CLIENT_ID!,
  clientSecret: process.env.KAKAO_CLIENT_SECRET!,
  profile(profile: any) {
    return {
      id: profile.id.toString(),
      name: profile.kakao_account?.profile?.nickname || profile.kakao_account?.name || 'Kakao User',
      email: profile.kakao_account?.email,
      image: profile.kakao_account?.profile?.profile_image_url,
      provider: 'kakao',
    }
  },
})

// 네이버 프로바이더 (NextAuth v4 호환)
const createNaverProvider = () => ({
  id: 'naver',
  name: 'Naver',
  type: 'oauth',
  version: '2.0',
  authorization: {
    url: 'https://nid.naver.com/oauth2.0/authorize',
    params: {
      scope: 'name email profile_image',
      response_type: 'code',
      auth_type: 'reauthenticate',
    },
  },
  token: 'https://nid.naver.com/oauth2.0/token',
  userinfo: 'https://openapi.naver.com/v1/nid/me',
  clientId: process.env.NAVER_CLIENT_ID!,
  clientSecret: process.env.NAVER_CLIENT_SECRET!,
  profile(profile: any) {
    return {
      id: profile.response.id,
      name: profile.response.name,
      email: profile.response.email,
      image: profile.response.profile_image,
      provider: 'naver',
    }
  },
})

// 환경 변수 디버그 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 NextAuth 환경 변수 확인:')
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ 설정됨' : '❌ 누락')
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ 설정됨' : '❌ 누락')
  console.log('KAKAO_CLIENT_ID:', process.env.KAKAO_CLIENT_ID ? '✅ 설정됨' : '❌ 누락')
  console.log('KAKAO_CLIENT_SECRET:', process.env.KAKAO_CLIENT_SECRET ? '✅ 설정됨' : '❌ 누락')
  console.log('NAVER_CLIENT_ID:', process.env.NAVER_CLIENT_ID ? '✅ 설정됨' : '❌ 누락')
  console.log('NAVER_CLIENT_SECRET:', process.env.NAVER_CLIENT_SECRET ? '✅ 설정됨' : '❌ 누락')
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ 설정됨' : '❌ 누락')
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    createKakaoProvider() as any,
    createNaverProvider() as any,
  ],
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // 환경별 URL 자동 설정
  ...(process.env.NODE_ENV === 'development' && {
    // 개발 환경에서는 localhost 사용
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000'
  }),
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/welcome',
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // 신규 사용자 체크를 위해 DB 조회
      if (account) {
        try {
          const { supabaseAdmin } = await import('@/lib/supabase')
          const provider = account.provider
          const providerId = account.providerAccountId
          
          // 해당 프로바이더 계정이 이미 존재하는지 확인
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('provider', provider)
            .eq('provider_id', providerId)
            .maybeSingle()
          
          // 신규 사용자면 토큰에 플래그 추가
          if (!existingUser) {
            ;(user as any).isNewUser = true
          }
        } catch (error) {
          console.error('Error checking new user:', error)
        }
      }
      return true
    },
    async jwt({ token, account, profile, user }) {
      if (account) {
        ;(token as any).provider = account.provider
        if (account.providerAccountId) {
          ;(token as any).providerId = account.providerAccountId
        }
      }
      if (user && (user as any).isNewUser) {
        ;(token as any).isNewUser = true
      }
      if (profile && typeof profile === 'object') {
        const p = profile as Record<string, unknown>
        if (typeof p.name === 'string' && !token.name) token.name = p.name
        if (typeof p.picture === 'string' && !(token as any).picture) (token as any).picture = p.picture
        if (typeof p.provider === 'string' && !(token as any).provider) (token as any).provider = p.provider
      }
      return token
    },
    async session({ session, token }) {
      const s: any = session
      s.user = s.user || {}
      if (!s.user.name && typeof token.name === 'string') s.user.name = token.name
      const pic = (token as any).picture
      if (!s.user.image && typeof pic === 'string') s.user.image = pic
      s.provider = (token as any).provider
      if ((token as any).providerId) s.providerId = (token as any).providerId
      if ((token as any).isNewUser) s.isNewUser = true
      return s
    },
  },
}
