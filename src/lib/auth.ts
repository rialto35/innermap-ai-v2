import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// 환경 변수 디버그 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 NextAuth 환경 변수 확인:');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ 설정됨' : '❌ 누락');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ 설정됨' : '❌ 누락');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
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
    async jwt({ token, account, profile }) {
      if (account) {
        ;(token as any).provider = account.provider
      }
      if (profile && typeof profile === 'object') {
        const p = profile as Record<string, unknown>
        if (typeof p.name === 'string' && !token.name) token.name = p.name
        if (typeof p.picture === 'string' && !(token as any).picture) (token as any).picture = p.picture
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
      return s
    },
  },
}
