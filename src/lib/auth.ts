import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: false, // disable debug in production
  pages: {
    signIn: '/login',
    error: '/login',
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
