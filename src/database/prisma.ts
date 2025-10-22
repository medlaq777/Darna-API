import { PrismaClient } from "@prisma/client";

class Prisma {
  private static instance: PrismaClient;

  private constructor() { }

  public static getInstance(): PrismaClient {
    if (!Prisma.instance) {
      Prisma.instance = new PrismaClient();
      if (process.env.NODE_ENV !== "production") {
        (global as any).__prisma = Prisma.instance;
      }
    }

    return Prisma.instance;
  }
}

const prisma = Prisma.getInstance();

export default prisma;
