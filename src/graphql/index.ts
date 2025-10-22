import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { propertyTypeDefs } from "./schemas/propertySchema.ts";
import { propertyResolvers } from "./resolvers/propertyResolver.ts";
import { authTypeDefs } from "./schemas/authSchema.ts";
import { resolvers as authResolvers } from "./resolvers/auth.resolver.ts";

export const graphqlSchema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([propertyTypeDefs, authTypeDefs]),
  resolvers: [propertyResolvers, authResolvers],
});
