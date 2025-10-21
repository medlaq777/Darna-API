import { makeExecutableSchema } from "@graphql-tools/schema";
import { propertyTypeDefs } from "./schemas/propertySchema.ts";
import { propertyResolvers } from "./resolvers/propertyResolver.ts";

export const graphqlSchema = makeExecutableSchema({
typeDefs: [propertyTypeDefs],
resolvers: [propertyResolvers],
});
