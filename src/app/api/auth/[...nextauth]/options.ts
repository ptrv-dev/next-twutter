import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt';
import { prisma } from '@/app/prisma';

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });
        if (!user) {
          throw new Error('Incorrect username or password');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials?.password || '',
          user.password
        );
        if (!isPasswordValid) {
          throw new Error('Incorrect username or password');
        }

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          image: user.avatar,
        };
      },
    }),
  ],
};
