export const propertyTypeDefs = `
type User {
  id: ID!
  name: String
  email: String!
  role: String
  createdAt: String
  updatedAt: String
}

enum TransactionType {
  sale
  rent_daily
  rent_monthly
  rent_long
}

enum PropertyStatus {
  Draft
  Published
  Archived
}

type Address {
  id: ID!
  street: String
  city: String
  postal: String
  country: String
  lat: Float
  lng: Float
}

type Media {
  id: ID!
  url: String!
  thumbnail: String
  mimeType: String!
  size: Int
  uploadedAt: String!
  ownerId: ID!
  propertyId: ID
}

type Property {
  id: ID!
  ownerId: ID!
  owner: User
  title: String!
  description: String
  transaction: TransactionType!
  price: Float
  pricePerDay: Float
  availableFrom: String
  availableTo: String
  address: Address
  surface: Float
  rooms: Int
  bedrooms: Int
  bathrooms: Int
  amenities: [String!]!
  rules: String
  energyRating: String
  status: PropertyStatus!
  slug: String!
  medias: [Media!]!
  createdAt: String!
  updatedAt: String!
}

input AddressInput {
  street: String
  city: String
  postal: String
  country: String
  lat: Float
  lng: Float
}

input MediaInput {
  url: String!
  mimeType: String!
  ownerId: ID!
  thumbnail: String
  size: Int
}

input CreatePropertyInput {
  ownerId: ID!
  title: String!
  description: String
  transaction: TransactionType!
  price: Float
  pricePerDay: Float
  availableFrom: String
  availableTo: String
  address: AddressInput
  surface: Float
  rooms: Int
  bedrooms: Int
  bathrooms: Int
  amenities: [String!]
  rules: String
  energyRating: String
  status: PropertyStatus
  slug: String
  medias: [MediaInput!]
  mediaIds: [ID!]
}

input UpdatePropertyInput {
  title: String
  description: String
  transaction: TransactionType
  price: Float
  pricePerDay: Float
  availableFrom: String
  availableTo: String
  address: AddressInput
  surface: Float
  rooms: Int
  bedrooms: Int
  bathrooms: Int
  amenities: [String!]
  rules: String
  energyRating: String
  status: PropertyStatus
  slug: String
  mediaIds: [ID!]
}

type CreatePropertyResponse {
  property: Property!
  addressCreated: Boolean!
  mediasCreatedCount: Int!
  mediasConnectedCount: Int!
}

type Query {
  getProperties: [Property!]!
  getProperty(id: ID!): Property
}

type Mutation {
  createProperty(data: CreatePropertyInput!): CreatePropertyResponse!
  updateProperty(id: ID!, data: UpdatePropertyInput!): Property!
  deleteProperty(id: ID!): Property!
}
`;
