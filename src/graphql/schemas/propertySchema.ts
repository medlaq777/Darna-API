

export const propertyTypeDefs = `
  type Property {
    id: ID!
    title: String!
    description: String
    price: Float!
    location: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePropertyInput {
    title: String!
    description: String
    price: Float!
    location: String!
  }

  input UpdatePropertyInput {
    title: String
    description: String
    price: Float
    location: String
  }

  type Query {
    getProperties: [Property!]!
    getProperty(id: ID!): Property
  }

  type Mutation {
    createProperty(data: CreatePropertyInput!): Property!
    updateProperty(id: ID!, data: UpdatePropertyInput!): Property!
    deleteProperty(id: ID!): Property!
  }
`
