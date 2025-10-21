import "dotenv";
import express from "express";
import cors from "cors";
import Config from "./config/index.ts";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { graphqlSchema } from "./graphql/index.ts";

const app = express();
const port = Config.port;

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeader: ["Content-Type", "Authorization"],
  credentials: true,
};
app.disable("x-powered-by");
app.options("/api", cors(corsOptions));
app.disable("x-powred-by");

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    const status: number = err.status || 500;
    res.status(status).json({
      message: err.message || "Internal Server Error",
      status: status,
    });
  }
);

async function startServer() {
  const server = new ApolloServer({ schema: graphqlSchema });

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen({ port: port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

startServer();
