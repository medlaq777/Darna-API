import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { graphqlSchema } from "./graphql/index.ts";
import { ensureBucketExists } from "./utils/mino.ts";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
async function startServer() {
  const server = new ApolloServer({ schema: graphqlSchema });
  await server.start();

  app.use("/graphql", expressMiddleware(server));
  ensureBucketExists();
  app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
  );
}

startServer();
