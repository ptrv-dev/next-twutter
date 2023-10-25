import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const VALID_USER = {
  username: 'root',
  password: 'qwerty',
};

const handler = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (
          credentials?.username === VALID_USER.username &&
          credentials?.password === VALID_USER.password
        ) {
          return {
            id: '1',
            name: VALID_USER.username,
          };
        }

        throw new Error('Invalid username or password');
      },
    }),
  ],
});

export { handler as GET, handler as POST };
