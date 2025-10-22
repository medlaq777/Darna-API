import type { Prisma } from "@prisma/client";
import prisma from "../database/prisma.ts";


export class PropertyService {
  async createProperty(data: Prisma.PropertyCreateInput) {
    return prisma.property.create({ data });
  }

  async getAllProperties() {
    return prisma.property.findMany();
  }

  async getPropertyById(id: string) {
    return prisma.property.findUnique({ where: { id } });
  }

  async updateProperty(id: string, data: Prisma.PropertyUpdateInput) {
    return prisma.property.update({
      where: { id },
      data,
    });
  }

  async deleteProperty(id: string) {
    return prisma.property.delete({ where: { id } });
  }
}
