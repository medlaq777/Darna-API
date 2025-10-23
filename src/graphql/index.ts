import { makeExecutableSchema } from "@graphql-tools/schema";
import { propertyTypeDefs } from "./schemas/property.schema.ts";
import { propertyResolvers } from "./resolvers/property.resolver.ts";

export const graphqlSchema = makeExecutableSchema({
typeDefs: [propertyTypeDefs],
resolvers: [propertyResolvers],
});
