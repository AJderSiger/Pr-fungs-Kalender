import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "STUDENT" | "TEACHER";
    username: string;
  }

  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "TEACHER";
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "STUDENT" | "TEACHER";
    username: string;
  }
}
