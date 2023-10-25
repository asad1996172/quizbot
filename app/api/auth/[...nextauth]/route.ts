import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async session({ session }) {
            if (session.user) {
                const sessionUser = await User.findOne({ email: session.user.email });
                (session.user as any).id = sessionUser._id.toString();
            }
            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDatabase();

                // check if user exists in db
                const user = await User.findOne({ email: profile?.email });

                // if not, create user in db
                if (!user) {
                    await User.create({
                        email: profile?.email,
                        username: profile?.name?.replace(" ", "").toLowerCase(),
                        image: (profile as any).picture
                    });
                }

                return true
            } catch (error) {
                console.log(error);
                return false
            }

        }
    }
})

export { handler as GET, handler as POST }