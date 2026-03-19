import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@tecnomais.online" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // For demonstration, using hardcoded admin credentials.
                // In a real application, you would query the database here using Prisma.
                if (
                    credentials?.email === "admin@tecnomais.online" &&
                    credentials?.password === "admin123"
                ) {
                    return { id: "1", name: "Admin User", email: "admin@tecnomais.online", role: "ADMIN" };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as unknown as { role: string }).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as unknown as { role: string }).role = token.role as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
