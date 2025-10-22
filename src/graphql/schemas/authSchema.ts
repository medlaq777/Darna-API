export const authTypeDefs = `
  type User {
    id: ID!
    email: String!
    name: String
    role: String!
    isVerified: Boolean!
    twoFaEnabled: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthResponse {
    id: ID
    username: String
    email: String
    role: String
    message: String
    token: String
    pendingToken: String
  }

  type Query {
    me: User
  }

  type Mutation {
    register(data: RegisterInput!): AuthResponse!
    verifyEmail(email: String!, code: String!): AuthResponse!
    login(data: LoginInput!): AuthResponse!
    verify2FA(pendingToken: String!, code: String!): AuthResponse!
    enable2FA: AuthResponse!
  }
`;
