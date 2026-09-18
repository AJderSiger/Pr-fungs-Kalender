import type { NextAuthConfig } from "next-auth";

/**
 * Edge-taugliche Basis-Konfiguration (ohne Credentials-Provider, Prisma oder
 * bcrypt – diese Abhängigkeiten funktionieren nicht in der Middleware/Edge
 * Runtime). Die vollständige Konfiguration inkl. Login-Logik befindet sich
 * in `auth.ts` und wird nur in Node.js-Umgebungen (API-Routen, Server
 * Components) verwendet.
 */
export const authConfig = {
  // Netlify (und andere Hosts ausser Vercel) werden von Auth.js nicht
  // automatisch als vertrauenswürdig erkannt – ohne dies schlägt jede
  // Anfrage mit "There is a problem with the server configuration" fehl.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "STUDENT" | "TEACHER";
        session.user.username = token.username as string;
        session.user.id = token.sub as string;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      const isPublic = pathname === "/login" || pathname.startsWith("/api/auth");
      if (isPublic) return true;

      if (!isLoggedIn) return false;

      const role = auth.user.role;
      if (pathname.startsWith("/lehrer") && role !== "TEACHER") {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
