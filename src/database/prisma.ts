import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() { }

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient();
      if (process.env.NODE_ENV !== "production") {
        (global as any).__prisma = PrismaSingleton.instance;
      }
    }

    return PrismaSingleton.instance;
  }
}

const prisma = PrismaSingleton.getInstance();

export default prisma;
