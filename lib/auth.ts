import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
          });
          if (!user?.role?.split(",").includes("admin") || user.banned)
            return false;
          return { data: session };
        },
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 30,
    customRules: { "/sign-in/email": { window: 60, max: 5 } },
  },

  emailAndPassword: {
    enabled: true,

    // IMPORTANT:
    // Public admin registration must not exist.
    disableSignUp: true,

    minPasswordLength: 8,
  },

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
