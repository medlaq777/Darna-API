import type { z } from "zod";

import { PropertyService } from "../../modules/property.service.ts";
import {
  CreatePropertyInputSchema,
} from "../../utils/validation.ts";
import { bucketName, minioClient, publicUrl } from "../../utils/mino.ts";
import { randomUUID } from "crypto";

const propertyService = new PropertyService();

export const propertyResolvers = {
  Query: {
    _empty: () => true,
  },

  Mutation: {
    getUploadUrl: async (_: any, { filename }: { filename: String }) => {
      // 1. Create a unique, secure object name for the file
      const objectName = `${randomUUID()}-${filename.replace(/\s+/g, "_")}`;
      try {
        const uploadUrl = await minioClient.presignedPutObject(
          bucketName,
          objectName,
          5 * 60
        );
        // 3. Construct the permanent, "clean" URL that we will save in the DB
        const accessUrl = `${publicUrl}/${bucketName}/${objectName}`;
        return {
          uploadUrl: uploadUrl,
          accessUrl: accessUrl,
        };
      } catch (error) {
        console.error("Error creating pre-signed URL:", error);
        throw new Error("Could not get upload URL.");
      }
    },
    createProperty: async (
      _: any,
      args: {
        data: z.infer<typeof CreatePropertyInputSchema>;
      }
    ) => {
      // 1️⃣ Validate input
      const validatedData = CreatePropertyInputSchema.parse(args.data);

      // 2️⃣ Generate slug
      const slug = validatedData.title.toLowerCase().replace(/\s+/g, "-");

      try {

        const dataToSave = {
          ...validatedData,
          slug: slug,
        };

        return await propertyService.createProperty(dataToSave);
      } catch (error) {
        console.error("Error in createProperty:", error);
        throw new Error("Property creation failed.");
      }
    },
  },
};
  