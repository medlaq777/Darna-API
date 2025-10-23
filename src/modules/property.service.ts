import {
  PrismaClient,
  Prisma,
  TransactionType,
  PropertyStatus,
  type Property,
} from "@prisma/client";
import type { PropertySchema } from "../utils/validation.ts";
import type z from "zod";

const prisma = new PrismaClient();

export class PropertyService {
  async createProperty(data: z.infer<typeof PropertySchema>) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Validate slug uniqueness
        const existingProperty = await tx.property.findUnique({
          where: { slug: data.slug },
        });
        if (existingProperty) {
          throw new Error(`Slug "${data.slug}" already exists.`);
        }

        // Create Property first
        const createData: any = {
          ownerId: data.ownerId,
          title: data.title,
          transaction: data.transaction,
          slug: data.slug,
        };
        if (data.description !== undefined)
          createData.description = data.description;
        if (data.price !== undefined) createData.price = data.price;
        if (data.pricePerDay !== undefined)
          createData.pricePerDay = data.pricePerDay;
        if (data.availableFrom !== undefined)
          createData.availableFrom = data.availableFrom;
        if (data.availableTo !== undefined)
          createData.availableTo = data.availableTo;
        if (data.surface !== undefined) createData.surface = data.surface;
        if (data.rooms !== undefined) createData.rooms = data.rooms;
        if (data.bedrooms !== undefined) createData.bedrooms = data.bedrooms;
        if (data.bathrooms !== undefined) createData.bathrooms = data.bathrooms;
        if (data.amenities !== undefined) createData.amenities = data.amenities;
        if (data.rules !== undefined) createData.rules = data.rules;
        if (data.energyRating !== undefined)
          createData.energyRating = data.energyRating;
        if (data.status !== undefined) createData.status = data.status;

        const property = await tx.property.create({
          data: createData,
        });

        // Create Address if provided
        let createdAddress;
        let addressCreated = false;
        if (data.address) {
          // Strip out any relational or unexpected fields (e.g. `property`) so the object
          // matches Prisma's AddressCreateInput shape before creating.
          const { property: _discardProperty, ...addressData } =
            data.address as any;
          createdAddress = await tx.address.create({
            data: addressData,
          });
          await tx.property.update({
            where: { id: property.id },
            data: { addressId: createdAddress.id },
          });
          addressCreated = true;
        }

        // Create or connect Medias if provided
        let mediasCreatedCount = 0;
        let mediasConnectedCount = 0;
        if (data.medias && data.medias.length > 0) {
          const mediasToCreate = data.medias.map((media) => {
            const {
              id: _discardId,
              property: _discardProperty,
              ...mediaData
            } = media as any;
            return {
              ...mediaData,
              propertyId: property.id,
            };
          });
          const mediasResult = await tx.media.createMany({
            data: mediasToCreate as Prisma.MediaCreateManyInput[],
          });
          mediasCreatedCount = mediasResult.count;
        }
        const mediaIds = (data as any).mediaIds as string[] | undefined;
        if (mediaIds && mediaIds.length > 0) {
          // Validate Media IDs exist
          const existingMedias = await tx.media.findMany({
            where: { id: { in: mediaIds } },
          });
          if (existingMedias.length !== mediaIds.length) {
            throw new Error("One or more media IDs do not exist.");
          }
          await tx.property.update({
            where: { id: property.id },
            data: {
              medias: {
                connect: mediaIds.map((id) => ({ id })),
              },
            },
          });
          mediasConnectedCount = mediaIds.length;
        }

        // Fetch final Property with relations
        const finalProperty = await tx.property.findUniqueOrThrow({
          where: { id: property.id },
          include: {
            address: true,
            medias: true,
          },
        });

        return finalProperty;
      });
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
