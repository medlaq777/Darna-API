import { z } from "zod";

export const MediaInputSchema = z.object({
  url: z.string().nullable(),
  thumbnail: z.string().url().optional().nullable(),
  mimeType: z.string().nullable(),
  size: z.number().int().nullable(),
});

export const AddressInputSchema = z.object({
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
});

export const CreatePropertyInputSchema = z.object({
  ownerId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  transaction: z.enum(["sale", "rent_daily", "rent_monthly", "rent_long"]),
  price: z.number().optional().nullable(),
  pricePerDay: z.number().optional().nullable(),
  availableFrom: z.string().optional().nullable(),
  availableTo: z.string().optional().nullable(),
  address: AddressInputSchema.optional().nullable(),
  surface: z.number().optional().nullable(),
  rooms: z.number().int().optional().nullable(),
  bedrooms: z.number().int().optional().nullable(),
  bathrooms: z.number().int().optional().nullable(),
  amenities: z.array(z.string()).optional().nullable(),
  rules: z.string().optional().nullable(),
  energyRating: z.string().optional().nullable(),
  medias: z.array(MediaInputSchema).optional().nullable(),
  slug: z.string().optional(),
  status: z.enum(["Draft", "Published", "Archived"]).default("Draft"),
});

