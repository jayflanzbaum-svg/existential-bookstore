// NOTE: You must create a GitHub OAuth App at github.com/settings/developers
// and add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your Vercel environment
// variables and .env.local before GitHub login will work.
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email === process.env.ADMIN_GITHUB_EMAIL;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
});

export { handler as GET, handler as POST };
