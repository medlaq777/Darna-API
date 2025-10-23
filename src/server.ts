import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { graphqlSchema } from "./graphql/index.ts";

const app = express();
const port = 3000; // or from your config
app.use(express.json())
async function startServer() {
  const server = new ApolloServer({ schema: graphqlSchema });
  await server.start();

  app.use("/graphql", expressMiddleware(server));
  app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
  );
}

startServer();
