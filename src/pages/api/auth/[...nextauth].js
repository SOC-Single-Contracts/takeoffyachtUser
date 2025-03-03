import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        Email: { label: "Email", type: "email", placeholder: "Your email" },
        Password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/Auth/Login/`,
            {
              Email: credentials.Email,
              Password: credentials.Password,
            }
          );
          
          const user = response.data;
          if (!user) {
            return null;
          }
          return user;
        } catch (error) {
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // First try to sign in with the access token
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/Auth/GoogleSignInCallbackView/?code=${account.access_token}`
          );
          
          if (response.data) {
            return true;
          }
          
          // If sign in fails, try registration
          const registerResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/Auth/GoogleSignInRedirectView/`,
            {
              params: {
                email: profile.email,
                name: profile.name,
                picture: profile.picture
              }
            }
          );
          
          return !!registerResponse.data;
        } catch (error) {
          console.error("Google auth error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          user
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user || session.user;
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
