import prisma from "../../database/prisma.ts";
import {
  PropertyService,
} from "../../modules/property.service.ts";
import {  PropertySchema } from "../../utils/validation.ts";

const propertyService = new PropertyService();

export const propertyResolvers = {
  Query: {
    getProperties: async () => {
      return propertyService.getAllProperties();
    },
    getProperty: async (_: any, { id }: { id: string }) => {
      return propertyService.getPropertyById(id);
    },
  },
  Mutation: {
    createProperty: async (_: any, { data }: any) => {
      const validatedData = PropertySchema.parse(data);
      validatedData.slug =
        (validatedData as any).slug ??
        validatedData.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

    

      return propertyService.createProperty(validatedData);
    },

    deleteProperty: async (_: any, { id }: any) => {
      return propertyService.deleteProperty(id);
    },
  },
};
