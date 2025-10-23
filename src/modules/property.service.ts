import {
  PrismaClient,
  Prisma,
  TransactionType,
  PropertyStatus,
  type Property,
} from "@prisma/client";
import type z from "zod";
import type { CreatePropertyInputSchema } from "../utils/validation.ts";

const prisma = new PrismaClient();

export class PropertyService {
  async createProperty(data: z.infer<typeof CreatePropertyInputSchema>) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: data.ownerId,
        },
      });
      if (!user) throw new Error("User not found");
      const propertyExist = await prisma.property.findUnique({
        where:{
          slug:data.slug!
        }
      })
      if(propertyExist) throw new Error("A Property already has this title")
      const formatedData: Prisma.PropertyCreateInput = {
        title: data.title,
        owner: { connect: { id: data.ownerId } },
        transaction: data.transaction,
        status: data.status,
        slug: data.slug!,
        price: data.price ?? null,
        pricePerDay: data.pricePerDay ?? null,
        availableFrom: data.availableFrom ?? null,
        availableTo: data.availableTo ?? null,
        surface: data.surface ?? null,
        rooms: data.rooms ?? null,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        amenities: data.amenities ?? [],
        rules: data.rules ?? null,
        energyRating: data.energyRating ?? null,
      };

      if (data.address) {
        formatedData.address = {
          create: {
            street: data.address.street ?? null,
            city: data.address.city ?? null,
            postal: data.address.postal ?? null,
            country: data.address.country ?? null,
            lat: data.address.lat ?? null,
            lng: data.address.lng ?? null,
          },
        };
      }

      if (data.medias && data.medias.length > 0) {
        // map incoming medias into the shape Prisma expects for nested create
        formatedData.medias = {
          create: data.medias.map(
            (med) => med as Prisma.MediaCreateWithoutPropertyInput
          ),
        };
      }

      const property = await prisma.property.create({
        data: formatedData,
      });

      return property;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new Error(`Invalid data structure: ${error.message}`);
      }
      throw error;
    }
  }

  async getAllProperties() {
    return prisma.property.findMany({
      include: { address: true, medias: true },
    });
  }

  async getPropertyById(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: { address: true, medias: true },
    });
  }

  async deleteProperty(id: string) {
    return prisma.property.delete({
      where: { id },
      include: { address: true, medias: true },
    });
  }
}
