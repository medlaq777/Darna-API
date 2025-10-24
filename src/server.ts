import express from "express";
import cors from "cors";
import Config from "./config/index.ts";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { graphqlSchema } from "./graphql/index.ts";
import { getUserFromAuthHeader } from "./middlewares/auth.middleware.ts";
import passport from "./config/passport.config.ts";

const app = express();
const port = Config.PORT;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://studio.apollographql.com",
    "https://embeddable-sandbox.cdn.apollographql.com",
  ],
  credentials: true,
};
app.disable("x-powered-by");
app.use(express.json());
app.use(cors(corsOptions));

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
  app.use(
    "/graphql",
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = getUserFromAuthHeader(req.headers.authorization, req.headers as any);
        return { user };
      },
    })
  );

  app.listen({ port: port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

startServer();
