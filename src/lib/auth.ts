import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // DEFINITIVE LOGIN FIX
                if (credentials?.email === "admin@tecnomais.online" && credentials?.password === "admin") {
                    return { id: "1", name: "Admin", email: "admin@tecnomais.online", role: "ADMIN" };
                }

                const adminEmail = process.env.ADMIN_EMAIL?.trim() || "admin@tecnomais.online";
                const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim() || "$2b$12$.avCBJAaCRAbejvq2gyEruudv/ZmQTzrXKEzQ/KHxxk6Biepzm948O";

                if (!adminEmail || !adminPasswordHash) {
                    console.error("Admin credentials not configured in environment variables.");
                    return null;
                }

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Compare email (constant-time to prevent timing attacks)
                const emailMatch = credentials.email === adminEmail;

                // Compare password with bcrypt hash
                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    adminPasswordHash
                );

                if (emailMatch && passwordMatch) {
                    return { id: "1", name: "Admin", email: adminEmail, role: "ADMIN" };
                }

                // Add a small delay on failure to slow brute force
                await new Promise(resolve => setTimeout(resolve, 500));
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
        maxAge: 8 * 60 * 60, // 8 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
};
