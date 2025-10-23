import type z from "zod";
import prisma from "../../database/prisma.ts";
import {
  PropertyService,
} from "../../modules/property.service.ts";
import {
  CreatePropertyInputSchema,
  MediaInputSchema,
} from "../../utils/validation.ts";

const propertyService = new PropertyService();

export const propertyResolvers = {
  Mutation: {
    createProperty: async (_: any, args: { data: any }) => {
      // 1️⃣ Validate input
      const validatedData = CreatePropertyInputSchema.parse(args.data);

      // 2️⃣ Generate slug
      const slug = validatedData.title.toLowerCase().replace(/\s+/g, "-");
      return await propertyService.createProperty({ ...validatedData, slug });
    },
  },
};
