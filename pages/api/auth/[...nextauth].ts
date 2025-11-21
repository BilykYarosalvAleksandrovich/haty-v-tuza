import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const DATA_PATH = path.join(process.cwd(), 'data', 'users.json');

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const raw = await fs.readFile(DATA_PATH, 'utf8');
        const users = JSON.parse(raw || '[]');
        const user = users.find((u:any)=>u.email===credentials.email.toLowerCase());
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        const { password, ...safe } = user;
        return safe;
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.email = (user as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user = { id: (token as any).id, name: token.name, email: token.email };
      }
      return session;
    }
  },
  pages: { signIn: '/auth/login' },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret'
});
