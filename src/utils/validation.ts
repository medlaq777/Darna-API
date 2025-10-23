import { z } from "zod";

//
// 🧩 ENUMS
//
export const TransactionTypeEnum = z.enum(["sale", "rent_daily", "rent_monthly", "rent_long"]);
export const PropertyStatusEnum = z.enum(["Draft", "Published", "Archived"]);

//
// 🧩 ADDRESS MODEL
//
export const AddressSchema = z.object({
  id: z.string().optional(), // @default(auto())
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  property: z.any().optional().nullable(), // relation placeholder
});

//
// 🧩 MEDIA MODEL
//
export const MediaSchema = z.object({
  id: z.string().optional(), // @default(auto())
  url: z.string(),
  thumbnail: z.string().optional().nullable(),
  mimeType: z.string(),
  size: z.number().optional().nullable(),
  uploadedAt: z.union([z.string(), z.date()]).optional(), // default(now())
  ownerId: z.string(),
  propertyId: z.string().optional().nullable(),
  property: z.any().optional().nullable(), // relation placeholder
});

//
// 🧩 PROPERTY MODEL
//
export const PropertySchema = z.object({
  id: z.string().optional(),
  ownerId: z.string(),
  owner: z.any().optional(), // relation to User (placeholder)
  title: z.string(),
  description: z.string().optional().nullable(),
  transaction: TransactionTypeEnum,
  price: z.number().optional().nullable(),
  pricePerDay: z.number().optional().nullable(),
  availableFrom: z.union([z.string(), z.date()]).optional().nullable(),
  availableTo: z.union([z.string(), z.date()]).optional().nullable(),
  addressId: z.string().optional().nullable(),
  address: AddressSchema.optional().nullable(),
  surface: z.number().optional().nullable(),
  rooms: z.number().optional().nullable(),
  bedrooms: z.number().optional().nullable(),
  bathrooms: z.number().optional().nullable(),
  amenities: z.array(z.string()).default([]),
  rules: z.string().optional().nullable(),
  energyRating: z.string().optional().nullable(),
  status: PropertyStatusEnum.default("Draft"),
  slug: z.string(),
  medias: z.array(MediaSchema).optional().default([]),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});
