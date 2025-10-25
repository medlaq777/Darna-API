
export const propertyTypeDefs = `
  type Query {
    _empty: Boolean
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

  input MediaInput {
    url: String!
    thumbnail: String
    mimeType: String!
    size: Int
  }

  input AddressInput {
    street: String
    city: String
    postal: String
    country: String
    lat: Float
    lng: Float
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
    medias: [MediaInput!]
    status : PropertyStatus!
  }

  type Media {
    id: ID!
    url: String!
    thumbnail: String
    mimeType: String!
    size: Int
    uploadedAt: String!
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

  type Property {
    id: ID!
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
    amenities: [String!]
    rules: String
    energyRating: String
    status: PropertyStatus!
    slug: String!
    medias: [Media!]
    createdAt: String!
    updatedAt: String!
  }

   type SignedUploadResponse {
    # The temporary URL to send the PUT request to
    uploadUrl: String!
    # The permanent, clean URL you will save in your database
    accessUrl: String!
  }
  type Mutation {
    createProperty(data: CreatePropertyInput!): Property!
    getUploadUrl(filename:String): SignedUploadResponse!
  }
  `;
