import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

// Version-agnostic config type (v4/v5 compatible)
// Avoid importing AuthOptions/NextAuthOptions to prevent version conflicts
type AuthConfig = {
  providers: any[]
  session?: any
  jwt?: any
  callbacks?: any
  pages?: any
  [key: string]: any
}

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

export const authOptions: AuthConfig = {
  providers: [
    // E2E 테스트 전용 Credentials Provider
    ...(process.env.NEXT_PUBLIC_E2E === '1'
      ? [
          Credentials({
            id: 'e2e',
            name: 'E2E Test',
            credentials: {
              email: { label: 'Email', type: 'text' },
              password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
              if (credentials?.email === 'e2e@innermap.ai' && credentials?.password === 'pass') {
                return {
                  id: 'e2e-user',
                  name: 'E2E Tester',
                  email: 'e2e@innermap.ai',
                  image: null,
                }
              }
              return null
            },
          }) as any,
        ]
      : []),
    // 개발 전용 Credentials Provider
    ...(process.env.NODE_ENV === 'development' || process.env.DEV_AUTH_ENABLED === 'true'
      ? [
          Credentials({
            id: 'dev',
            name: 'Dev Login',
            credentials: {
              email: { label: 'Email', type: 'text' },
              name: { label: 'Name', type: 'text' },
            },
            async authorize(credentials) {
              const email = (credentials?.email || '').trim()
              if (!email) return null
              return {
                id: email, // providerAccountId 대용
                name: credentials?.name || 'Dev User',
                email,
                image: null as any,
              } as any
            },
          }) as any,
        ]
      : []),
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
  debug: process.env.NODE_ENV === 'development' && process.env.NEXTAUTH_DEBUG === 'true',
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
    async signIn({ user, account }: any) {
      // 신규 사용자 체크를 위해 DB 조회
      if (account) {
        try {
          const { supabaseAdmin } = await import('@/lib/supabase')
          const provider = account.provider === 'credentials' ? 'dev' : account.provider
          const providerId = account.provider === 'credentials' ? (user?.email as string) : (account.providerAccountId as string | undefined)
          
          // 해당 프로바이더 계정이 이미 존재하는지 확인
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('provider', provider)
            .eq('provider_id', providerId)
            .maybeSingle()
          
          if (existingUser) {
            // 기존 사용자: Supabase UUID를 user.id에 저장
            ;(user as any).supabaseId = existingUser.id
          } else {
            // 신규 사용자: 플래그 추가 (나중에 users 테이블에 insert 필요)
            ;(user as any).isNewUser = true
          }
        } catch (error) {
          console.error('Error checking new user:', error)
        }
      }
      return true
    },
    async jwt({ token, account, profile, user }: any) {
      if (account) {
        const provider: string = (account as any).provider === 'credentials' ? 'dev' : (account as any).provider;
        (token as any).provider = provider;
        const providerId = (account as any).provider === 'credentials' ? (user as any)?.email : (account as any).providerAccountId
        if (providerId) (token as any).providerId = providerId
      }
      // Supabase UUID를 토큰에 저장 (signIn 콜백에서 설정됨)
      if ((user as any)?.supabaseId) {
        (token as any).supabaseId = (user as any).supabaseId;
      }
      if (user && (user as any).isNewUser) {
        (token as any).isNewUser = true
      }
      if (profile && typeof profile === 'object') {
        const p = profile as Record<string, unknown>
        if (typeof p.name === 'string' && !token.name) token.name = p.name
        if (typeof p.picture === 'string' && !(token as any).picture) (token as any).picture = p.picture
        if (typeof p.provider === 'string' && !(token as any).provider) (token as any).provider = p.provider
      }
      return token
    },
    async session({ session, token }: any) {
      const s: any = session
      s.user = s.user || {}
      // Supabase UUID를 session.user.id로 전달
      if ((token as any).supabaseId) {
        s.user.id = (token as any).supabaseId
      }
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

// v4 Route Handler export
// @ts-expect-error - NextAuth v4 default export callable
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
