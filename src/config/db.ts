import { PrismaClient } from "@prisma/client"

class Database {
  private static instance: PrismaClient;
  private constructor() { }
  static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: ['query', 'warn', 'error'],
      });
      console.log('Prisma client connected');
    }
    return Database.instance;
  }
}
export default Database;
