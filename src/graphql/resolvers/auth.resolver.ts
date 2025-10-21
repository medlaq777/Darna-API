import authService from "../../modules/auth/auth.service.ts";
import prisma from "../../database/prisma.ts";
import { verify } from "crypto";

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      const userId = context.user?.sub;
      if (!userId) return null;
      return prisma.user.findUnique({ where: { id: userId } });
    },
  },
  Mutation: {
    register: async (_: any, { email, password, name }: any) => {
      const result = await authService.register(email, password, name);
      return { message: result.message };
    },
    verifyEmail: async (_: any, { email, code }: any) => {
      await authService.verifyEmail(email, code);
      return { message: "Email Verified" };
    },
    login: async (_: any, { email, password }: any) => {
      const result = await authService.login(email, password);
      return result
    },
    verify2FA: async (_: any, { pendingToken, code }: any) => {
      const result = await authService.verify2FA(pendingToken, code);
      return result;
    },
    enable2FA: async (_: any, __: any, context: any) => {
      const userId = context.user?.sub;
      if (!userId) throw new Error("2FA Require");
      const result = await authService.enable2FA(userId);
      return { message: result.message || "2FA Activited" };
    },
  },
};
