import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials){
                const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [credentials.email]);

                if (rows.length === 0) return null;

                const user = rows[0];
                const correctPassword = await bcrypt.compare(credentials.password, user.password_hash);

                if (!correctPassword) return null;

                return { id: user.id, name: user.nombre, email: user.email };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }){
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }){
            session.user.id = token.id;
            return session;
        }
    },
    pages: { signIn: "/login" },
    secret: process.env.NEXTAUTH_SECRET
});

export {handler as GET, handler as POST};